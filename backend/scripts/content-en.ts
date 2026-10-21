// Converts the CMS content to English and removes the seeded sample data.
// Safe on production: touches only content (globals, pillars, events) — never
// users, portal users or media. Idempotent: a second run changes nothing.
//   npx payload run scripts/content-en.ts             # apply
//   DRY_RUN=1 npx payload run scripts/content-en.ts   # only print what would change
//
// How it works, per document:
//  1. Sample data is removed (client decision, rules.md 1.6): pillar "सेवा आयाम N"
//     filler tiles, pillar stats + success stories, event and events-page guests
//     (matched against the seed data in src/seed/data, so real entries added
//     later are kept), and the "sample entries" guests note.
//  2. Hi/En field pairs get the same English in both fields (the site shows the
//     Hi fields in many places): existing English is kept, otherwise the Hindi
//     is translated. Trailing ":" is stripped from English pillar names.
//  3. Every other string containing Devanagari (incl. rich-text text nodes) is
//     replaced from the dictionary in scripts/data/content-en.ts. Strings not in
//     the dictionary are left as they are and printed as UNTRANSLATED.
// Kept in Hindi on purpose: the motto "सेवा परमो धर्मः" and site-settings nameHi.
// Saves use the normal hooks, so the website-refresh webhook fires.
import { getPayload } from "payload";
import type { GlobalSlug } from "payload";
import config from "@payload-config";
import { CONTENT_EN, CONTENT_EN_BY_PATH } from "./data/content-en";
import { pillars as seedPillars } from "../src/seed/data/pillars";
import { events as seedEvents, mainGuests as seedMainGuests } from "../src/seed/data/events";

type Obj = Record<string, unknown>;

const DRY_RUN = process.env.DRY_RUN === "1";
const DEVANAGARI = /[ऀ-ॿ]/;
const MOTTO = "सेवा परमो धर्मः";
const FILLER_AAYAAM = /^(सेवा आयाम|sewa aayaam)\s*\d+$/i;
const SAMPLE_NOTE = /नमूना प्रविष्टियाँ|^sample entries/i;
const SKIP_KEYS = new Set(["id", "createdAt", "updatedAt", "globalType", "_status"]);

// Seed sample data, used to recognise what to delete.
const sampleStoryNames = new Set(
  seedPillars.flatMap((p) => p.successStories.flatMap((s) => [s.nameHi, s.nameEn])),
);
const sampleStatLabels = new Set(seedPillars.flatMap((p) => p.stats.map((s) => s.labelHi)));
const sampleGuestNames = new Set([
  ...seedEvents.flatMap((e) => (e.guests ?? []).map((g) => g.name)),
  ...seedMainGuests.map((g) => g.name),
]);
// Seed "English" pillar names that are only transliterations (Shiksha, …).
const transliteratedPillarNames = new Set(seedPillars.map((p) => p.nameEn));

const summary = {
  docsChecked: 0,
  docsChanged: 0,
  translated: 0,
  removed: {} as Record<string, number>,
  untranslated: [] as string[],
  skipped: [] as string[],
};

const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
const hasHindi = (v: unknown): v is string => typeof v === "string" && DEVANAGARI.test(v);
const rows = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);

function lookup(text: string, where: string): string | undefined {
  const byPath = CONTENT_EN_BY_PATH[where.replace(/\[\d+\]/g, "[]")];
  const exact = byPath?.[text] ?? CONTENT_EN[text];
  if (exact !== undefined) return exact;
  // Same text with different surrounding whitespace.
  const [, lead, core, trail] = text.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? [];
  const hit = byPath?.[core] ?? CONTENT_EN[core];
  return hit === undefined ? undefined : lead + hit.trim() + trail;
}

// Generic pass: replace every Devanagari string found in the dictionary.
function translateDeep(v: unknown, doc: string, path: string, keep: (path: string) => boolean): unknown {
  if (typeof v === "string") {
    if (!DEVANAGARI.test(v) || keep(path) || v.trim() === MOTTO) return v;
    const en = lookup(v, `${doc}:${path}`);
    if (en === undefined) {
      summary.untranslated.push(`${doc}:${path} = ${JSON.stringify(v.length > 90 ? v.slice(0, 90) + "…" : v)}`);
      return v;
    }
    summary.translated++;
    return en;
  }
  if (Array.isArray(v)) return v.map((x, i) => translateDeep(x, doc, `${path}[${i}]`, keep));
  if (isObj(v)) {
    const out: Obj = {};
    for (const [k, x] of Object.entries(v)) out[k] = translateDeep(x, doc, path ? `${path}.${k}` : k, keep);
    return out;
  }
  return v;
}

