// Plain, serializable view shapes passed from Server Components to Client
// Components. CMS documents are resolved into these (URLs already computed)
// so client bundles never depend on Payload types or helpers.

export interface PhotoView {
  src: string;
  alt: string;
}

export interface GuestView {
  name: string;
  designation: string;
  testimonial: string;
  /** Resolved image URL, or null to show the placeholder headshot. */
  photo: string | null;
}

export interface NavLinkView {
  label: string;
  /** Internal path, or an absolute http(s) URL (opened in a new tab). */
  href: string;
}

export interface NavItemView {
  id: string;
  label: string;
  href: string | null;
  /** Non-empty → rendered as a dropdown. */
  children: NavLinkView[];
  /** Desktop: shown beside the logo instead of in the main menu row. */
  utility?: boolean;
}

/** Screen-reader labels (CMS: UI Text & Labels → a11y). `{n}` = a number. */
export interface A11yLabels {
  menuOpen: string;
  menuClose: string;
  homeLinkLabel: string;
  eventPhotosHeading: string;
  showPhoto: string;
  prevGuest: string;
  nextGuest: string;
  showGuest: string;
}

/** Used for any label left empty in the CMS. */
export const DEFAULT_A11Y: A11yLabels = {
  menuOpen: "Open menu",
  menuClose: "Close menu",
  homeLinkLabel: "Home",
  eventPhotosHeading: "Event photos",
  showPhoto: "Show photo {n}",
  prevGuest: "Previous guest",
  nextGuest: "Next guest",
  showGuest: "Show guest {n}",
};

export const fillN = (label: string, n: number) => label.replace("{n}", String(n));

/**
 * `lang` for text that may be English (site copy) or Hindi (CMS fields):
 * "hi" when it contains Devanagari, otherwise undefined (inherits `en`).
 */
export const langOf = (text?: string | null): "hi" | undefined =>
  text && /[\u0900-\u097F]/.test(text) ? "hi" : undefined;

export interface HeaderData {
  a11y: A11yLabels;
  siteName: string;
  logoUrl: string;
  logoAlt: string;
  brandTitle: string;
  tagline: string;
  items: NavItemView[];
  /** Highlighted button after the menu (e.g. Donate). */
  cta?: NavLinkView | null;
}

/** Placeholder headshot shown until a real guest photo is uploaded. */
export const GUEST_PLACEHOLDER = "/events/guest-seed.png";

/** Logo used when Site Settings has no logo uploaded. */
export const LOGO_FALLBACK = "/logo.png";
