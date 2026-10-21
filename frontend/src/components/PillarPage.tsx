import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import StatCounter from "@/components/StatCounter";
import RichText from "@/components/RichText";
import { mediaAlt, mediaUrl } from "@/lib/cms";
import type { Pillar, UiString } from "@/payload-types";
import { WORK_PILLARS } from "@/content/pages/work";
import { byPillar } from "@/content/pillars";

// Accent-aware class sets so each pillar can lean saffron or blue.
const accentMap = {
  saffron: {
    border: "border-saffron-100",
    badge: "bg-saffron-100 text-saffron-700",
    heading: "text-saffron-700",
    strip: "border-saffron-500/80",
    statValue: "text-saffron-600",
    cardHover: "hover:border-saffron-300 hover:shadow-md",
    topbar: "bg-saffron-500",
    leftbar: "border-l-saffron-400",
    ring: "ring-saffron-200",
  },
  blue: {
    border: "border-sewablue-100",
    badge: "bg-sewablue-100 text-sewablue-700",
    heading: "text-sewablue-700",
    strip: "border-sewablue-500/80",
    statValue: "text-sewablue-600",
    cardHover: "hover:border-sewablue-300 hover:shadow-md",
    topbar: "bg-sewablue-500",
    leftbar: "border-l-sewablue-400",
    ring: "ring-sewablue-200",
  },
} as const;

// Renders a single pillar (seva karya) page in a formal, government-style layout:
//   Banner → Vivran → Counts strip → Success stories (left) + Aayaam (right).
// All content comes from the Pillars collection + UI Text labels.
export default function PillarPage({
  pillar,
  labels,
}: {
  pillar: Pillar;
  labels?: UiString["pillarPage"] | null;
}) {
  const c = accentMap[pillar.accent] ?? accentMap.saffron;
  const banner = mediaUrl(pillar.banner, "hero");
  const activities = pillar.activities ?? [];
  const stats = pillar.stats ?? [];
  const stories = pillar.successStories ?? [];
  const aayaam = pillar.aayaam ?? [];
  const intro = byPillar(WORK_PILLARS, pillar.slug);

  return (
    <>
      {/* Hero banner image with title overlay. */}
      <section className="relative h-56 w-full overflow-hidden md:h-80 lg:h-96">
        {banner && (
          <Image
            src={banner}
            alt={mediaAlt(pillar.banner, `${pillar.nameEn} banner`)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />
        <div className="container-page absolute inset-x-0 bottom-0">
          <div className="pb-8 md:pb-10">
            <p className="inline-block rounded bg-saffron-500 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">
              {labels?.bannerPrefix ? `${labels.bannerPrefix} · ${pillar.nameEn}` : pillar.nameEn}
            </p>
            <h1
              lang="hi"
              className="mt-3 text-3xl font-bold leading-snug tracking-tight text-white drop-shadow md:text-4xl lg:text-5xl"
            >
              {pillar.nameHi}
            </h1>
            <p
              lang="hi"
              className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base"
            >
              {pillar.summaryHi}
            </p>
          </div>
        </div>
        {/* Formal accent strip under the banner. */}
        <div className={`absolute inset-x-0 bottom-0 h-1 ${c.topbar}`} />
      </section>

      {/* 0. Intro from the client content document (src/content/pages/work.ts). */}
      {intro && (
        <section className="container-page pt-12 md:pt-14">
          <div className={`rounded-2xl border bg-white p-6 shadow-sm md:p-8 ${c.border}`}>
            <p lang="hi" className={`text-xl font-bold italic md:text-2xl ${c.heading}`}>
              {intro.tagline}
            </p>
            <p lang="hi" className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
              {intro.text}
            </p>
          </div>
        </section>
      )}

      {/* 1. Vivran — long-form content + highlighted real programmes. */}
      <section className="container-page py-12 md:py-14">
        <SectionHeading eyebrow={labels?.overview?.eyebrow} title={labels?.overview?.title} />
        <RichText data={pillar.content} className="mt-5 max-w-3xl" />

        {activities.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((a, i) => (
              <article
                key={a.id ?? i}
                className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${c.border} ${c.cardHover}`}
              >
                {/* Accent top bar — formal, consistent card header. */}
                <div className={`h-1.5 w-full ${c.topbar}`} />
                <div className="p-6">
                  <h3 lang="hi" className={`text-lg font-semibold ${c.heading}`}>
                    {a.titleHi}
                  </h3>
                  <p
                    lang="hi"
                    className="mt-3 text-sm leading-relaxed text-ink-soft"
                  >
                    {a.descHi}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 2. Counts — full-width horizontal strip (reference style). */}
      {stats.length > 0 && (
        <section className={`border-y-2 bg-white ${c.strip}`}>
          <div className="container-page grid grid-cols-2 divide-saffron-100 py-2 md:grid-cols-4 md:divide-x">
            {stats.map((stat, i) => (
              <div
                key={stat.id ?? i}
                className="flex flex-col items-center justify-center border-b border-saffron-100 px-4 py-8 text-center last:border-b-0 md:border-b-0"
              >
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix ?? ""}
                  className={`text-4xl font-extrabold md:text-5xl ${c.statValue}`}
                />
                <span lang="hi" className="mt-2 text-sm text-ink-soft md:text-base">
                  {stat.labelHi}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Success stories (left) + Aayaam grid (right, compact). */}
      <section className="container-page py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* Success stories */}
          <div>
            <SectionHeading eyebrow={labels?.successStories?.eyebrow} title={labels?.successStories?.title} />
            <div className="mt-6 space-y-6">
              {stories.map((s, i) => {
                const photo = mediaUrl(s.photo, "thumbnail");
                return (
                  <article
                    key={s.id ?? i}
                    className={`flex flex-col gap-4 rounded-xl border-l-4 border bg-white p-5 shadow-sm transition-all sm:flex-row ${c.border} ${c.leftbar} ${c.cardHover}`}
                  >
                    {photo && (
                      <div
                        className={`relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-saffron-50 ring-2 ${c.ring}`}
                      >
                        <Image
                          src={photo}
                          alt={mediaAlt(s.photo, s.nameEn || s.nameHi)}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 lang="hi" className="text-lg font-semibold text-ink">
                        {s.nameHi}
                        {s.age != null && (
                          <span className="ml-2 text-sm font-normal text-ink-soft">
                            ({labels?.ageSuffix ? `${s.age} ${labels.ageSuffix}` : s.age})
                          </span>
                        )}
                      </h3>
                      {s.bioHi && (
                        <p
                          lang="hi"
                          className={`mt-1 text-sm font-medium ${c.heading}`}
                        >
                          {s.bioHi}
                        </p>
                      )}
                      <p
                        lang="hi"
                        className="mt-2 text-sm leading-relaxed text-ink-soft"
                      >
                        {s.storyHi}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Vertical separator + Aayaam grid (compact cards). */}
          <div className="lg:border-l lg:border-saffron-100 lg:pl-12">
            <SectionHeading eyebrow={labels?.aayaam?.eyebrow} title={labels?.aayaam?.title} />
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
              {aayaam.map((a, i) => (
                <article
                  key={a.id ?? i}
                  className={`flex items-start gap-2 rounded-lg border bg-white p-2.5 shadow-sm transition-all ${c.border} ${c.cardHover}`}
                >
                  <span
                    className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold ${c.badge}`}
                  >
                    {i + 1}
                  </span>
                  <h3
                    lang="hi"
                    className="text-xs font-semibold leading-snug text-ink"
                  >
                    {a.titleHi}
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