// Hi/En pair → the same English in both fields.
function fillPair(
  row: Obj,
  hiKey: string,
  enKey: string,
  where: string,
  opts: { stripColon?: boolean; notEnglish?: Set<string> } = {},
) {
  const isEnglish = (v: unknown): v is string =>
    typeof v === "string" && v.trim() !== "" && !DEVANAGARI.test(v) && !opts.notEnglish?.has(v.trim());
  const hi = row[hiKey];
  const en = row[enKey];
  let value: string | undefined = isEnglish(en)
    ? en
    : isEnglish(hi)
      ? hi
      : hasHindi(hi)
        ? lookup(hi, `${where}.${hiKey}`)
        : undefined;
  if (value === undefined) return; // reported as UNTRANSLATED by the generic pass
  if (opts.stripColon) value = value.replace(/\s*:+\s*$/, "").trim();
  if (hasHindi(hi)) summary.translated++;
  row[enKey] = value;
  row[hiKey] = value;
}

function stripColon(row: Obj, key: string) {
  const v = row[key];
  if (typeof v === "string" && !DEVANAGARI.test(v) && /:\s*$/.test(v)) row[key] = v.replace(/\s*:+\s*$/, "").trim();
}

function removeRows(row: Obj, key: string, label: string, isSample: (r: Obj) => boolean) {
  const list = row[key];
  if (!Array.isArray(list)) return;
  const kept = list.filter((r) => !(isObj(r) && isSample(r)));
  const n = list.length - kept.length;
  if (n > 0) {
    row[key] = kept;
    summary.removed[label] = (summary.removed[label] ?? 0) + n;
  }
}

function clearSampleNote(group: unknown, key: string, label: string) {
  if (isObj(group) && typeof group[key] === "string" && SAMPLE_NOTE.test(group[key] as string)) {
    group[key] = "";
    summary.removed[label] = (summary.removed[label] ?? 0) + 1;
  }
}

// Top-level fields whose value changed (arrays/groups are sent whole).
function changedFields(before: Obj, after: Obj): Obj {
  const data: Obj = {};
  for (const [k, v] of Object.entries(after)) {
    if (SKIP_KEYS.has(k)) continue;
    if (JSON.stringify(before[k]) !== JSON.stringify(v)) data[k] = v;
  }
  return data;
}

const payload = await getPayload({ config });

// ---- Globals ---------------------------------------------------------------

const globalRules: Partial<Record<GlobalSlug, { rules?: (d: Obj) => void; keep?: (path: string) => boolean }>> = {
  "site-settings": {
    rules: (d) => {
      fillPair(d, "introHi", "introEn", "site-settings");
      rows(d.offices).forEach((o, i) => fillPair(o, "nameHi", "name", `site-settings:offices[${i}]`));
    },
    // The organisation's Hindi name and the Sanskrit motto stay as they are.
    keep: (path) => path === "nameHi" || path === "tagline",
  },
  // The featured story (Vimla ji's story) and the motto stay in Hindi (client decision).
  "home-page": {
    keep: (path) => path === "featuredStory" || path.startsWith("featuredStory.") || path === "hero.tagline",
  },
  "events-page": {
    rules: (d) => {
      removeRows(d, "guests", "events-page.guests", (g) => sampleGuestNames.has(String(g.name)));
      clearSampleNote(d, "guestsNote", "events-page.guestsNote (sample note)");
    },
  },
  "ui-strings": {
    rules: (d) => clearSampleNote(d.eventPage, "guestsNote", "ui-strings.eventPage.guestsNote (sample note)"),
  },
};

const globalSlugs: GlobalSlug[] = [
  "site-settings",
  "navigation",
  "home-page",
  "about-page",
  "contact-page",
  "events-page",
  "ui-strings",
];

for (const slug of globalSlugs) {
  summary.docsChecked++;
  const before = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Obj;
  const work = structuredClone(before);
  globalRules[slug]?.rules?.(work);
  const keep = globalRules[slug]?.keep ?? (() => false);
  const after = translateDeep(work, slug, "", keep) as Obj;
  const data = changedFields(before, after);
  if (Object.keys(data).length === 0) {
    console.log(`unchanged ${slug}`);
    continue;
  }
  summary.docsChanged++;
  console.log(`${DRY_RUN ? "would change" : "changed"} ${slug}: ${Object.keys(data).join(", ")}`);
  if (!DRY_RUN) await payload.updateGlobal({ slug, data: data as never, depth: 0 });
}

