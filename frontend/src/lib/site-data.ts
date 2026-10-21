import "server-only";
import type { Pillar, SiteSetting, UiString } from "@/payload-types";
import type { NavItemContent } from "@/content/navigation";
import { PILLAR_NAMES, byPillar } from "@/content/pillars";
import { mediaAlt, mediaUrl, type MediaRef } from "@/lib/cms";
import { DEFAULT_A11Y, LOGO_FALLBACK, type A11yLabels, type GuestView, type NavItemView, type PhotoView } from "@/lib/view-types";

// Small server-side helpers that shape CMS globals for the layout chrome.

/** CMS screen-reader labels with defaults for anything left empty. */
export function a11yLabels(ui: UiString | null): A11yLabels {
  const out = { ...DEFAULT_A11Y };
  for (const key of Object.keys(out) as (keyof A11yLabels)[]) {
    const v = ui?.a11y?.[key];
    if (v) out[key] = v;
  }
  return out;
}

/** `tel:` link in international (E.164) form; Indian numbers get +91. */
export function telHref(phone: string): string {
  const raw = phone.replace(/[^0-9+]/g, "");
  if (raw.startsWith("+")) return `tel:${raw}`;
  if (/^0\d{10}$/.test(raw)) return `tel:+91${raw.slice(1)}`; // 0141 2741222 (STD code)
  if (/^[6-9]\d{9}$/.test(raw)) return `tel:+91${raw}`; // 10-digit mobile
  return `tel:${raw}`;
}

export function siteLogo(settings: SiteSetting | null): { url: string; alt: string } {
  const name = settings?.name ?? "";
  return {
    url: mediaUrl(settings?.logo) ?? LOGO_FALLBACK,
    alt: mediaAlt(settings?.logo, name ? `${name.trim()} logo` : "").trim(),
  };
}

/** Phone shown in the top bar: explicit override, else first office's first phone. */
export function primaryPhone(settings: SiteSetting | null): string | null {
  return settings?.topBarPhone || settings?.offices?.[0]?.phones?.[0]?.number || null;
}

/** `${CMS_URL}/admin`, or null when CMS_URL is not set. */
function cmsAdminUrl(): string | null {
  const base = process.env.CMS_URL?.trim().replace(/\/+$/, "");
  return base ? `${base}/admin` : null;
}

/**
 * Header menu from src/content/navigation.ts. `{ pillars: true }` expands to
 * the Pillars collection; `{ cmsAdmin: true }` becomes a link to the CMS admin
 * (left out when CMS_URL is not set).
 */
export function buildNavItems(items: NavItemContent[], pillars: Pillar[]): NavItemView[] {
  const pillarLinks = pillars
    .filter((p) => p.showInNav !== false)
    .map((p) => ({ label: byPillar(PILLAR_NAMES, p.slug)?.title || p.navLabel || p.nameEn || p.nameHi, href: `/${p.slug}` }));
  const adminUrl = cmsAdminUrl();
  return items.map((item, i) => ({
    id: `${item.label}-${i}`,
    label: item.label,
    href: item.href || null,
    utility: item.utility,
    children: (item.children ?? []).flatMap((c) => {
      if ("pillars" in c) return pillarLinks;
      if ("cmsAdmin" in c) return adminUrl ? [{ label: c.label, href: adminUrl }] : [];
      return [c];
    }),
  }));
}

// ---- view-model mappers (CMS → plain props for client components) --------

type GuestRow = {
  name: string;
  designation: string;
  testimonial: string;
  photo?: MediaRef;
};

export function toGuestViews(guests: GuestRow[] | null | undefined): GuestView[] {
  return (guests ?? []).map((g) => ({
    name: g.name,
    designation: g.designation,
    testimonial: g.testimonial,
    photo: mediaUrl(g.photo, "card"),
  }));
}

/** Uploads → {src, alt}, dropping any that have no usable URL. */
export function toPhotoViews(
  media: MediaRef[] | null | undefined,
  size: "thumbnail" | "card" | "hero",
  fallbackAlt: string,
): PhotoView[] {
  return (media ?? []).flatMap((m) => {
    const src = mediaUrl(m, size);
    return src ? [{ src, alt: mediaAlt(m, fallbackAlt) }] : [];
  });
}
