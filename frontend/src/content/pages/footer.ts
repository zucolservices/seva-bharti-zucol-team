// Footer additions from the client's content document (Global Footer).
// Registration numbers are the verified facts in PROJECT_NOTES.md; social
// links are the ones on the live site.

export const FOOTER_COPYRIGHT = "© Sewa Bharti Samiti Rajasthan.";

/** Column headings (English; the CMS still holds the old Hindi ones). */
export const FOOTER_HEADINGS = { quickLinks: "Quick Links", contact: "Contact Us" };

export const FOOTER_MOTTO = "Together We Can: Empowering Today, Inspiring Tomorrow.";

export const FOOTER_COMPLIANCE: { label: string; value: string }[] = [
  { label: "Registration", value: "106/Rajasthan 1987-88" },
  { label: "80G Tax Exemption", value: "80G/831/2007-2008" },
  { label: "PAN", value: "AABTS4114N" },
];

/** Used only while Site Settings → Social has no entries. */
export const FOOTER_SOCIALS = [
  { platform: "facebook", url: "https://www.facebook.com/sewabhartirajasthan" },
  { platform: "youtube", url: "https://www.youtube.com/channel/UCFMz0rHDYD1xkN5JZR79Qag" },
  { platform: "twitter", url: "https://x.com/sewa_bharti" },
] as const;
