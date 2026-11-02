import "server-only";
import { cacheLife, cacheTag } from "next/cache";

// Volunteer list from the Sewa Bharti dashboard (a separate app, not the CMS).
// The API is public but returns personal data (mobile, email, PAN); only the
// safe fields below are mapped, so the rest never reaches a page or the client.
// Only approved volunteers are listed.

export const DASHBOARD_URL = (process.env.DASHBOARD_API_URL || "https://dashboard.sewabhartirajasthan.org").replace(
  /\/+$/,
  "",
);

/** The dashboard's own "apply as volunteer" form. */
export const VOLUNTEER_APPLY_URL = `${DASHBOARD_URL}/volunteer`;

export const ROLE_LABELS: Record<string, { hi: string; en: string }> = {
  education: { hi: "शिक्षा", en: "Education" },
  health: { hi: "स्वास्थ्य", en: "Health" },
  "self-reliance": { hi: "स्वावलम्बन", en: "Self-reliance" },
  social: { hi: "सामाजिक", en: "Social" },
  other: { hi: "अन्य", en: "Other" },
};

/** How many volunteers the page shows at first and adds per "Show more". */
export const VOLUNTEERS_PAGE_SIZE = 12;

export type PublicVolunteer = {
  uid: string;
  name: string;
  city: string;
  role: { hi: string; en: string } | null;
  designation: string;
  photoUrl: string | null;
};

/** Extra public fields shown on /volunteer/<uid> (details API). */
export type PublicVolunteerDetail = PublicVolunteer & {
  institute: string;
  interest: string;
  startDate: string | null;
  endDate: string | null;
  joinedAt: string | null;
  /** QR code PNG (data URI) from the dashboard; it encodes the profile URL. */
  qrCode: string | null;
};

export type VolunteerPage = { volunteers: PublicVolunteer[]; total: number; hasNext: boolean };

type RawVolunteer = {
  uid?: string;
  full_name?: string;
  city?: string;
  role_type?: string;
  designation?: string;
  institute_name?: string;
  interest?: string;
  start_date?: string | null;
  end_date?: string | null;
  photo_url?: string | null;
  status?: string;
  created_at?: string | null;
  qr_code?: string | null;
};

const UID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const QR_RE = /^data:image\/png;base64,[A-Za-z0-9+/]+=*$/;
const QR_MAX_LENGTH = 200_000;

/** Trimmed text, or "" for empty and placeholder values such as "NA" / "-". */
function clean(value: string | null | undefined): string {
  const v = value?.trim() ?? "";
  return /^(n\/?a|none|nil|-+)$/i.test(v) ? "" : v;
}

function isPublic(v: RawVolunteer): v is RawVolunteer & { uid: string; full_name: string } {
  return v.status === "approved" && Boolean(v.uid) && Boolean(v.full_name?.trim());
}

function toPublic(v: RawVolunteer & { uid: string; full_name: string }): PublicVolunteer {
  return {
    uid: v.uid,
    name: v.full_name.trim(),
    city: clean(v.city),
    role: ROLE_LABELS[v.role_type ?? ""] ?? null,
    designation: clean(v.designation),
    photoUrl: absoluteUrl(v.photo_url),
  };
}

const TIMEOUT_MS = 10_000;
const EMPTY: VolunteerPage = { volunteers: [], total: 0, hasNext: false };

function absoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url, DASHBOARD_URL);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export async function getVolunteers(page: number, pageSize: number): Promise<VolunteerPage> {
  "use cache";
  cacheTag("volunteers");
  try {
    const qs = new URLSearchParams({ status: "approved", page: String(page), page_size: String(pageSize) });
    const res = await fetch(`${DASHBOARD_URL}/api/content/volunteers/?${qs}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // The API answers 404 for a page past the end.
    if (res.status === 404) {
      cacheLife("minutes");
      return EMPTY;
    }
    if (!res.ok) throw new Error(`dashboard responded ${res.status}`);
    const data = (await res.json()) as { count?: number; next?: string | null; results?: RawVolunteer[] };
    if (!Array.isArray(data.results)) throw new Error("dashboard volunteers response has no results");

    const volunteers = data.results.filter(isPublic).map(toPublic);
    cacheLife("minutes");
    return { volunteers, total: data.count ?? volunteers.length, hasNext: Boolean(data.next) };
  } catch (err) {
    // Message only — never response bodies (they hold personal data).
    console.error("[dashboard] volunteers failed:", err instanceof Error ? err.message : String(err));
    cacheLife("seconds");
    return EMPTY;
  }
}

/**
 * One approved volunteer's public profile, or null when not found / not
 * approved. Throws when the API is unreachable (the error page then offers a
 * retry instead of a misleading 404).
 */
export async function getVolunteerDetail(uid: string): Promise<PublicVolunteerDetail | null> {
  "use cache";
  cacheTag("volunteers");
  if (!UID_RE.test(uid)) return null;
  const res = await fetch(`${DASHBOARD_URL}/api/content/volunteers/${uid}/`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 404) {
    cacheLife("minutes");
    return null;
  }
  if (!res.ok) throw new Error(`dashboard responded ${res.status}`);
  const v = (await res.json()) as RawVolunteer;
  cacheLife("minutes");
  if (!isPublic(v)) return null;
  return {
    ...toPublic(v),
    institute: clean(v.institute_name),
    interest: clean(v.interest),
    startDate: v.start_date ?? null,
    endDate: v.end_date ?? null,
    joinedAt: v.created_at ?? null,
    qrCode: v.qr_code && v.qr_code.length <= QR_MAX_LENGTH && QR_RE.test(v.qr_code) ? v.qr_code : null,
  };
}
