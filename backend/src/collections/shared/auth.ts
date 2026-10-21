import {
  ValidationError,
  type CollectionAfterChangeHook,
  type CollectionAfterErrorHook,
  type CollectionAfterLoginHook,
  type CollectionBeforeOperationHook,
  type IncomingAuthType,
  type PayloadRequest,
} from "payload";
import type { AuthCollection } from "@/access";

// Hardening shared by every auth collection (staff `users`, `portal-users`).
// See rules.md §3.4 — don't loosen these without review.

const isProd = process.env.NODE_ENV === "production";

const PASSWORD_MIN = 12;
const PASSWORD_MAX = 128;

// One generic message for unknown email, wrong password and locked account,
// so a login form cannot be used to discover which emails exist.
const GENERIC_LOGIN_ERROR = "The email or password provided is incorrect.";

export const clientIp = (req: PayloadRequest) =>
  req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export const hardenedAuth: IncomingAuthType = {
  // Short-lived session token; the admin panel refreshes it while active.
  tokenExpiration: 60 * 15, // 15 minutes
  // Server-side sessions: logout, password reset and password change revoke tokens.
  useSessions: true,
  // Brute-force protection: lock the account after repeated failures.
  maxLoginAttempts: 5,
  lockTime: 15 * 60 * 1000, // 15 minutes
  // The JWT lives only in the HttpOnly cookie — never in JSON bodies.
  removeTokenFromResponses: true,
  cookies: {
    secure: isProd,
    sameSite: "Strict",
  },
};

// Password policy (covers create, update, first-register and reset-password).
// Also flags password changes so `revokeOtherSessions` can run afterwards.
export const enforcePasswordPolicy: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  const pw = (args as { data?: { password?: unknown } } | undefined)?.data?.password;
  if (
    ["create", "update", "resetPassword"].includes(operation) &&
    typeof pw === "string" &&
    (pw.length < PASSWORD_MIN || pw.length > PASSWORD_MAX)
  ) {
    throw new ValidationError({
      errors: [{ path: "password", message: `Password must be ${PASSWORD_MIN}–${PASSWORD_MAX} characters.` }],
    });
  }
  if (operation === "update" && typeof pw === "string") req.context.passwordChanged = true;
};

// Password change ⇒ revoke every other session (stolen cookies stop working).
// Only the editor's own current session survives, and only when they changed
// their own password (same collection + same id).
export const revokeOtherSessions =
  (collection: AuthCollection): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    if (operation !== "update" || !req.context.passwordChanged) return doc;
    const user = await req.payload.db.findOne<{ id: number | string; sessions?: { id: string }[] }>({
      collection,
      where: { id: { equals: doc.id } },
      req,
    });
    if (user) {
      const isSelf = req.user?.collection === collection && req.user.id === doc.id;
      const keep = isSelf ? (req.user as { _sid?: string })._sid : undefined;
      await req.payload.db.updateOne({
        collection,
        id: doc.id,
        data: { ...user, sessions: (user.sessions ?? []).filter((s) => s.id === keep) },
        req,
      });
    }
    req.payload.logger.info({ msg: "auth.password.changed", collection, userId: doc.id, ip: clientIp(req) });
    return doc;
  };

export const logLoginSuccess =
  (collection: AuthCollection): CollectionAfterLoginHook =>
  ({ req, user }) => {
    req.payload.logger.info({ msg: "auth.login.success", collection, userId: user.id, ip: clientIp(req) });
  };

// Match on status + route, not error.name (class names are minified in
// production builds). Covers wrong password, unknown email and locked.
export const genericLoginError = (collection: AuthCollection): CollectionAfterErrorHook => {
  const loginPath = new RegExp(`/${collection}/login/?$`);
  return ({ error, req }) => {
    const status = (error as { status?: number })?.status;
    const isLogin = loginPath.test(new URL(req.url ?? "http://x/").pathname);
    if (status === 401 && isLogin) {
      req.payload.logger.warn({ msg: "auth.login.failed", collection, ip: clientIp(req) });
      return { response: { errors: [{ message: GENERIC_LOGIN_ERROR }] }, status: 401 };
    }
  };
};
