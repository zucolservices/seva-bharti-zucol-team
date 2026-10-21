import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillarPage from "@/components/PillarPage";
import { getContent, getGlobal, getPillarBySlug, getPillars } from "@/lib/cms";
import { PILLAR_NAMES, byPillar } from "@/content/pillars";
import { resolveWork } from "@/content/resolve";

// One page per pillar document, at /<slug>. Static siblings (about-us,
// events, contact, blog) take precedence over this dynamic segment.
//
// Under Cache Components generateStaticParams must return at least one param
// (an empty list is a build error). If the DB has no pillars at build time we
// return a placeholder that can never match a real slug (slugs are validated
// to [a-z0-9-]); it renders notFound(). Pillars added later are rendered on
// first request and cached (ISR with Cache Components).
const PLACEHOLDER_SLUG = "__placeholder__";

// Unknown slugs must answer with a real HTTP 404 (not a 200 "soft 404"), so the
// pillar is looked up before anything streams. Reading `params` outside
// <Suspense> needs this opt-out from instant-navigation validation; known
// pillars are still prerendered via generateStaticParams.
export const instant = false;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const pillars = await getPillars();
  return pillars.length > 0 ? pillars.map((p) => ({ slug: p.slug })) : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getPillarBySlug(slug);
  if (!pillar) return {};
  const names = byPillar(PILLAR_NAMES, pillar.slug);
  return {
    title: pillar.seo?.metaTitle || (names ? `${names.title} (${names.badge})` : pillar.nameEn),
    description: pillar.seo?.metaDescription || pillar.summaryEn || pillar.summaryHi,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const [pillar, ui, workContent] = await Promise.all([
    getPillarBySlug(slug),
    getGlobal("ui-strings"),
    getContent("work-content"),
  ]);
  if (!pillar) notFound();
  return <PillarPage pillar={pillar} labels={ui?.pillarPage} workPillars={resolveWork(workContent).pillars} />;
}
