import type { Field, GlobalConfig } from "payload";
import { anyone, isAdminOrEditor } from "@/access";
import {
  guestFields,
  hrefField,
  pageHeaderField,
  sectionHeadingField,
  seoField,
  validateHttpsUrl,
  validateYouTubeUrl,
} from "@/fields";
import { revalidateGlobal } from "@/hooks/revalidate";

// Singleton documents: site-wide settings and the copy for each fixed page.
// Each global caches under the tag `global:<slug>` (see frontend/src/lib/cms.ts).

const globalBase = (slug: string) => ({
  slug,
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobal(`global:${slug}`, "globals")] },
});

const ctaField = (name: string, label: string): Field => ({
  name,
  type: "group",
  label,
  fields: [
    { name: "label", type: "text", maxLength: 80 },
    hrefField(),
  ],
});

export const SiteSettings: GlobalConfig = {
  ...globalBase("site-settings"),
  label: "Site Settings",
  admin: { group: "Settings" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "name", type: "text", required: true, maxLength: 160 },
            { name: "nameHi", type: "text", required: true, maxLength: 160 },
            { name: "shortName", type: "text", required: true, maxLength: 80 },
            {
              name: "brandTitle",
              type: "text",
              maxLength: 120,
              admin: { description: "Shown next to the logo in header/footer, e.g. “Sewa Bharti Rajasthan”." },
            },
            { name: "tagline", type: "text", maxLength: 160 },
            { name: "taglineEn", type: "text", maxLength: 160 },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              admin: { description: "Falls back to /logo.png when empty." },
            },
            { name: "introHi", type: "textarea", maxLength: 2000 },
            { name: "introEn", type: "textarea", maxLength: 2000 },
          ],
        },
        {
          label: "Contact",
          fields: [
            { name: "primaryEmail", type: "email", required: true },
            {
              name: "offices",
              type: "array",
              admin: { description: "The first office is used in the top bar and footer." },
              fields: [
                { name: "name", type: "text", required: true, maxLength: 160 },
                { name: "nameHi", type: "text", maxLength: 160 },
                { name: "address", type: "textarea", required: true, maxLength: 500 },
                {
                  name: "phones",
                  type: "array",
                  fields: [
                    {
                      name: "number",
                      type: "text",
                      required: true,
                      maxLength: 30,
                      validate: (v: unknown) =>
                        typeof v === "string" && /^[+\d\s()-]{5,30}$/.test(v) ? true : "Invalid phone number.",
                    },
                  ],
                },
                { name: "email", type: "email" },
                { name: "role", type: "text", maxLength: 120, admin: { description: "e.g. प्रान्त मंत्री" } },
              ],
            },
          ],
        },
        {
          label: "Top bar",
          fields: [
            { name: "topBarText", type: "text", maxLength: 300 },
            {
              name: "topBarPhone",
              type: "text",
              maxLength: 30,
              validate: (v: unknown) =>
                v == null || v === "" || (typeof v === "string" && /^[+\d\s()-]{5,30}$/.test(v)) ? true : "Invalid phone number.",
              admin: { description: "Leave empty to use the first office's first phone." },
            },
          ],
        },
        {
          label: "Social",
          fields: [
            {
              name: "socials",
              type: "array",
              fields: [
                {
                  name: "platform",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Facebook", value: "facebook" },
                    { label: "X / Twitter", value: "twitter" },
                    { label: "YouTube", value: "youtube" },
                    { label: "Instagram", value: "instagram" },
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "WhatsApp", value: "whatsapp" },
                  ],
                },
                { name: "url", type: "text", required: true, maxLength: 500, validate: validateHttpsUrl },
              ],
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            { name: "footerQuickLinksHeading", type: "text", maxLength: 80 },
            { name: "footerContactHeading", type: "text", maxLength: 80 },
            { name: "copyrightText", type: "text", maxLength: 300 },
            { name: "orgUrl", type: "text", maxLength: 500, validate: validateHttpsUrl },
            { name: "developerCreditPrefix", type: "text", maxLength: 80, admin: { description: "e.g. Developed & Managed by" } },
            { name: "developerName", type: "text", maxLength: 80 },
            { name: "developerUrl", type: "text", maxLength: 500, validate: validateHttpsUrl },
          ],
        },
        {
          label: "SEO",
          fields: [
            { name: "metaTitle", type: "text", maxLength: 160, admin: { description: "Default browser title" } },
            { name: "metaDescription", type: "textarea", maxLength: 320 },
          ],
        },
      ],
    },
  ],
};

