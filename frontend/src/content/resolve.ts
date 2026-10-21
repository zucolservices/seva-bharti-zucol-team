// Merges the editable page content (Payload globals `*-content`) over the
// static defaults in src/content. The CMS only overrides NON-EMPTY values; a
// missing global / group / field, an empty string or an empty list falls back
// to the static constant, so the site looks the same until an editor changes
// something (and keeps working against an older CMS).
//
// No `server-only` here: results are plain data and can be passed to client
// components as props. Media (upload) fields must already be populated objects
// with a `url` (see getContent in src/lib/cms.ts); anything else is ignored.
import type { PillarKey } from "@/content/pillars";
import { ABOUT_HEADER, ABOUT_MESSAGE, ABOUT_MISSION, ABOUT_STRUCTURE, ABOUT_VISION } from "@/content/pages/about";
import { CONTACT_HEADER } from "@/content/pages/contact";
import {
  CSR_CTA,
  CSR_HEADER,
  CSR_INITIATIVES,
  CSR_INITIATIVES_HEADING,
  CSR_PATH_LAB,
} from "@/content/pages/csr";
import { FOOTER_COMPLIANCE, FOOTER_COPYRIGHT, FOOTER_HEADINGS, FOOTER_MOTTO } from "@/content/pages/footer";
import {
  GALLERY_ALL_EVENTS,
  GALLERY_HEADER,
  GALLERY_PHOTO_ALT,
  GALLERY_RECENT_HEADING,
} from "@/content/pages/gallery";
import {
  HOME_DONATE,
  HOME_HERO,
  HOME_IMPACT,
  HOME_OBJECTIVE,
  HOME_PILLARS_HEADING,
  HOME_PILLAR_LINES,
  HOME_VISION,
  type Segment,
} from "@/content/pages/home";
import {
  PARTNERS,
  PARTNERS_CTA,
  PARTNERS_GRID_LABEL,
  PARTNERS_HEADER,
  PARTNERS_META,
  PARTNERS_NOTE,
  type Partner,
} from "@/content/pages/partners";
import { HOME_QUOTES, HOME_QUOTES_LABELS, type HomeQuote } from "@/content/pages/quotes";
import { VOLUNTEER_CAPACITY, VOLUNTEER_CTA, VOLUNTEER_HEADER } from "@/content/pages/volunteer";
import { WORK_CTA_LABEL, WORK_HEADER, WORK_PILLARS } from "@/content/pages/work";

export type Cms = Record<string, unknown> | null | undefined;

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";

/** URL of a populated upload (`{ url }`), else null (ids / empty are ignored). */
export function mediaSrc(v: unknown): string | null {
  return isObj(v) && nonEmpty(v.url) ? v.url : null;
}

/** String-list rows (`[{ text }]`, or plain strings) -> non-empty string[]. */
export function rowsToStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((r) => (typeof r === "string" ? r : isObj(r) ? r.text : undefined))
    .filter(nonEmpty);
}

/** "plain **highlighted** plain" -> ["plain ", { hl: "highlighted" }, " plain"]. */
export function parseHighlights(s: string): Segment[] {
  const out: Segment[] = [];
  s.split(/\*\*(.+?)\*\*/gs).forEach((part, i) => {
    if (part === "") return;
    out.push(i % 2 === 1 ? { hl: part } : part);
  });
  return out;
}

/**
 * Deep merge: `defaults` is the shape. A CMS value replaces the default only
 * when non-empty and of the same kind. String lists accept `[{text}]` rows;
 * lists of objects are taken from the CMS when non-empty (each row merged over
 * the default row at the same index); a default string may be replaced by a
 * media object's url.
 */
