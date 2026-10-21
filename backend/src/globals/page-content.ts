import type { Field, GlobalConfig, Tab } from "payload";
import { anyone, isAdminOrEditor } from "@/access";
import { hrefField } from "@/fields";
import { revalidateGlobal } from "@/hooks/revalidate";

// Page Content globals: the editable copy of the fixed pages. Every field is
// optional — an empty field makes the website fall back to its built-in text
// (the frontend deep-merges these values over its defaults). Field names mirror
// the frontend content constants, so do not rename them.

const base = (slug: string, label: string, description: string): GlobalConfig => ({
  slug,
  label,
  access: { read: anyone, update: isAdminOrEditor },
  admin: { group: "Page Content", description },
  hooks: { afterChange: [revalidateGlobal(`global:${slug}`, "globals")] },
  fields: [],
});

const EMPTY_NOTE = "Leave empty to use the default text.";

const text = (name: string, maxLength = 200, description?: string, label?: string): Field => ({
  name,
  type: "text",
  maxLength,
  ...(label ? { label } : {}),
  admin: { description: description ?? EMPTY_NOTE },
});

const area = (name: string, maxLength = 1500, description?: string, label?: string): Field => ({
  name,
  type: "textarea",
  maxLength,
  ...(label ? { label } : {}),
  admin: { description: description ?? EMPTY_NOTE },
});

// A list of strings: rows with a single `text` subfield.
const list = (name: string, label: string, maxLength = 1500, description?: string): Field => ({
  name,
  type: "array",
  label,
  maxRows: 20,
  admin: { description: description ?? "Each row is one item. If you add rows, they replace the default list." },
  fields: [{ name: "text", type: "textarea", maxLength, label: "Text" }],
});

const group = (name: string, label: string, fields: Field[], description?: string): Field => ({
  name,
  type: "group",
  label,
  ...(description ? { admin: { description } } : {}),
  fields,
});

// A single-group tab: data is stored under `name` (same as the constant).
const tab = (name: string, label: string, fields: Field[], description?: string): Tab => ({
  name,
  label,
  ...(description ? { description } : {}),
  fields,
});

const link = (name: string, label: string): Field =>
  group(name, label, [text("label", 80), hrefField()]);

const HIGHLIGHT_NOTE =
  "Wrap words that should appear highlighted (saffron) in **double asterisks**, e.g. make them **self-reliant**. " + EMPTY_NOTE;

const hl = (name: string, label: string, maxLength = 1500): Field => area(name, maxLength, HIGHLIGHT_NOTE, label);

const hlList = (name: string, label: string): Field => ({
  name,
  type: "array",
  label,
  maxRows: 10,
  admin: {
    description:
      "Each row is one paragraph. Wrap highlighted words in **double asterisks**. If you add rows, they replace the default paragraphs.",
  },
  fields: [{ name: "text", type: "textarea", maxLength: 2000, label: "Paragraph" }],
});

const pageHeader = (extra: Field[] = []): Field[] => [
  text("eyebrow", 120, "Small label above the title. " + EMPTY_NOTE),
  text("title", 200, "Main page heading. " + EMPTY_NOTE),
  ...extra,
];

const header = (withSubtitle = true, withMeta = false): Tab =>
  tab("header", "Header", [
    ...(withMeta ? [text("metaTitle", 120, "Browser-tab title. " + EMPTY_NOTE)] : []),
    ...pageHeader(withSubtitle ? [area("subtitle", 1000, "Intro paragraph under the title. " + EMPTY_NOTE)] : []),
  ]);

const withTabs = (g: GlobalConfig, tabs: Tab[]): GlobalConfig => ({
  ...g,
  fields: [{ type: "tabs", tabs }],
});

const PILLAR_KEYS = [
  ["shiksha", "Shiksha (Education)"],
  ["swasthya", "Swasthya (Healthcare)"],
  ["swavalamban", "Swavalamban (Self-Reliance)"],
  ["samajik", "Samajik (Social Harmony)"],
] as const;

