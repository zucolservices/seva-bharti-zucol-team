// Header menu, header button and footer quick links, from the client's
// content document (context/2.0/WEBSITE_CONTENT.md). This replaces the CMS
// Navigation global for now; the four pillars still come from the CMS.

/** A dropdown entry: a fixed link, or `{ pillars: true }` = every pillar from the CMS. */
export type NavChildContent = { label: string; href: string } | { pillars: true };

export type NavItemContent = {
  label: string;
  /** Leave out for a dropdown-only item. */
  href?: string;
  children?: NavChildContent[];
};

export const HEADER_NAV: NavItemContent[] = [
  { label: "होम", href: "/" },
  {
    label: "हमारे बारे में",
    children: [
      { label: "हमारी दृष्टि", href: "/about-us#vision" },
      { label: "सचिव का संदेश", href: "/about-us#message" },
      { label: "हमारा उद्देश्य", href: "/about-us#mission" },
      { label: "संगठनात्मक संरचना", href: "/about-us#structure" },
    ],
  },
  {
    label: "हमारा कार्य",
    children: [
      { label: "सभी आयाम", href: "/our-work" },
      { pillars: true },
      { label: "सेवा गतिविधियाँ", href: "/events" },
    ],
  },
  { label: "परियोजनाएँ एवं CSR", href: "/csr" },
  { label: "मीडिया एवं गैलरी", href: "/gallery" },
  {
    label: "जुड़ें",
    children: [
      { label: "कार्यकर्ता पोर्टल", href: "/volunteer" },
      { label: "हमारे सेवा सहयोगी", href: "/partners" },
    ],
  },
  { label: "संपर्क", href: "/contact" },
];

/** Highlighted button at the end of the header menu. */
export const HEADER_CTA = { label: "दान करें", href: "/#donate" };

export const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "होम", href: "/" },
  { label: "हमारे बारे में", href: "/about-us" },
  { label: "हमारा कार्य", href: "/our-work" },
  { label: "सेवा गतिविधियाँ", href: "/events" },
  { label: "CSR परियोजनाएँ", href: "/csr" },
  { label: "कार्यकर्ता पोर्टल", href: "/volunteer" },
  { label: "मीडिया एवं गैलरी", href: "/gallery" },
  { label: "सेवा सहयोगी", href: "/partners" },
  { label: "संपर्क", href: "/contact" },
];