export function mergeContent<T>(defaults: T, cms: unknown): T {
  const d: unknown = defaults;
  if (d === null || d === undefined || typeof d === "string") {
    if (nonEmpty(cms)) return cms as T;
    const url = mediaSrc(cms);
    if (url && typeof d === "string") return url as T;
    return defaults;
  }
  if (typeof d === "number") return (typeof cms === "number" ? cms : d) as T;
  if (typeof d === "boolean") return (typeof cms === "boolean" ? cms : d) as T;
  if (Array.isArray(d)) {
    if (!Array.isArray(cms) || cms.length === 0) return defaults;
    if (d.length === 0 || typeof d[0] === "string") {
      const strings = rowsToStrings(cms);
      return (strings.length ? strings : d) as T;
    }
    return cms.map((row, i) => (isObj(row) ? mergeContent(d[i] ?? (undefined as unknown), row) ?? row : d[i])) as T;
  }
  if (isObj(d)) {
    const src = isObj(cms) ? cms : {};
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(d)) out[k] = mergeContent(d[k], src[k]);
    // Keys the defaults do not know (rows beyond the defaults) are kept as-is.
    if (Object.keys(d).length === 0) Object.assign(out, src);
    return out as T;
  }
  return defaults;
}

const group = (cms: Cms, key: string): unknown => (isObj(cms) ? cms[key] : undefined);

/** Highlighted paragraphs: CMS strings with **hl** markers, else the default segments. */
function segmentList(cms: unknown, defaults: Segment[][]): Segment[][] {
  const rows = rowsToStrings(cms);
  return rows.length ? rows.map(parseHighlights) : defaults;
}
function segmentOne(cms: unknown, defaults: Segment[]): Segment[] {
  return nonEmpty(cms) ? parseHighlights(cms) : defaults;
}

// ---- Home ------------------------------------------------------------------

export function resolveHome(cms: Cms) {
  const obj = group(cms, "objective");
  const vis = group(cms, "vision");
  const objectiveStrings = mergeContent(
    { heading: HOME_OBJECTIVE.heading, structureHeading: HOME_OBJECTIVE.structureHeading, imageAlt: HOME_OBJECTIVE.imageAlt, image: HOME_OBJECTIVE.image },
    obj,
  );
  const objective: typeof HOME_OBJECTIVE = {
    ...objectiveStrings,
    paragraphs: segmentList(isObj(obj) ? obj.paragraphs : undefined, HOME_OBJECTIVE.paragraphs),
    structureParagraphs: segmentList(isObj(obj) ? obj.structureParagraphs : undefined, HOME_OBJECTIVE.structureParagraphs),
  };
  const visionStrings = mergeContent(
    { heading: HOME_VISION.heading, appeal: HOME_VISION.appeal, imageAlt: HOME_VISION.imageAlt },
    vis,
  );
  const vision: typeof HOME_VISION = {
    ...visionStrings,
    paragraph: segmentOne(isObj(vis) ? vis.paragraph : undefined, HOME_VISION.paragraph),
  };

  // Quotes: rows from the CMS (portrait = uploaded photo, else the default at
  // the same index); a row without any portrait is skipped.
  const rawQuotes = group(cms, "quotes");
  let quotes: HomeQuote[] = HOME_QUOTES;
  if (Array.isArray(rawQuotes) && rawQuotes.length > 0) {
    const rows = rawQuotes.flatMap((r, i): HomeQuote[] => {
      if (!isObj(r) || !nonEmpty(r.quote) || !nonEmpty(r.name)) return [];
      const def = HOME_QUOTES[i];
      const photo = mediaSrc(r.photo) ?? def?.photo;
      if (!photo) return [];
      return [
        {
          photo,
          quote: r.quote,
          name: r.name,
          tagline: nonEmpty(r.tagline) ? r.tagline : undefined,
          role: nonEmpty(r.role) ? r.role : undefined,
        },
      ];
    });
    if (rows.length) quotes = rows;
  }

  return {
    hero: mergeContent(HOME_HERO, group(cms, "hero")),
    impact: mergeContent(HOME_IMPACT, group(cms, "impact")),
    pillarsHeading: mergeContent(HOME_PILLARS_HEADING, group(cms, "pillarsHeading")),
    pillarLines: mergeContent(HOME_PILLAR_LINES, group(cms, "pillarLines")) as Record<PillarKey, string>,
    objective,
    vision,
    donate: mergeContent(HOME_DONATE, group(cms, "donate")),
    quotes,
    quotesLabels: mergeContent(HOME_QUOTES_LABELS, group(cms, "quotesLabels")),
  };
}

// ---- Other pages -----------------------------------------------------------

