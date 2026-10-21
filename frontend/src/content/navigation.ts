// Header menu, header button and footer quick links, from the client's
// content document (context/2.0/WEBSITE_CONTENT.md, Part A). This replaces the
// CMS Navigation global for now; the four pillars still come from the CMS.

/**
 * A dropdown entry:
 * - a fixed link (`href` may be an absolute URL — it then opens in a new tab),
 * - `{ pillars: true }` = every pillar from the CMS,
 * - `{ label, cmsAdmin: true }` = the CMS admin panel (`${CMS_URL}/admin`),
 *   resolved on the server; left out when CMS_URL is not set.
 */
export type NavChildContent =
  | { label: string; href: string }
  | { pillars: true }
  | { label: string; cmsAdmin: true };

export type NavItemContent = {
  label: string;
  /** Leave out for a dropdown-only item. */
  href?: string;
  children?: NavChildContent[];
  /** Desktop: shown beside the logo (next to Donate) instead of in the main menu row. */
  utility?: boolean;
};

// Order and labels follow the document's menu (Part A). Items with no content
// yet (Aims has CMS text only; Disaster Management and Publications have none)
// are listed in context/2.0/CONTENT_GAPS.md.
export const HEADER_NAV: NavItemContent[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    children: [
      { label: "Our Vision", href: "/about-us#vision" },
      { label: "Mission", href: "/about-us#mission" },
      { label: "Aims", href: "/about-us#aims" },
      { label: "Organizational Structure", href: "/about-us#structure" },
    ],
  },
  {
    label: "Our Work",
    children: [
      { label: "Core Pillars", href: "/our-work" },
      { pillars: true },
      { label: "Sewa Activities", href: "/events" },
    ],
  },
  {
    label: "Major Projects & CSR",
    children: [
      { label: "Underprivileged Community Students Scholarships", href: "/csr#scholarships" },
      { label: "Advanced Medical Infrastructure", href: "/csr#medical-infrastructure" },
      { label: "Physiotherapy and Neuro-therapy Rehabilitation Centers", href: "/csr#medical-infrastructure" },
      { label: "Pathology Labs", href: "/csr#pathology-labs" },
      { label: "Academic Internships & Skilling Courses", href: "/csr#internships" },
    ],
  },
  { label: "Volunteer & Karyakarta Portal", href: "/volunteer" },
  { label: "Media & Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
  { label: "Our Sewa Partners", href: "/partners" },
  {
    label: "Login",
    utility: true,
    children: [
      { label: "Pathology Lab Login", href: "/login/pathology" },
      { label: "Publication Login", href: "/login/publication" },
      { label: "Dashboard", cmsAdmin: true },
    ],
  },
];

/** Highlighted button at the end of the header menu. */
export const HEADER_CTA = { label: "Donate", href: "/#donate" };

/** Footer quick links — exactly the five named in the document's Global Footer. */
export const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Core Pillars", href: "/our-work" },
  { label: "CSR Projects", href: "/csr" },
  { label: "Karyakarta Portal", href: "/volunteer" },
];

/** Screen-reader note on menu links that open in a new tab (e.g. Dashboard). */
export const NAV_NEW_TAB_LABEL = "(opens in new tab)";
