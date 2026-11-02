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

export type PublicVolunteer = {
  uid: string;
  name: string;
  city: string;
  roleType: string;
  designation: string;
  photoUrl: string | null;
};

export type VolunteerPage = { volunteers: PublicVolunteer[]; total: number; hasNext: boolean };

type RawVolunteer = {
  uid?: string;
  full_name?: string;
  city?: string;
  role_type?: string;
  designation?: string;
  photo_url?: string | null;
  status?: string;
};

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

    const volunteers = data.results
      .filter((v) => v.status === "approved" && v.uid && v.full_name)
      .map((v) => ({
        uid: v.uid!,
        name: v.full_name!.trim(),
        city: v.city?.trim() ?? "",
        roleType: v.role_type ?? "",
        designation: v.designation?.trim() ?? "",
        photoUrl: absoluteUrl(v.photo_url),
      }));
    cacheLife("minutes");
    return { volunteers, total: data.count ?? volunteers.length, hasNext: Boolean(data.next) };
  } catch (err) {
    // Message only — never response bodies (they hold personal data).
    console.error("[dashboard] volunteers failed:", err instanceof Error ? err.message : String(err));
    cacheLife("seconds");
    return EMPTY;
  }
}
