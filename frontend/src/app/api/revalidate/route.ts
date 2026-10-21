import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

// Cache-invalidation webhook called by the CMS after content changes.
//   POST /api/revalidate
//   Authorization: Bearer <REVALIDATE_SECRET>
//   { "tags": ["global:home-page", "globals", ...] }
// Tags must match the cacheTag() calls in src/lib/cms.ts.
// Only POST is exported, so other methods get 405 from Next.js.

const GLOBAL_SLUGS = [
  "site-settings",
  "navigation",
  "home-page",
  "about-page",
  "contact-page",
  "events-page",
  "ui-strings",
  "home-content",
  "about-content",
  "work-content",
  "csr-content",
  "volunteer-content",
  "gallery-content",
  "contact-content",
  "partners-content",
  "footer-content",
] as const;

const ALLOWED_TAGS = new Set<string>([
  "globals",
  "media",
  "pillars",
  "events",
  ...GLOBAL_SLUGS.map((s) => `global:${s}`),
]);

const MAX_TAGS = 20;
const MAX_BODY_BYTES = 4096;

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Constant-time comparison of the presented bearer token with the secret. */
function isAuthorized(header: string | null, secret: string): boolean {
  const match = header ? /^Bearer\s+(.+)$/i.exec(header.trim()) : null;
  if (!match) return false;
  const given = Buffer.from(match[1], "utf8");
  const expected = Buffer.from(secret, "utf8");
  // timingSafeEqual requires equal lengths; compare against itself on mismatch
  // so the work done does not depend on where the inputs differ.
  if (given.length !== expected.length) {
    timingSafeEqual(expected, expected);
    return false;
  }
  return timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return json({ error: "Revalidation is not configured" }, 503);

  if (!isAuthorized(request.headers.get("authorization"), secret)) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json({ error: "Body too large" }, 400);
    body = JSON.parse(text);
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const tags = (body as { tags?: unknown } | null)?.tags;
  if (
    !Array.isArray(tags) ||
    tags.length > MAX_TAGS ||
    !tags.every((t): t is string => typeof t === "string" && ALLOWED_TAGS.has(t))
  ) {
    return json({ error: `Body must be {"tags": [...]} with up to ${MAX_TAGS} allowed tags` }, 400);
  }

  const unique = [...new Set(tags)];
  for (const tag of unique) revalidateTag(tag, "max");

  return json({ revalidated: unique });
}
