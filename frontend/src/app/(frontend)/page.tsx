import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DonateSection from "@/components/DonateSection";
import EventCard from "@/components/EventCard";
import FeaturedStory from "@/components/FeaturedStory";
import ImpactBanner from "@/components/ImpactBanner";
import SectionDivider from "@/components/SectionDivider";
import MissionVision from "@/components/MissionVision";
import QuoteCarousel from "@/components/QuoteCarousel";
import { DEFAULT_FEATURED_STORY } from "@/content/featured-story-default";
import { HOME_EVENTS_TEASER_OVERRIDES, overrideSeedText } from "@/content/pages/home";
import { resolveHome } from "@/content/resolve";
import { PILLAR_NAMES, byPillar } from "@/content/pillars";
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
  const logo = siteLogo(settings);
  const heroImage = mediaUrl(hero?.image) ?? logo.url; // original size; next/image resizes
  const heroAlt = hero?.image ? mediaAlt(hero.image, logo.alt) : logo.alt;
  const heroMedia = hero?.image && typeof hero.image === "object" ? hero.image : null;
  const primary = hero?.primaryCta;
  const secondary = hero?.secondaryCta;
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
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
        <div className="container-wide grid items-center gap-10 py-12 md:grid-cols-[1fr_1.3fr] md:gap-8 md:py-16 lg:py-20">
          <div>
            {hero?.badge && (
              <span
                lang={langOf(hero.badge)}
                className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-white/70 px-3 py-1 text-xs font-semibold text-saffron-700 shadow-sm"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 1 3 5v6c0 5.25 3.75 10.16 9 11 5.25-.84 9-5.75 9-11V5l-9-4Zm-1.2 14.4L7 11.6l1.4-1.4 2.4 2.4 5-5L17.2 9l-6.4 6.4Z" />
                </svg>
                {hero.badge}
              </span>
            )}
            {hero?.tagline && (
              <p
                lang={langOf(hero.tagline)}
                className="mt-4 max-w-xl text-lg font-semibold leading-snug text-saffron-700 md:text-xl"
              >
                {hero.tagline}
              </p>
            )}
            {/* Title and intro from the client content document (src/content/pages/home.ts, overridable by the Home Content global). */}
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-[2.75rem] xl:text-[3.25rem]">
              {content.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
              {content.hero.intro}
            </p>
            {((primary?.label && primary.href) || (secondary?.label && secondary.href)) && (
              <div className="mt-8 flex flex-wrap gap-4">
                {primary?.label && primary.href && (
                  <Link
                    href={primary.href}
                    lang={langOf(primary.label)}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-saffron-400 to-saffron-500 px-7 py-3.5 text-base font-semibold text-ink shadow-lg shadow-saffron-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-saffron-500/35 active:translate-y-0"
                  >
                    {primary.label}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                )}
                {secondary?.label && secondary.href && (
                  <Link
                    href={secondary.href}
                    lang={langOf(secondary.label)}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-sewablue-500 bg-white px-7 py-3.5 text-base font-semibold text-sewablue-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-sewablue-500 hover:text-white hover:shadow-lg hover:shadow-sewablue-500/25 active:translate-y-0"
                  >
                    {secondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>
          {/* A CMS banner fills the column and, on wide screens, runs to the right
              edge of the window (its edges are already feathered); the logo
              fallback stays modest. */}
          <div
            className={`flex justify-center md:justify-end ${
              heroMedia ? "md:-mr-5 xl:-mr-[calc((100vw-80rem)/2+1.25rem)]" : ""
            }`}
          >
            <Image
              src={heroImage}
              alt={heroAlt}
              width={heroMedia?.width ?? 320}
              height={heroMedia?.height ?? 356}
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className={heroMedia ? "h-auto w-full" : "h-auto w-56 drop-shadow-sm md:w-72"}
            />
          </div>
        </div>
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
              title={content.pillarsHeading.title}
              align="center"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <PillarCard
                key={p.id}
                pillar={p}
                names={byPillar(PILLAR_NAMES, p.slug)}
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
