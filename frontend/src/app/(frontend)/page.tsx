import type { Metadata } from "next";
import Link from "next/link";
import DonateSection from "@/components/DonateSection";
import EventCard from "@/components/EventCard";
import FeaturedStory from "@/components/FeaturedStory";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import ImpactBanner from "@/components/ImpactBanner";
import SectionDivider from "@/components/SectionDivider";
import MissionVision from "@/components/MissionVision";
import QuoteCarousel from "@/components/QuoteCarousel";
import { DEFAULT_FEATURED_STORY } from "@/content/featured-story-default";
import { HOME_EVENTS_TEASER_OVERRIDES, overrideSeedText } from "@/content/pages/home";
import { resolveHome } from "@/content/resolve";
import { byPillar, pillarNames } from "@/content/pillars";
import PillarCard from "@/components/PillarCard";
import StatCounter from "@/components/StatCounter";
import SectionHeading from "@/components/SectionHeading";
import { getContent, getEvents, getGlobal, getPillars, mediaAlt, mediaUrl } from "@/lib/cms";
import { siteLogo } from "@/lib/site-data";
import { langOf } from "@/lib/view-types";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getGlobal("home-page");
  const meta: Metadata = {};
  if (home?.seo?.metaTitle) meta.title = { absolute: home.seo.metaTitle };
  if (home?.seo?.metaDescription) meta.description = home.seo.metaDescription;
  return meta;
}

