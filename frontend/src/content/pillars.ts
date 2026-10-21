// Pillar names used by the menu, home grid and /our-work, keyed by the
// content-document pillar. The CMS slugs changed (shiksha → education, …), so
// both the old and the current slugs map to the same entry.

export type PillarKey = "shiksha" | "swasthya" | "swavalamban" | "samajik";

const SLUG_TO_KEY: Record<string, PillarKey> = {
  shiksha: "shiksha",
  education: "shiksha",
  swasthya: "swasthya",
  healthcare: "swasthya",
  swavalamban: "swavalamban",
  selfreliance: "swavalamban",
  samajik: "samajik",
  socialharmony: "samajik",
};

export function pillarKey(slug: string): PillarKey | undefined {
  return SLUG_TO_KEY[slug];
}

/** Look up per-pillar copy by CMS slug (old or new). */
export function byPillar<T>(map: Record<PillarKey, T>, slug: string): T | undefined {
  const key = pillarKey(slug);
  return key ? map[key] : undefined;
}

export const PILLAR_NAMES: Record<PillarKey, { hi: string; en: string }> = {
  shiksha: { hi: "शिक्षा", en: "Shiksha · Education" },
  swasthya: { hi: "स्वास्थ्य", en: "Swasthya · Healthcare" },
  swavalamban: { hi: "स्वावलंबन", en: "Swavalamban · Self-Reliance" },
  samajik: { hi: "सामाजिक समरसता", en: "Samajik Samarasata · Social Harmony" },
};
