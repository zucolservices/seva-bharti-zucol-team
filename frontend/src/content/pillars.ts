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

/**
 * English display names (content document, section 4). `title` is the main
 * label (menu, card heading); `badge` is the Sanskrit/Hindi name in Latin
 * script, shown as a small badge.
 */
export type PillarName = { title: string; badge: string };

export const PILLAR_NAMES: Record<PillarKey, PillarName> = {
  shiksha: { title: "Education", badge: "Shiksha" },
  swasthya: { title: "Healthcare", badge: "Swasthya" },
  swavalamban: { title: "Self-Reliance", badge: "Swavalamban" },
  samajik: { title: "Social Harmony", badge: "Samajik Samarasata" },
};
