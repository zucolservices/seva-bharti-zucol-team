// Footer additions from the client's content document (Global Footer).
// Registration numbers are the verified facts in PROJECT_NOTES.md; social
// links are the ones on the live site.

export const FOOTER_MOTTO = "साथ मिलकर हम कर सकते हैं: आज का सशक्तिकरण, कल की प्रेरणा।";

export const FOOTER_COMPLIANCE: { label: string; value: string }[] = [
  { label: "पंजीयन", value: "106/राजस्थान 1987-88" },
  { label: "80G कर छूट", value: "80जी/831/2007-2008" },
  { label: "PAN", value: "AABTS4114N" },
];

/** Used only while Site Settings → Social has no entries. */
export const FOOTER_SOCIALS = [
  { platform: "facebook", url: "https://www.facebook.com/sewabhartirajasthan" },
  { platform: "youtube", url: "https://www.youtube.com/channel/UCFMz0rHDYD1xkN5JZR79Qag" },
  { platform: "twitter", url: "https://x.com/sewa_bharti" },
] as const;
