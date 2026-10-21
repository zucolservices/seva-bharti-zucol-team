// Puts the pillar "Success stories" back (they were removed as sample data by
// content-en.ts). English text, translated faithfully from the original Hindi
// seed (src/seed/data/pillars.ts); photos are the seed's /events/gallery-*.png
// media, linked when they exist in the CMS.
//
// Safe on production: only touches each pillar's `successStories`, and only
// when it is empty (editor changes are never overwritten).
//   npx payload run scripts/restore-success-stories.ts
//   DRY_RUN=1 npx payload run scripts/restore-success-stories.ts   # preview
//   FORCE=1   npx payload run scripts/restore-success-stories.ts   # replace existing stories
import { getPayload } from "payload";
import config from "@payload-config";

const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE = process.env.FORCE === "1";

type Story = { name: string; age: number; bio: string; story: string; photo: string };

// Keyed by pillar; each key lists the old and the current CMS slug.
const STORIES: { slugs: string[]; stories: Story[] }[] = [
  {
    slugs: ["education", "shiksha"],
    stories: [
      {
        name: "Aarti Valmiki",
        age: 14,
        bio: "Lalkothi Basti · Class 9",
        story:
          "Aarti, who began her studies at a Balwadi, is now in Class 9 and is the first girl from her basti to top her school. She wants to become a teacher.",
        photo: "gallery-1.png",
      },
      {
        name: "Rohit Sen",
        age: 12,
        bio: "Sewa Basti · Class 7",
        story:
          "With the help of the coaching centre and the Jhola library, Rohit's studies improved steadily and he passed a scholarship examination.",
        photo: "gallery-2.png",
      },
    ],
  },
  {
    slugs: ["selfreliance", "swavalamban"],
    stories: [
      {
        name: "Sunita Devi",
        age: 28,
        bio: "Sewing Centre · Self-Help Group",
        story:
          "After completing her training at the sewing centre, Sunita started her own small boutique and is now the main contributor to her family's income.",
        photo: "gallery-3.png",
      },
      {
        name: "Manoj Kumar",
        age: 22,
        bio: "Computer Training Centre",
        story: "After training in Tally and basic computers, Manoj got a job as an accounts assistant at a local firm.",
        photo: "gallery-4.png",
      },
    ],
  },
  {
    slugs: ["socialharmony", "samajik"],
    stories: [
      {
        name: "Ramprasad Ji",
        age: 52,
        bio: "Yoga and Satsang Centre · Volunteer",
        story:
          "After joining the yoga centre, Ramprasad Ji himself began weekly satsang and yoga sessions in his basti as a volunteer.",
        photo: "gallery-5.png",
      },
      {
        name: "Geeta Sharma",
        age: 40,
        bio: "Festival Organising Committee",
        story:
          "Through active participation in festivals and jayanti celebrations, Geeta Ji has taken the lead in bringing the women of her basti into social work.",
        photo: "gallery-6.png",
      },
    ],
  },
  {
    slugs: ["healthcare", "swasthya"],
    stories: [
      {
        name: "Kamla Bai",
        age: 60,
        bio: "Eye Camp",
        story:
          "After free cataract surgery at an eye camp, Kamla Bai's sight was restored and she is once again living a self-reliant life.",
        photo: "gallery-7.png",
      },
      {
        name: "Imran Khan",
        age: 8,
        bio: "Mobile Clinic · Child Patient",
        story:
          "Timely treatment from the mobile clinic helped Imran recover from a serious infection, and he is now healthy and going to school.",
        photo: "gallery-8.png",
      },
    ],
  },
];

const payload = await getPayload({ config });

async function mediaId(filename: string): Promise<number | undefined> {
  const found = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0 });
  return found.docs[0]?.id as number | undefined;
}

let changed = 0;
for (const group of STORIES) {
  const res = await payload.find({ collection: "pillars", where: { slug: { in: group.slugs } }, limit: 1, depth: 0 });
  const pillar = res.docs[0];
  if (!pillar) {
    console.log(`skipped   ${group.slugs.join("/")}: pillar not found`);
    continue;
  }
  const existing = pillar.successStories ?? [];
  if (existing.length > 0 && !FORCE) {
    console.log(`unchanged ${pillar.slug}: already has ${existing.length} stories (FORCE=1 to replace)`);
    continue;
  }
  const rows = [];
  for (const s of group.stories) {
    const photo = await mediaId(s.photo);
    if (!photo) console.log(`  note: photo ${s.photo} not found in media — story added without a photo`);
    // The site shows the English fields; the Hi fields carry the same English
    // text, as elsewhere after content-en.ts.
    rows.push({ nameHi: s.name, nameEn: s.name, age: s.age, bioHi: s.bio, storyHi: s.story, ...(photo ? { photo } : {}) });
  }
  console.log(`${DRY_RUN ? "would add" : "added"}     ${pillar.slug}: ${rows.map((r) => r.nameEn).join(", ")}`);
  if (!DRY_RUN) await payload.update({ collection: "pillars", id: pillar.id, data: { successStories: rows } as never, depth: 0 });
  changed++;
}

console.log(`\n${DRY_RUN ? "DRY RUN — nothing saved. " : ""}pillars updated: ${changed}`);
// Give the website-refresh webhook time to go out before exiting.
await new Promise((r) => setTimeout(r, 2000));
process.exit(0);
