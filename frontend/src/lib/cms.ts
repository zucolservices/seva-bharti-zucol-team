import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Config, Event, Media, Pillar } from "@/payload-types";

// THE ONLY place the frontend reads CMS data.
//
// - Content comes from the separate Payload CMS app over its REST API
//   (`${CMS_URL}/api/...`), server-side only. Requests carry the shared
//   `x-frontend-key` header so the CMS skips rate limiting for this app.
// - REST reads are anonymous, so the PUBLIC access rules apply (e.g. draft
//   events are never returned).
// - Every read is cached with `use cache` + cacheTag and invalidated by the
//   CMS's revalidate hooks via POST /api/revalidate (tags must match).
// - Failures are logged and degrade to empty data instead of crashing pages;
//   a failed read is cached for seconds only, a successful one until revalidated.
// - CMS_SNAPSHOT=1 ("frontend only" deploy, no CMS): reads come from the
//   static export in src/content-snapshot/data.json instead.

type GlobalSlug = keyof Config["globals"];

const CMS_URL = (process.env.CMS_URL || "http://localhost:3001").replace(/\/+$/, "");

const SNAPSHOT = process.env.CMS_SNAPSHOT === "1";

// Fail fast with a clear message instead of confusing prerender errors:
// a production build without CMS_URL would silently fall back to localhost.
if (!SNAPSHOT && process.env.NODE_ENV === "production") {
  if (!process.env.CMS_URL) {
    throw new Error(
      "CMS_URL is not set. Set it to the CMS backend URL, e.g. https://sewabharti-cms-api.zucol.in (or build with CMS_SNAPSHOT=1).",
    );
  }
  if (new URL(CMS_URL).pathname !== "/") {
    throw new Error(`CMS_URL must be the backend origin only, without a path (got "${CMS_URL}").`);
  }
}

const TIMEOUT_MS = 10_000;

type Snapshot = { globals: Record<string, unknown>; pillars: Pillar[]; events: Event[] };
const loadSnapshot = async () =>
  (await import("@/content-snapshot/data.json")).default as unknown as Snapshot;

const RETRY_DELAYS_MS = [400, 1200]; // up to 3 attempts in total

