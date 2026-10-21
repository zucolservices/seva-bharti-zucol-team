import "server-only";
import { cookies, headers } from "next/headers";

// Portal logins (Pathology Lab / Publication) against the CMS `portal-users`
// auth collection.
//
// - The CMS returns the session token ONLY in a Set-Cookie header (scoped to
//   the CMS origin). We lift it out server-side and store it in OUR own
//   HttpOnly cookie (PORTAL_TOKEN_COOKIE) on the site origin. The browser never
//   sees the token in JS and never talks to the CMS directly.
// - Every request is per-visitor and uncached: no "use cache" anywhere here.
// - Never log passwords, tokens, cookies or response bodies.

export const PORTALS = {
  pathology: {
    title: "Pathology Lab Login",
    portalTitle: "Pathology Lab Portal",
    blurb:
      "Sign in to the Sewa Bharti pathology lab portal to access your lab reports.",
  },
  publication: {
    title: "Publication Login",
    portalTitle: "Publication Portal",
    blurb:
      "Sign in to the Sewa Bharti publication portal to manage submissions and downloads.",
  },
} as const;

export type Portal = keyof typeof PORTALS;

export const PORTAL_SLUGS = Object.keys(PORTALS) as Portal[];

export function isPortal(x: unknown): x is Portal {
  return typeof x === "string" && Object.prototype.hasOwnProperty.call(PORTALS, x);
}

/** Our cookie (site origin) that holds the CMS session token. */
export const PORTAL_TOKEN_COOKIE = "sb-portal-token";

/** Preferred name of the CMS's token cookie; any `*-token` cookie is accepted (prefix may differ). */
export const CMS_TOKEN_COOKIE = "payload-token";
const CMS_TOKEN_COOKIE_SUFFIX = "-token";

/** Backend token lifetime (portal-users tokenExpiration) — our cookie never outlives it. */
export const PORTAL_SESSION_MAX_AGE_S = 15 * 60;

export type PortalUser = {
  id: string | number;
  email: string;
  name: string | null;
  portal: Portal;
};

export type LoginResult =
  | { ok: true; user: PortalUser; token: string; maxAge: number }
  | { ok: false; reason: "invalid" | "rate-limited" | "unavailable" };

const CMS_URL = (process.env.CMS_URL || "http://localhost:3001").replace(/\/+$/, "");
const TIMEOUT_MS = 10_000;

function cmsHeaders(extra?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { Accept: "application/json", ...extra };
  const key = process.env.FRONTEND_API_KEY;
  if (key) h["x-frontend-key"] = key;
  return h;
}

/**
 * Visitor IP for the backend's per-visitor login rate limit. Proxy headers can
 * be forged by the client, so they are trusted only behind a known proxy:
 * - on Vercel the edge sets `x-real-ip` / `x-forwarded-for`;
 * - self-hosted, set TRUSTED_PROXY_HOPS to the number of proxies in front of
 *   this app; the IP is read that many entries from the right of `x-forwarded-for`.
 * Otherwise "unknown", and the backend falls back to its own connection IP.
 */
export async function getVisitorIp(): Promise<string> {
  const h = await headers();
  let ip: string | undefined;
  if (process.env.VERCEL) {
    ip = h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",")[0]?.trim();
  } else {
    const hops = Number(process.env.TRUSTED_PROXY_HOPS ?? 0);
    if (Number.isInteger(hops) && hops > 0) {
      const chain = (h.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      ip = chain[chain.length - hops];
    }
  }
  // Header value sanity: IPs only (v4/v6 chars), bounded length.
  return ip && /^[0-9a-fA-F:.]{2,45}$/.test(ip) ? ip : "unknown";
}

function logEvent(event: string, data: Record<string, unknown> = {}) {
  console.warn(JSON.stringify({ event, ...data }));
}

/** Narrow an untrusted CMS user object to what the frontend needs. */
function toPortalUser(u: unknown): PortalUser | null {
  if (!u || typeof u !== "object") return null;
  const r = u as Record<string, unknown>;
  const id = r.id;
  if (typeof id !== "string" && typeof id !== "number") return null;
  if (typeof r.email !== "string" || !isPortal(r.portal)) return null;
  return {
    id,
    email: r.email,
    name: typeof r.name === "string" && r.name.trim() ? r.name.trim() : null,
    portal: r.portal,
  };
}

