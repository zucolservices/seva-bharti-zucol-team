// Fills Home Page → Hero → Slider so editors start from real slides:
// slide 1 is the current hero (title, intro, banner), then one slide per
// Aayaam from Pillars (English name, English summary, banner image).
// Safe on production: only writes `hero.slides`, and only when it is empty.
//   npx payload run scripts/seed-hero-slides.ts
//   DRY_RUN=1 npx payload run scripts/seed-hero-slides.ts   # preview
//   FORCE=1   npx payload run scripts/seed-hero-slides.ts   # replace existing slides
import { getPayload } from "payload";
import config from "@payload-config";

const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE = process.env.FORCE === "1";

const payload = await getPayload({ config });
const home = await payload.findGlobal({ slug: "home-page", depth: 0 });
const hero = home.hero;

if ((hero?.slides?.length ?? 0) > 0 && !FORCE) {
  console.log(`unchanged: the slider already has ${hero?.slides?.length} slides (FORCE=1 to replace)`);
  process.exit(0);
}

const id = (m: unknown) => (typeof m === "object" && m && "id" in m ? (m as { id: number }).id : (m as number | null | undefined));

const slides: { heading: string; content: string; image?: number | null }[] = [];
if (hero?.title?.trim() && hero.intro?.trim()) {
  slides.push({ heading: hero.title.trim(), content: hero.intro.trim(), image: id(hero.image) ?? null });
}

const { docs: pillars } = await payload.find({ collection: "pillars", sort: "order", limit: 20, depth: 0 });
for (const p of pillars) {
  const heading = (p.nameEn || p.nameHi || "").trim();
  const content = (p.summaryEn || p.summaryHi || "").trim();
  if (!heading || !content) {
    console.log(`  skipped pillar ${p.slug}: no name or summary`);
    continue;
  }
  slides.push({ heading: heading.slice(0, 120), content: content.slice(0, 600), image: id(p.banner) ?? null });
}

for (const [i, s] of slides.entries()) console.log(`${DRY_RUN ? "would add" : "added"} ${i + 1}. ${s.heading}${s.image ? "" : " (no image)"}`);

if (!DRY_RUN) {
  await payload.updateGlobal({ slug: "home-page", data: { hero: { ...hero, slides } } as never, depth: 0 });
}
console.log(`\n${DRY_RUN ? "DRY RUN — nothing saved. " : ""}slides: ${slides.length}`);
// Give the website-refresh webhook time to go out before exiting.
await new Promise((r) => setTimeout(r, 2000));
process.exit(0);