export const HomeContent: GlobalConfig = withTabs(
  base("home-content", "Home Content", "Text blocks of the home page (the static sections)."),
  [
    tab("hero", "Hero", [text("title", 200), area("intro", 1000)]),
    tab("impact", "Impact banner", [text("lead", 200, "Bold first line. " + EMPTY_NOTE), area("text", 1000)]),
    tab("pillarsHeading", "Pillars heading", [text("title", 200)]),
    tab(
      "pillarLines",
      "Pillar card lines",
      PILLAR_KEYS.map(([k, label]) => text(k, 200, `One-line text on the ${label} card. ${EMPTY_NOTE}`, label)),
    ),
    tab("objective", "Our Objective", [
      text("heading", 160),
      hlList("paragraphs", "Objective paragraphs"),
      text("structureHeading", 160),
      hlList("structureParagraphs", "Structure paragraphs"),
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        label: "Sewa Geet image (logo card)",
        admin: {
          description:
            "Image shown beside the Objective text. Resolution: about 1084 × 1109 px recommended (nearly square); minimum 600 × 600 px. PNG or WebP, under 1 MB; keep the logo centred with some margin. Leave empty to keep the current image. Upload limits: max 5 MB, max 40 megapixels, JPG/PNG/WebP/AVIF only.",
        },
      },
      text("imageAlt", 200, "Description of the image for screen readers. " + EMPTY_NOTE),
    ]),
    tab("vision", "Vision", [
      text("heading", 160),
      hl("paragraph", "Vision paragraph", 2000),
      area("appeal", 600),
      text("imageAlt", 200, "Description of the image for screen readers. " + EMPTY_NOTE),
    ]),
    tab("donate", "Donation section", [
      area("heading", 600),
      text("waysHeading", 200),
      list("ways", "Ways to help", 800),
      area("taxNote", 600),
      text("contactHeading", 100),
      list("contactLines", "Contact lines", 300),
      text("bankHeading", 160),
      {
        name: "bank",
        type: "array",
        label: "Bank details",
        maxRows: 12,
        admin: { description: "Label and value pairs. If you add rows, they replace the default list." },
        fields: [
          { type: "row", fields: [text("label", 80, "e.g. IFSC Code"), text("value", 200, "e.g. SBIN0010548")] },
        ],
      },
      text("imageAlt", 200, "Description of the image for screen readers. " + EMPTY_NOTE),
      text("onlineDonation", 160, "Text of the online-donation link. " + EMPTY_NOTE),
    ]),
    {
      label: "Quotes carousel",
      description: "Rows replace the default quotes. A photo is optional: without one the default portrait is kept.",
      fields: [
        {
          name: "quotes",
          type: "array",
          label: "Quotes",
          maxRows: 12,
          fields: [
            area("quote", 800),
            text("tagline", 200),
            { type: "row", fields: [text("name", 160), text("role", 160)] },
            {
              name: "photo",
              type: "upload",
              relationTo: "media",
              admin: { description: "Optional portrait. Leave empty to keep the default image." },
            },
          ],
        },
        group("quotesLabels", "Accessibility labels", [
          text("carousel", 120, "Name of the carousel for screen readers. " + EMPTY_NOTE),
          text("dot", 120, "Dot button label; {n} = slide number, {name} = person. " + EMPTY_NOTE),
          text("pause", 80),
          text("play", 80),
        ]),
      ],
    },
  ],
);

export const AboutContent: GlobalConfig = withTabs(
  base("about-content", "About Content", "Text of the About Us page."),
  [
    header(false, true),
    tab("vision", "Vision", [text("heading", 160), list("paragraphs", "Paragraphs", 2000)]),
    tab("message", "Secretary's message", [
      text("heading", 160),
      list("quote", "Message paragraphs", 2000),
      text("byline", 160, "Name/designation shown under the message. Empty = not shown."),
    ]),
    tab("mission", "Mission", [text("heading", 160), list("paragraphs", "Paragraphs", 2000)]),
    tab("structure", "Organizational structure", [text("heading", 160), list("paragraphs", "Paragraphs", 2000)]),
  ],
);

export const WorkContent: GlobalConfig = withTabs(
  base("work-content", "Our Work Content", "Text of the Our Work page and the pillar pages."),
  [
    header(false),
    tab(
      "pillars",
      "Pillars",
      PILLAR_KEYS.map(([k, label]) =>
        group(k, label, [text("tagline", 200), area("text", 1500)]),
      ),
    ),
    { label: "Buttons", fields: [text("ctaLabel", 80, "Label of the “Learn More” buttons. " + EMPTY_NOTE)] },
  ],
);