// ---- Pillars ---------------------------------------------------------------

const pillarDocs = await payload.find({ collection: "pillars", depth: 0, limit: 100, pagination: false });
for (const doc of pillarDocs.docs) {
  summary.docsChecked++;
  const label = `pillars/${doc.slug}`;
  const before = doc as unknown as Obj;
  const work = structuredClone(before);

  removeRows(work, "aayaam", "pillars.aayaam (filler tiles)", (a) =>
    FILLER_AAYAAM.test(String(a.titleHi ?? "").trim()) || FILLER_AAYAAM.test(String(a.titleEn ?? "").trim()),
  );
  removeRows(work, "successStories", "pillars.successStories (sample)", (s) =>
    sampleStoryNames.has(String(s.nameHi)) || sampleStoryNames.has(String(s.nameEn)),
  );
  removeRows(work, "stats", "pillars.stats (sample)", (s) => sampleStatLabels.has(String(s.labelHi)));

  fillPair(work, "nameHi", "nameEn", label, { stripColon: true, notEnglish: transliteratedPillarNames });
  stripColon(work, "navLabel");
  fillPair(work, "summaryHi", "summaryEn", label);
  rows(work.activities).forEach((a, i) => fillPair(a, "titleHi", "titleEn", `${label}:activities[${i}]`));
  rows(work.aayaam).forEach((a, i) => fillPair(a, "titleHi", "titleEn", `${label}:aayaam[${i}]`));

  const after = translateDeep(work, "pillars", "", () => false) as Obj;
  const data = changedFields(before, after);
  if (Object.keys(data).length === 0) {
    console.log(`unchanged ${label}`);
    continue;
  }
  summary.docsChanged++;
  console.log(`${DRY_RUN ? "would change" : "changed"} ${label}: ${Object.keys(data).join(", ")}`);
  if (!DRY_RUN) await payload.update({ collection: "pillars", id: doc.id, data: data as never, depth: 0 });
}

// ---- Events (draft → publish workflow) --------------------------------------

const eventDocs = await payload.find({ collection: "events", depth: 0, limit: 500, pagination: false, draft: true });
for (const doc of eventDocs.docs) {
  summary.docsChecked++;
  const label = `events/${doc.slug}`;
  const isDraft = doc._status === "draft";
  if (isDraft) {
    // A published event with newer unpublished edits: saving either version
    // here would overwrite the other, so leave it to an editor.
    const main = await payload.findByID({ collection: "events", id: doc.id, depth: 0, draft: false });
    if (main._status === "published") {
      summary.skipped.push(`${label}: has unpublished draft changes — publish or discard them in the admin, then re-run`);
      continue;
    }
  }
  const before = doc as unknown as Obj;
  const work = structuredClone(before);

  removeRows(work, "guests", "events.guests (sample)", (g) => sampleGuestNames.has(String(g.name)));
  fillPair(work, "titleHi", "titleEn", label);

  const after = translateDeep(work, "events", "", () => false) as Obj;
  const data = changedFields(before, after);
  if (Object.keys(data).length === 0) {
    console.log(`unchanged ${label}`);
    continue;
  }
  summary.docsChanged++;
  console.log(`${DRY_RUN ? "would change" : "changed"} ${label}${isDraft ? " (draft)" : ""}: ${Object.keys(data).join(", ")}`);
  if (!DRY_RUN) {
    await payload.update({ collection: "events", id: doc.id, data: data as never, depth: 0, draft: isDraft });
  }
}

// ---- Summary ---------------------------------------------------------------

console.log("\n=== content-en summary" + (DRY_RUN ? " (DRY RUN — nothing saved)" : "") + " ===");
console.log(`docs checked:        ${summary.docsChecked}`);
console.log(`docs changed:        ${summary.docsChanged}`);
console.log(`strings translated:  ${summary.translated}`);
const removedEntries = Object.entries(summary.removed);
console.log(`items removed:       ${removedEntries.reduce((n, [, c]) => n + c, 0)}`);
for (const [what, n] of removedEntries) console.log(`  - ${what}: ${n}`);
for (const s of summary.skipped) console.log(`SKIPPED: ${s}`);
for (const u of summary.untranslated) console.log(`UNTRANSLATED: ${u}`);
console.log(`untranslated:        ${summary.untranslated.length}`);

if (summary.docsChanged > 0 && !DRY_RUN) await new Promise((r) => setTimeout(r, 2000)); // let the website-refresh webhooks go out
process.exit(0);
