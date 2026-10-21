import { createHash, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import { NextResponse, type NextRequest } from "next/server";

// Abuse protection for the CMS API (Next 16 "proxy", formerly middleware).
//
// Layer 1 of rate limiting: a per-instance, in-memory sliding window. It stops
// naive brute force / spam from a single IP. On serverless each instance has
// its own memory, so production MUST also enable a platform rate limit
// (Vercel Firewall / WAF rules) — see rules.md §2. Payload itself adds
// account lockout (maxLoginAttempts) as layer 2.

type Rule = { test: (path: string, method: string) => boolean; limit: number; windowMs: number; name: string };

const MIN = 60_000;

const RULES: Rule[] = [
  // Credential & token endpoints — strict.
  {
    name: "auth",
    test: (p, m) =>
      m === "POST" &&
      /^\/api\/(users|portal-users)\/(login|forgot-password|reset-password|first-register|unlock|refresh-token)\/?$/.test(p),
    limit: 10,
    windowMs: 15 * MIN,
  },
  // Uploads — moderate.
  { name: "upload", test: (p, m) => m !== "GET" && p.startsWith("/api/media"), limit: 60, windowMs: 10 * MIN },
  // Admin panel server functions (form state refreshes while typing) — generous.
  { name: "admin", test: (p, m) => m === "POST" && p.startsWith("/admin"), limit: 3000, windowMs: 5 * MIN },
  // Any other write to the API.
  {
    name: "write",
    test: (p, m) => m !== "GET" && m !== "HEAD" && m !== "OPTIONS" && p.startsWith("/api/"),
    limit: 300,
    windowMs: 5 * MIN,
  },
  // Public API reads (the frontend server is exempt via x-frontend-key, see below).
  { name: "read", test: (p) => p.startsWith("/api/"), limit: 600, windowMs: 5 * MIN },
];

const buckets = new Map<string, number[]>();
const MAX_KEYS = 10_000;

// Client IP without trusting spoofable headers:
// - On Vercel the edge sets x-real-ip / overwrites x-forwarded-for.
// - Self-hosted: only trust X-Forwarded-For entries added by our own proxies
//   (TRUSTED_PROXY_HOPS = how many reverse proxies sit in front of Next).
function clientIp(req: NextRequest): string {
  if (process.env.VERCEL) {
    return (req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
  }
  const hops = Number(process.env.TRUSTED_PROXY_HOPS ?? 0);
  const xff = (req.headers.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return hops > 0 && xff.length >= hops ? xff[xff.length - hops] : "unknown";
}

// Canonical path so encodings / slashes / case can't dodge a rule
// (e.g. /api/users/%6Cogin or /api/users//login/).
function canonicalPath(raw: string): string | null {
  try {
    return decodeURIComponent(raw).replace(/\/{2,}/g, "/").replace(/\/+$/, "").toLowerCase() || "/";
  } catch {
    return null;
  }
}

function hit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  buckets.set(key, recent);
  // Bound memory: drop the oldest keys if an attacker rotates IPs.
  if (buckets.size > MAX_KEYS) {
    for (const k of buckets.keys()) {
      buckets.delete(k);
      if (buckets.size <= MAX_KEYS * 0.9) break;
    }
  }
  return { ok: true, retryAfter: 0 };
}

// The frontend app's server reads the REST API on every cache miss, so all of
// its requests come from one IP. It authenticates with a shared key
// (x-frontend-key = FRONTEND_API_KEY) and is exempt from the API *read* limit
// only. Hashing both sides gives equal-length buffers for a constant-time compare.
const sha256 = (s: string) => createHash("sha256").update(s).digest();
function isFrontendServer(req: NextRequest): boolean {
  const expected = process.env.FRONTEND_API_KEY;
  const given = req.headers.get("x-frontend-key");
  if (!expected || !given) return false;
  return timingSafeEqual(sha256(given), sha256(expected));
}

// Portal logins (/api/portal-users/*) are proxied by the frontend server, so
// they all arrive from its single IP. When the request carries a valid
// x-frontend-key, the frontend forwards the real visitor IP in
// x-portal-client-ip and we limit per visitor instead. Only a plausible IP
// literal is accepted; anything else falls back to the connection IP (which
// then shares the frontend server's bucket — fail closed, not open).
function portalClientIp(req: NextRequest): string | null {
  if (!isFrontendServer(req)) return null;
  const raw = req.headers.get("x-portal-client-ip")?.trim() ?? "";
  if (raw.length > 45 || !/^[0-9a-f:.]+$/i.test(raw) || isIP(raw) === 0) return null;
  return raw.toLowerCase();
}

export function proxy(req: NextRequest) {
  const path = canonicalPath(req.nextUrl.pathname);
  if (path === null) return new NextResponse(null, { status: 400 });
  const method = req.method.toUpperCase();
  // Public uploaded files are static content — never throttle (next/image fetches them).
  if ((method === "GET" || method === "HEAD") && path.startsWith("/api/media/file/")) return NextResponse.next();
  const rule = RULES.find((r) => r.test(path, method));
  if (!rule) return NextResponse.next();
  const isPortal = path === "/api/portal-users" || path.startsWith("/api/portal-users/");
  // Frontend server content reads are exempt; portal account requests (e.g.
  // /me) are not — they stay limited per visitor IP.
  if (rule.name === "read" && !isPortal && (method === "GET" || method === "HEAD") && isFrontendServer(req)) {
    return NextResponse.next();
  }

  const ip = (isPortal ? portalClientIp(req) : null) ?? clientIp(req);
  const { ok, retryAfter } = hit(`${rule.name}:${ip}`, rule.limit, rule.windowMs);
  if (!ok) {
    console.warn(JSON.stringify({ msg: "ratelimit.blocked", rule: rule.name, ip, path, method }));
    return NextResponse.json(
      { errors: [{ message: "Too many requests. Please try again later." }] },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