export const CsrContent: GlobalConfig = withTabs(
  base("csr-content", "CSR Content", "Text of the Major Projects & CSR page."),
  [
    header(true),
    {
      label: "Initiatives",
      fields: [
        text("initiativesHeading", 160),
        {
          name: "initiatives",
          type: "array",
          label: "Initiatives",
          maxRows: 12,
          admin: { description: "If you add rows, they replace the default initiatives." },
          fields: [
            text("id", 60, "Anchor used by the menu link (/csr#id). Lowercase letters, numbers, hyphens."),
            text("title", 200),
            area("text", 1500),
          ],
        },
      ],
    },
    tab("pathLab", "Pathology lab", [
      text("title", 160),
      area("intro", 600),
      { type: "row", fields: [text("addressLabel", 60), text("address", 300)] },
      { type: "row", fields: [text("emailLabel", 60), text("email", 160)] },
      { type: "row", fields: [text("timingLabel", 60), text("timing", 120)] },
    ]),
    tab("cta", "Buttons", [link("primary", "Primary button"), link("secondary", "Secondary button")]),
  ],
);

export const VolunteerContent: GlobalConfig = withTabs(
  base("volunteer-content", "Volunteer Content", "Text of the Volunteer & Karyakarta page."),
  [
    header(true),
    tab("capacity", "Capacity building", [text("heading", 160), area("text", 1500)]),
    tab("cta", "Button", [text("label", 80), hrefField()]),
  ],
);

export const GalleryContent: GlobalConfig = withTabs(
  base("gallery-content", "Gallery Content", "Text of the Media & Gallery page."),
  [
    header(true),
    {
      label: "Sections",
      fields: [
        text("recentHeading", 160),
        link("allEvents", "“View all” link"),
        text("photoAlt", 200, "Fallback description of gallery photos for screen readers. " + EMPTY_NOTE),
      ],
    },
  ],
);

export const ContactContent: GlobalConfig = withTabs(
  base("contact-content", "Contact Content", "Text at the top of the Contact page."),
  [header(true)],
);

export const PartnersContent: GlobalConfig = withTabs(
  base("partners-content", "Partners Content", "Text and logos of the Our Sewa Partners page."),
  [
    tab("meta", "SEO", [text("title", 120, "Browser-tab title. " + EMPTY_NOTE), area("description", 300)]),
    header(false),
    tab("note", "Note to partners", [text("heading", 160), list("paragraphs", "Paragraphs", 2000)]),
    {
      label: "Partners",
      fields: [
        text("gridLabel", 120, "Name of the logo grid for screen readers. " + EMPTY_NOTE),
        {
          name: "partners",
          type: "array",
          label: "Partners",
          maxRows: 60,
          admin: { description: "If you add rows, they replace the default partner list. A logo is optional." },
          fields: [
            text("name", 200, "Partner name (also the logo's alt text)."),
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional. Leave empty to keep the default logo for this name. Recommended: transparent PNG/WebP or SVG-quality image, resolution: wide logos about 600 × 200 px, round emblems about 400 × 400 px (minimum half of that), under 300 KB. Four logos are shown per row. Upload limits: max 5 MB, max 40 megapixels, JPG/PNG/WebP/AVIF only.",
              },
            },
            {
              name: "emblem",
              type: "checkbox",
              defaultValue: false,
              admin: { description: "Tick for round/square emblems so they show taller than wide wordmarks." },
            },
          ],
        },
      ],
    },
    tab("cta", "Bottom banner", [text("heading", 160), area("text", 600), text("button", 80), hrefField()]),
  ],
);

export const FooterContent: GlobalConfig = {
  ...base("footer-content", "Footer Content", "Footer motto, copyright, column headings and registration numbers."),
  fields: [
    text("motto", 200),
    text("copyright", 200),
    group("headings", "Column headings", [text("quickLinks", 80), text("contact", 80)]),
    {
      name: "compliance",
      type: "array",
      label: "Registration details",
      maxRows: 8,
      admin: { description: "e.g. PAN, 80G number. If you add rows, they replace the default list." },
      fields: [{ type: "row", fields: [text("label", 80), text("value", 120)] }],
    },
  ],
};

export const pageContentGlobals: GlobalConfig[] = [
  HomeContent,
  AboutContent,
  WorkContent,
  CsrContent,
  VolunteerContent,
  GalleryContent,
  ContactContent,
  PartnersContent,
  FooterContent,
];