export const Navigation: GlobalConfig = {
  ...globalBase("navigation"),
  label: "Navigation",
  admin: { group: "Settings" },
  fields: [
    {
      name: "headerItems",
      type: "array",
      label: "Header menu",
      fields: [
        { name: "label", type: "text", required: true, maxLength: 80 },
        hrefField({ admin: { description: "Leave empty for a dropdown-only item." } }),
        {
          name: "pillarsDropdown",
          type: "checkbox",
          label: "Dropdown of all pillars",
          admin: { description: "Children are filled automatically from Pillars (Show in menu)." },
        },
        {
          name: "children",
          type: "array",
          admin: { condition: (_, s) => !s?.pillarsDropdown },
          fields: [
            { name: "label", type: "text", required: true, maxLength: 80 },
            hrefField({ required: true }),
          ],
        },
      ],
    },
    {
      name: "footerLinks",
      type: "array",
      label: "Footer quick links",
      fields: [
        { name: "label", type: "text", required: true, maxLength: 80 },
        hrefField({ required: true }),
      ],
    },
  ],
};

export const HomePage: GlobalConfig = {
  ...globalBase("home-page"),
  label: "Home Page",
  admin: { group: "Pages" },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "badge", type: "text", maxLength: 160 },
        { name: "tagline", type: "text", maxLength: 160 },
        { name: "title", type: "text", required: true, maxLength: 200 },
        { name: "intro", type: "textarea", maxLength: 2000 },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Hero banner image",
          admin: {
            description:
              "Large picture on the right of the home-page hero. Resolution: 1280 × 880 px recommended (landscape, about 3:2); minimum 960 × 660 px (smaller looks blurry on large screens); anything above 2560 px wide is shrunk automatically. PNG or WebP, under 1.5 MB. Soft, faded edges blend best into the page background. Shown up to about 1000 px wide on large screens. Falls back to the site logo when empty. Upload limits: max 5 MB, max 40 megapixels, JPG/PNG/WebP/AVIF only.",
          },
        },
        ctaField("primaryCta", "Primary button"),
        ctaField("secondaryCta", "Secondary button"),
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "Credentials band",
      maxRows: 8,
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", type: "text", required: true, maxLength: 20 },
            { name: "suffix", type: "text", maxLength: 8 },
            { name: "animate", type: "checkbox", defaultValue: false, admin: { description: "Count up (numbers only)" } },
          ],
        },
        { name: "label", type: "text", required: true, maxLength: 80 },
      ],
    },
    {
      name: "featuredStory",
      type: "group",
      label: "Featured story (above the pillars)",
      admin: { description: "A story with a video, shown above the pillars section. Untick “Show” to hide it." },
      fields: [
        { name: "enabled", type: "checkbox", label: "Show", defaultValue: true },
        { name: "heading", type: "textarea", maxLength: 600 },
        {
          name: "headingHighlight",
          type: "text",
          maxLength: 80,
          admin: { description: "Words inside the heading to show larger in saffron, e.g. सेवा भारती" },
        },
        { name: "intro", type: "text", maxLength: 300, admin: { description: "One line under the heading" } },
        {
          name: "excerpt",
          type: "richText",
          label: "Short text",
          admin: { description: "Shown on the home page. Bold words appear in saffron." },
        },
        {
          name: "story",
          type: "richText",
          label: "Full story",
          admin: { description: "Opens in a popup when the button is clicked. Bold words appear in saffron." },
        },
        { name: "readMoreLabel", type: "text", maxLength: 60, defaultValue: "पूरा पढ़ें", label: "Button text" },
        {
          name: "videoUrl",
          type: "text",
          maxLength: 300,
          label: "YouTube video link",
          validate: validateYouTubeUrl,
          admin: { description: "e.g. https://www.youtube.com/watch?v=zJgM7UGn8JI" },
        },
        {
          name: "videoThumbnail",
          type: "upload",
          relationTo: "media",
          label: "Video thumbnail",
          admin: {
            description:
              "Picture shown instead of the video; visitors click it to play the video. Resolution: 1280 × 720 px recommended (16:9 landscape); minimum 640 × 360 px; other shapes are cropped to 16:9. JPG, PNG or WebP, under 500 KB. Leave empty to use the video's own YouTube thumbnail. Upload limits: max 5 MB, max 40 megapixels, JPG/PNG/WebP/AVIF only.",
          },
        },
        { name: "videoTitle", type: "text", maxLength: 200, admin: { description: "Short description of the video (for screen readers)" } },
      ],
    },
    sectionHeadingField("pillarsHeading", "Pillars section heading"),
    {
      name: "eventsTeaser",
      type: "group",
      fields: [
        { name: "title", type: "text", maxLength: 160 },
        { name: "text", type: "textarea", maxLength: 500 },
        ctaField("cta", "Button"),
      ],
    },
    seoField,
  ],
};

