"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PORTAL_TOKEN_COOKIE,
  getVisitorIp,
  isPortal,
  loginToCms,
  logoutFromCms,
} from "@/lib/portal-auth";

// Server Actions for the portal login/logout forms. Next's built-in Server
// Action CSRF check (Origin must match Host) applies — do not add
// `serverActions.allowedOrigins` unless a trusted proxy domain needs it.
// All input is untrusted: the portal, email and password are re-validated here.

export type LoginState = { error: string | null; email: string };

const MSG_INVALID = "The email or password provided is incorrect.";
const MSG_RATE_LIMITED = "Too many attempts. Please try again later.";
const MSG_UNAVAILABLE = "Login is unavailable right now. Please try again later.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const portal = formData.get("portal");
  const rawEmail = formData.get("email");
  const password = formData.get("password");

  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase().slice(0, 254) : "";

  if (!isPortal(portal)) return { error: MSG_INVALID, email: "" };
  if (
    !EMAIL_RE.test(email) ||
    typeof password !== "string" ||
    password.length < 1 ||
    password.length > 128
  ) {
    return { error: MSG_INVALID, email };
  }

  const result = await loginToCms(email, password, await getVisitorIp());

  if (!result.ok) {
    const error =
      result.reason === "rate-limited" ? MSG_RATE_LIMITED : result.reason === "unavailable" ? MSG_UNAVAILABLE : MSG_INVALID;
    return { error, email };
  }

  // A valid account for the OTHER portal is treated exactly like wrong
  // credentials (no portal enumeration); drop the session it just created.
  if (result.user.portal !== portal) {
    await logoutFromCms(result.token);
    return { error: MSG_INVALID, email };
  }

  const jar = await cookies();
  // Replacing an existing session: revoke the old one server-side first.
  const previous = jar.get(PORTAL_TOKEN_COOKIE)?.value;
  if (previous && previous !== result.token) await logoutFromCms(previous);

  jar.set(PORTAL_TOKEN_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // rules.md §3.4
    path: "/",
    maxAge: result.maxAge,
  });

  // redirect() throws — keep it outside any try/catch.
  redirect(`/portal/${portal}`);
}

export async function logoutAction(formData: FormData): Promise<void> {
  const portal = formData.get("portal");
  const jar = await cookies();
  const token = jar.get(PORTAL_TOKEN_COOKIE)?.value;
  if (token) await logoutFromCms(token);
  jar.delete(PORTAL_TOKEN_COOKIE);
  redirect(isPortal(portal) ? `/login/${portal}` : "/");
}