/** GET `${CMS_URL}${path}` as JSON. Retries network errors, 429 and 5xx; throws otherwise. */
async function cmsFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const key = process.env.FRONTEND_API_KEY;
  if (key) headers["x-frontend-key"] = key;

  for (let attempt = 0; ; attempt++) {
    let res: Response | undefined;
    try {
      res = await fetch(`${CMS_URL}${path}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (err) {
      // Network / TLS / timeout error — retry, then give up.
      if (attempt < RETRY_DELAYS_MS.length) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
        continue;
      }
      throw err;
    }
    if ((res.status === 429 || res.status >= 500) && attempt < RETRY_DELAYS_MS.length) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
      continue;
    }
    // Status only — never echo headers, keys or response bodies.
    if (!res.ok) throw new Error(`CMS responded ${res.status} for ${path.split("?")[0]}`);
    return (await res.json()) as T;
  }
}

async function safe<T>(label: string, fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    const value = await fn();
    cacheLife("max");
    return value;
  } catch (err) {
    // Log the message only (no headers / keys / connection details).
    console.error(`[cms] ${label} failed:`, err instanceof Error ? err.message : String(err));
    // Never pin a failure in the cache — retry within seconds.
    cacheLife("seconds");
    return fallback;
  }
}

export async function getGlobal<S extends GlobalSlug>(slug: S): Promise<Config["globals"][S] | null> {
  "use cache";
  cacheTag(`global:${slug}`, "globals", "media");
  return safe(`global:${slug}`, null, async () => {
    if (SNAPSHOT) return ((await loadSnapshot()).globals[slug] ?? null) as Config["globals"][S] | null;
    return cmsFetch<Config["globals"][S]>(`/api/globals/${encodeURIComponent(slug)}?depth=2`);
  });
}

/** Slugs of the editable page-content globals (src/content/resolve.ts merges them over the static defaults). */
export type ContentSlug =
  | "home-content"
  | "about-content"
  | "work-content"
  | "csr-content"
  | "volunteer-content"
  | "gallery-content"
  | "contact-content"
  | "partners-content"
  | "footer-content";

/** Replace populated upload objects' `url` by its site-relative form (see mediaUrl). */
function relativizeMedia(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(relativizeMedia);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.url === "string" && typeof o.filename === "string") {
      return { ...o, url: mediaUrl(o as unknown as Media) };
    }
    return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, relativizeMedia(x)]));
  }
  return v;
}

/**
 * An editable page-content global (depth 1 so uploads are populated), or null
 * when missing / the CMS is unreachable / snapshot mode - callers then use the
 * static defaults via resolve*() in src/content/resolve.ts.
 */
export async function getContent(slug: ContentSlug): Promise<Record<string, unknown> | null> {
  "use cache";
  cacheTag(`global:${slug}`, "globals", "media");
  return safe(`global:${slug}`, null, async () => {
    if (SNAPSHOT) return null;
    try {
      const res = await cmsFetch<unknown>(`/api/globals/${encodeURIComponent(slug)}?depth=1`);
      return res && typeof res === "object" ? (relativizeMedia(res) as Record<string, unknown>) : null;
    } catch (err) {
      // An older CMS has no such global (404): not a failure, just use the defaults.
      if (err instanceof Error && / 404 /.test(err.message)) return null;
      throw err;
    }
  });
}

export async function getPillars(): Promise<Pillar[]> {
  "use cache";
  cacheTag("pillars", "media");
  return safe("pillars", [], async () => {
    if (SNAPSHOT) return (await loadSnapshot()).pillars;
    const res = await cmsFetch<{ docs?: Pillar[] }>("/api/pillars?sort=order&limit=50&depth=2&pagination=false");
    if (!Array.isArray(res.docs)) throw new Error("CMS pillars response has no docs");
    return res.docs;
  });
}

export async function getPillarBySlug(slug: string): Promise<Pillar | null> {
  const pillars = await getPillars();
  return pillars.find((p) => p.slug === slug) ?? null;
}

export async function getEvents(): Promise<Event[]> {
  "use cache";
  cacheTag("events", "media");
  return safe("events", [], async () => {
    if (SNAPSHOT) return (await loadSnapshot()).events;
    const res = await cmsFetch<{ docs?: Event[] }>("/api/events?sort=-date&limit=200&depth=2&pagination=false");
    if (!Array.isArray(res.docs)) throw new Error("CMS events response has no docs");
    return res.docs;
  });
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const events = await getEvents();
  return events.find((e) => e.slug === slug) ?? null;
}

// ---- helpers ---------------------------------------------------------------

export type MediaRef = number | Media | null | undefined;

/** Resolve an upload field to a usable URL (optionally a generated size). */
export function mediaUrl(m: MediaRef, size?: "thumbnail" | "card" | "hero"): string | null {
  if (!m || typeof m !== "object") return null;
  const sized = size ? m.sizes?.[size]?.url : null;
  return toSiteRelative(sized || m.url || null);
}

// The CMS builds absolute media URLs from its serverURL. Files served by the
// CMS itself are made relative (`/api/media/file/...`) so they are proxied
// same-origin by the rewrite in next.config.ts and next/image treats them as
// local (images.localPatterns). External storage (Vercel Blob) URLs are left
// absolute.
const CMS_ORIGIN = (() => {
  try {
    return new URL(CMS_URL).origin;
  } catch {
    return null;
  }
})();

function toSiteRelative(url: string | null): string | null {
  if (!url || !/^https?:\/\//i.test(url)) return url;
  try {
    const u = new URL(url);
    return u.origin === CMS_ORIGIN ? `${u.pathname}${u.search}` : url;
  } catch {
    return url;
  }
}

export function mediaAlt(m: MediaRef, fallback = ""): string {
  return m && typeof m === "object" && m.alt ? m.alt : fallback;
}

/** Format a CMS date for display, e.g. "Jan 2, 2021". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