export const AboutPage: GlobalConfig = {
  ...globalBase("about-page"),
  label: "About Page",
  admin: { group: "Pages" },
  fields: [
    pageHeaderField,
    {
      name: "sections",
      type: "array",
      fields: [
        { name: "heading", type: "text", required: true, maxLength: 200 },
        { name: "body", type: "richText", required: true },
      ],
    },
    { name: "pillarsHeading", type: "text", maxLength: 200 },
    { name: "detailsHeading", type: "text", maxLength: 200 },
    {
      name: "details",
      type: "array",
      label: "Organisation details (sidebar)",
      fields: [
        { name: "label", type: "text", required: true, maxLength: 120 },
        { name: "value", type: "textarea", required: true, maxLength: 500 },
      ],
    },
    seoField,
  ],
};

export const ContactPage: GlobalConfig = {
  ...globalBase("contact-page"),
  label: "Contact Page",
  admin: { group: "Pages", description: "Office addresses are edited in Site Settings → Contact." },
  fields: [
    pageHeaderField,
    {
      name: "emailBox",
      type: "group",
      fields: [
        { name: "heading", type: "text", maxLength: 120 },
        { name: "text", type: "text", maxLength: 300 },
      ],
    },
    seoField,
  ],
};

export const EventsPage: GlobalConfig = {
  ...globalBase("events-page"),
  label: "Events Page",
  admin: { group: "Pages", description: "Event entries themselves live in the Events collection." },
  fields: [
    pageHeaderField,
    sectionHeadingField("recentHeading", "Recent activities heading"),
    { name: "readMoreLabel", type: "text", maxLength: 80 },
    sectionHeadingField("galleryHeading", "Gallery heading"),
    { name: "galleryCaption", type: "text", maxLength: 200 },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true, maxRows: 60 },
    sectionHeadingField("guestsHeading", "Guests heading"),
    { name: "guestsNote", type: "text", maxLength: 300 },
    { name: "guests", type: "array", admin: { initCollapsed: true }, fields: guestFields },
    seoField,
  ],
};

// Small repeated UI text (labels, headings, aria text) used by templates.
export const UiStrings: GlobalConfig = {
  ...globalBase("ui-strings"),
  label: "UI Text & Labels",
  admin: { group: "Settings" },
  fields: [
    { name: "skipLink", type: "text", maxLength: 80 },
    {
      name: "a11y",
      type: "group",
      label: "Screen-reader labels",
      admin: { description: "Text read aloud by screen readers. {n} is replaced by a number." },
      fields: [
        { name: "menuOpen", type: "text", maxLength: 80 },
        { name: "menuClose", type: "text", maxLength: 80 },
        { name: "homeLinkLabel", type: "text", maxLength: 120 },
        { name: "eventPhotosHeading", type: "text", maxLength: 120 },
        { name: "showPhoto", type: "text", maxLength: 80 },
        { name: "prevGuest", type: "text", maxLength: 80 },
        { name: "nextGuest", type: "text", maxLength: 80 },
        { name: "showGuest", type: "text", maxLength: 80 },
      ],
    },
    { name: "pillarCardCta", type: "text", maxLength: 80, label: "Pillar card link text" },
    {
      name: "pillarPage",
      type: "group",
      fields: [
        { name: "bannerPrefix", type: "text", maxLength: 80 },
        sectionHeadingField("overview", "Overview heading"),
        sectionHeadingField("successStories", "Success stories heading"),
        sectionHeadingField("aayaam", "Areas of work heading"),
        { name: "ageSuffix", type: "text", maxLength: 20 },
      ],
    },
    {
      name: "eventPage",
      type: "group",
      fields: [
        { name: "backLabel", type: "text", maxLength: 80 },
        { name: "descriptionHeading", type: "text", maxLength: 80 },
        sectionHeadingField("guestsHeading", "Guests heading"),
        { name: "guestsNote", type: "text", maxLength: 300 },
      ],
    },
  ],
};

export const globals = [
  SiteSettings,
  Navigation,
  HomePage,
  AboutPage,
  ContactPage,
  EventsPage,
  UiStrings,
];