/** Extract the token from the CMS response's Set-Cookie headers (any `*-token` cookie). */
function tokenFromSetCookie(res: Response): string | null {
  const found: { name: string; value: string }[] = [];
  for (const line of res.headers.getSetCookie()) {
    const pair = line.split(";", 1)[0];
    const eq = pair.indexOf("=");
    if (eq <= 0) continue;
    const name = pair.slice(0, eq).trim();
    let value = pair.slice(eq + 1).trim();
    if (!name.endsWith(CMS_TOKEN_COOKIE_SUFFIX) || !value) continue;
    try {
      value = decodeURIComponent(value);
    } catch {
      continue;
    }
    found.push({ name, value });
  }
  return (found.find((c) => c.name === CMS_TOKEN_COOKIE) ?? found[0])?.value ?? null;
}

/** POST /api/portal-users/login. No retries (each attempt counts towards lockout / rate limits). */
export async function loginToCms(email: string, password: string, ip: string): Promise<LoginResult> {
  let res: Response;
  try {
    res = await fetch(`${CMS_URL}/api/portal-users/login`, {
      method: "POST",
      headers: cmsHeaders({ "Content-Type": "application/json", "x-portal-client-ip": ip }),
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    logEvent("portal.login.unavailable", { error: err instanceof Error ? err.name : "unknown" });
    return { ok: false, reason: "unavailable" };
  }

  if (res.status === 429) {
    logEvent("portal.login.rate_limited", { ip });
    return { ok: false, reason: "rate-limited" };
  }
  if (res.status === 400 || res.status === 401 || res.status === 403) {
    logEvent("portal.login.failed", { ip, status: res.status });
    return { ok: false, reason: "invalid" };
  }
  if (!res.ok) {
    logEvent("portal.login.unavailable", { status: res.status });
    return { ok: false, reason: "unavailable" };
  }

  let body: { user?: unknown; exp?: unknown };
  try {
    body = (await res.json()) as typeof body;
  } catch {
    logEvent("portal.login.unavailable", { reason: "bad-json" });
    return { ok: false, reason: "unavailable" };
  }

  const token = tokenFromSetCookie(res);
  const user = toPortalUser(body.user);
  if (!token || !user) {
    logEvent("portal.login.unavailable", { reason: !token ? "no-token-cookie" : "bad-user" });
    if (token) await logoutFromCms(token);
    return { ok: false, reason: "unavailable" };
  }

  // Cookie lifetime: the backend's `exp` (seconds since epoch), capped at 15 min.
  let maxAge = PORTAL_SESSION_MAX_AGE_S;
  if (typeof body.exp === "number" && Number.isFinite(body.exp)) {
    const left = Math.floor(body.exp - Date.now() / 1000);
    if (left > 0) maxAge = Math.min(maxAge, left);
  }

  return { ok: true, user, token, maxAge };
}

/** GET /api/portal-users/me for a token. Returns null when the token is invalid/expired or the CMS fails. */
async function meFromCms(token: string): Promise<PortalUser | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/portal-users/me`, {
      headers: cmsHeaders({ Authorization: `JWT ${token}` }),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      if (res.status !== 401 && res.status !== 403) logEvent("portal.me.failed", { status: res.status });
      return null;
    }
    const body = (await res.json()) as { user?: unknown };
    return toPortalUser(body.user);
  } catch (err) {
    logEvent("portal.me.failed", { error: err instanceof Error ? err.name : "unknown" });
    return null;
  }
}

/**
 * The signed-in portal user for THIS request, or null.
 * Reads our cookie and asks the CMS every time — never cached. Call it from a
 * dynamic render (blocking page or inside <Suspense>) or a Server Action.
 */
export async function getPortalUser(): Promise<PortalUser | null> {
  const token = (await cookies()).get(PORTAL_TOKEN_COOKIE)?.value;
  if (!token) return null;
  return meFromCms(token);
}

/** POST /api/portal-users/logout — revokes the CMS session. Best effort; never throws. */
export async function logoutFromCms(token: string): Promise<void> {
  try {
    const res = await fetch(`${CMS_URL}/api/portal-users/logout`, {
      method: "POST",
      headers: cmsHeaders({ Authorization: `JWT ${token}` }),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok && res.status !== 401) logEvent("portal.logout.failed", { status: res.status });
  } catch (err) {
    logEvent("portal.logout.failed", { error: err instanceof Error ? err.name : "unknown" });
  }
}