export default async function HomePage() {
  const [home, settings, ui, pillars, events, eventsPage, homeContent] = await Promise.all([
    getGlobal("home-page"),
    getGlobal("site-settings"),
    getGlobal("ui-strings"),
    getPillars(),
    getEvents(),
    getGlobal("events-page"),
    getContent("home-content"),
  ]);
  const content = resolveHome(homeContent);

  const hero = home?.hero;
  const heroTitle = hero?.title?.trim() || content.hero.title;
  const heroIntro = hero?.intro?.trim() || content.hero.intro;
  const logo = siteLogo(settings);
  // Slider: the CMS slides; until any are added, the hero title/intro/banner
  // followed by one slide per Aayaam (pillar name, summary, banner).
  const slideImage = (m: unknown, fallbackAlt: string): HeroSlide["image"] => {
    const url = mediaUrl(m as Parameters<typeof mediaUrl>[0]);
    if (!url || !m || typeof m !== "object") return null;
    const media = m as { width?: number | null; height?: number | null };
    return { url, alt: mediaAlt(m as Parameters<typeof mediaAlt>[0], fallbackAlt), width: media.width ?? 1200, height: media.height ?? 800 };
  };
  const cmsSlides = (hero?.slides ?? []).map((s) => ({
    heading: s.heading,
    content: s.content,
    image: slideImage(s.image, s.heading),
  }));
  const heroSlides: HeroSlide[] =
    cmsSlides.length > 0
      ? cmsSlides
      : [
          { heading: heroTitle, content: heroIntro, image: slideImage(hero?.image, logo.alt) },
          ...pillars
            .map((p) => ({
              heading: pillarNames(p).title,
              content: (p.summaryEn || p.summaryHi || "").trim(),
              image: slideImage(p.banner, pillarNames(p).title),
            }))
            .filter((sl) => sl.content),
        ];
  const stats = home?.stats ?? [];
  // The original seed wording is replaced by the English copy; any other text
  // set in the CMS (Home Page → Events Teaser) is shown as-is.
  const rawTeaser = home?.eventsTeaser;
  const { title: titleOverride, cta: ctaOverride } = HOME_EVENTS_TEASER_OVERRIDES;
  const teaser = rawTeaser && {
    ...rawTeaser,
    title: overrideSeedText(rawTeaser.title, titleOverride),
    cta: rawTeaser.cta && {
      ...rawTeaser.cta,
      label: overrideSeedText(rawTeaser.cta.label, ctaOverride),
    },
  };
  // A few of the latest published events, previewed on the home page.
  const latestEvents = events.slice(0, 3);

  return (
    <>
      {/* Hero slider (Home Page → Hero → Slider). */}
      <section className="overflow-hidden bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
        <HeroCarousel slides={heroSlides} badge={hero?.badge} fallbackImage={logo} />
      </section>

      {/* Trust / credentials band */}
      {stats.length > 0 && (
        <section className="border-y-2 border-saffron-500/70 bg-white">
          <div className="container-page grid grid-cols-2 divide-y divide-saffron-100 py-2 md:grid-cols-4 md:divide-x md:divide-y-0">
            {stats.map((s, i) => {
              const n = Number(s.value);
              return (
                <div key={s.id ?? i} className="flex flex-col items-center gap-1 px-4 py-6 text-center">
                  {s.animate && Number.isFinite(n) ? (
                    <StatCounter
                      value={n}
                      suffix={s.suffix ?? ""}
                      className="text-3xl font-bold text-saffron-700 md:text-4xl"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-saffron-700 md:text-4xl">
                      {s.value}
                      {s.suffix ?? ""}
                    </span>
                  )}
                  <span lang={langOf(s.label)} className="text-sm font-medium text-ink-soft">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Impact philosophy banner */}
      <ImpactBanner impact={content.impact} />

      {/* Featured story with video (Home Page → Featured story) */}
      {/* CMS content when the CMS has the fields; bundled default until then. */}
      <FeaturedStory story={home && "featuredStory" in home ? home.featuredStory : DEFAULT_FEATURED_STORY} />

      {/* Separators between sections that share the cream background. */}
      <SectionDivider />

      {/* Four pillars */}
      {pillars.length > 0 && (
        <section className="container-page py-14">
          <div className="mb-8 flex justify-center">
            <SectionHeading
              eyebrow={home?.pillarsHeading?.eyebrow}
              title={home?.pillarsHeading?.title?.trim() || content.pillarsHeading.title}
              align="center"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <PillarCard
                key={p.id}
                pillar={p}
                names={pillarNames(p)}
                summary={byPillar(content.pillarLines, p.slug)}
                ctaLabel={ui?.pillarCardCta}
              />
            ))}
          </div>
        </section>
      )}

      {/* Our Objective + Vision (static, from the live site) */}
      <MissionVision objective={content.objective} vision={content.vision} />

      <SectionDivider />

      {/* Quotes carousel (auto-advancing, from the live site) */}
      <QuoteCarousel quotes={content.quotes} labels={content.quotesLabels} />

      <SectionDivider className="pt-2" />

      {/* Events teaser: heading, the latest events, then a link to all events */}
      {teaser && (teaser.title || teaser.text || latestEvents.length > 0 || (teaser.cta?.label && teaser.cta.href)) && (
        <section className="bg-cream">
          <div className="container-page py-12">
            {(teaser.title || teaser.text) && (
              <div>
                {teaser.title && (
                  <h2 lang={langOf(teaser.title)} className="text-2xl font-bold text-ink">
                    {teaser.title}
                  </h2>
                )}
                {teaser.text && (
                  <p lang={langOf(teaser.text)} className="mt-1 text-ink-soft">
                    {teaser.text}
                  </p>
                )}
              </div>
            )}
            {latestEvents.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {latestEvents.map((e) => (
                  <EventCard key={e.id} event={e} readMore={eventsPage?.readMoreLabel} />
                ))}
              </div>
            )}
            {teaser.cta?.label && teaser.cta.href && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={teaser.cta.href}
                  lang={langOf(teaser.cta.label)}
                  className="group inline-flex items-center gap-2 rounded-lg bg-sewablue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sewablue-700"
                >
                  {teaser.cta.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Donate: ways to help + bank details (static, from the live site) */}
      <DonateSection donate={content.donate} />
    </>
  );
}