export function resolveAbout(cms: Cms) {
  return {
    header: mergeContent(ABOUT_HEADER, group(cms, "header")),
    vision: mergeContent(ABOUT_VISION, group(cms, "vision")),
    message: mergeContent(ABOUT_MESSAGE, group(cms, "message")),
    mission: mergeContent(ABOUT_MISSION, group(cms, "mission")),
    structure: mergeContent(ABOUT_STRUCTURE, group(cms, "structure")),
  };
}

export function resolveWork(cms: Cms) {
  return {
    header: mergeContent(WORK_HEADER, group(cms, "header")),
    pillars: mergeContent(WORK_PILLARS, group(cms, "pillars")),
    ctaLabel: mergeContent(WORK_CTA_LABEL, group(cms, "ctaLabel")),
  };
}

export function resolveCsr(cms: Cms) {
  return {
    header: mergeContent(CSR_HEADER, group(cms, "header")),
    initiativesHeading: mergeContent(CSR_INITIATIVES_HEADING, group(cms, "initiativesHeading")),
    // `id` is the /csr#anchor used by the menu: keep the default's at the same
    // index (a CMS array row's own `id` is Payload's internal row id).
    initiatives: mergeContent(CSR_INITIATIVES, group(cms, "initiatives")).map((it, i) => ({
      ...it,
      id: CSR_INITIATIVES[i]?.id ?? it.id,
    })),
    pathLab: mergeContent(CSR_PATH_LAB, group(cms, "pathLab")),
    cta: mergeContent(CSR_CTA, group(cms, "cta")),
  };
}

export function resolveVolunteer(cms: Cms) {
  return {
    header: mergeContent(VOLUNTEER_HEADER, group(cms, "header")),
    capacity: mergeContent(VOLUNTEER_CAPACITY, group(cms, "capacity")),
    cta: mergeContent(VOLUNTEER_CTA, group(cms, "cta")),
  };
}

export function resolveGallery(cms: Cms) {
  return {
    header: mergeContent(GALLERY_HEADER, group(cms, "header")),
    recentHeading: mergeContent(GALLERY_RECENT_HEADING, group(cms, "recentHeading")),
    allEvents: mergeContent(GALLERY_ALL_EVENTS, group(cms, "allEvents")),
    photoAlt: mergeContent(GALLERY_PHOTO_ALT, group(cms, "photoAlt")),
  };
}

export function resolveContact(cms: Cms) {
  return { header: mergeContent(CONTACT_HEADER, group(cms, "header")) };
}

export function resolvePartners(cms: Cms) {
  let partners: Partner[] = PARTNERS;
  const rows = group(cms, "partners");
  if (Array.isArray(rows) && rows.length > 0) {
    const byName = new Map(PARTNERS.map((p) => [p.name.trim().toLowerCase(), p]));
    const list = rows.flatMap((r): Partner[] => {
      if (!isObj(r) || !nonEmpty(r.name)) return [];
      const def = byName.get(r.name.trim().toLowerCase());
      const cmsLogo = mediaSrc(r.logo);
      const logo = cmsLogo ?? def?.logo;
      const emblem = r.emblem === true || (!cmsLogo && !!def?.emblem);
      return [{ name: r.name, ...(logo ? { logo } : {}), ...(emblem ? { emblem: true } : {}) }];
    });
    if (list.length) partners = list;
  }
  return {
    meta: mergeContent(PARTNERS_META, group(cms, "meta")),
    header: mergeContent(PARTNERS_HEADER, group(cms, "header")),
    note: mergeContent(PARTNERS_NOTE, group(cms, "note")),
    gridLabel: mergeContent(PARTNERS_GRID_LABEL, group(cms, "gridLabel")),
    partners,
    cta: mergeContent(PARTNERS_CTA, group(cms, "cta")),
  };
}

export function resolveFooter(cms: Cms) {
  return {
    motto: mergeContent(FOOTER_MOTTO, group(cms, "motto")),
    copyright: mergeContent(FOOTER_COPYRIGHT, group(cms, "copyright")),
    headings: mergeContent(FOOTER_HEADINGS, group(cms, "headings")),
    compliance: mergeContent(FOOTER_COMPLIANCE, group(cms, "compliance")),
  };
}
