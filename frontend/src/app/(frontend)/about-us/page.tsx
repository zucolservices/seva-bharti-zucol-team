import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import RichText from "@/components/RichText";
import { getGlobal, getPillars } from "@/lib/cms";
import { PILLAR_NAMES, byPillar } from "@/content/pillars";
import {
  ABOUT_HEADER,
  ABOUT_MESSAGE,
  ABOUT_MISSION,
  ABOUT_STRUCTURE,
  ABOUT_VISION,
} from "@/content/pages/about";

// Anchored blocks linked from the header menu (हमारे बारे में ▾).
function AboutBlock({ id, heading, paragraphs }: { id: string; heading: string; paragraphs: string[] }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 lang="hi" className="text-xl font-bold text-ink">{heading}</h2>
      <span aria-hidden className="mt-2 block h-1 w-12 rounded-full bg-saffron-500" />
      <div lang="hi" className="mt-4 space-y-3 leading-relaxed text-ink-soft">
        {paragraphs.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const [about, settings] = await Promise.all([getGlobal("about-page"), getGlobal("site-settings")]);
  return {
    title: about?.seo?.metaTitle || about?.header?.eyebrow || about?.header?.title || undefined,
    description:
      about?.seo?.metaDescription || settings?.introEn || about?.header?.subtitle || undefined,
  };
}

export default async function AboutPage() {
  const [about, pillars] = await Promise.all([getGlobal("about-page"), getPillars()]);
  // CMS sections, minus vision / mission ones — those are shown from the
  // content file below (src/content/pages/about.ts).
  const duplicate = /vision|mission|उद्देश्य|दृष्टि/i;
  const sections = (about?.sections ?? []).filter((s) => !duplicate.test(s.heading));
  const details = about?.details ?? [];

  return (
    <>
      <PageHeader
        title={ABOUT_HEADER.title}
        eyebrow={ABOUT_HEADER.eyebrow}
        subtitle={about?.header?.subtitle}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={s.id ?? i}>
              <h2 lang="hi" className="text-xl font-bold text-ink">{s.heading}</h2>
              <RichText data={s.body} className="mt-3" />
            </section>
          ))}

          <AboutBlock id="vision" heading={ABOUT_VISION.heading} paragraphs={ABOUT_VISION.paragraphs} />

          <section id="message" className="scroll-mt-28">
            <h2 lang="hi" className="text-xl font-bold text-ink">{ABOUT_MESSAGE.heading}</h2>
            <span aria-hidden className="mt-2 block h-1 w-12 rounded-full bg-saffron-500" />
            <figure className="relative mt-5 rounded-2xl border border-saffron-100 bg-saffron-50/60 p-6 md:p-8">
              <span aria-hidden className="absolute left-4 top-1 font-serif text-6xl leading-none text-saffron-300">
                &ldquo;
              </span>
              <blockquote lang="hi" className="relative space-y-3 pl-6 italic leading-relaxed text-ink">
                {ABOUT_MESSAGE.quote.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </blockquote>
              <figcaption lang="hi" className="mt-5 pl-6 text-sm font-semibold text-saffron-700">
                — {ABOUT_MESSAGE.byline}
              </figcaption>
            </figure>
          </section>

          <AboutBlock id="mission" heading={ABOUT_MISSION.heading} paragraphs={ABOUT_MISSION.paragraphs} />
          <AboutBlock id="structure" heading={ABOUT_STRUCTURE.heading} paragraphs={ABOUT_STRUCTURE.paragraphs} />

          {pillars.length > 0 && (
            <section>
              {about?.pillarsHeading && (
                <h2 lang="hi" className="text-xl font-bold text-ink">
                  {about.pillarsHeading}
                </h2>
              )}
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {pillars.map((p) => {
                  const names = byPillar(PILLAR_NAMES, p.slug);
                  return (
                  <li
                    key={p.id}
                    className="rounded-lg border border-saffron-100 bg-white px-4 py-3"
                  >
                    <Link href={`/${p.slug}`} className="hover:underline">
                      <span lang="hi" className="font-semibold text-saffron-700">
                        {names?.hi ?? p.nameHi}
                      </span>{" "}
                      <span className="text-sm text-ink-soft">({names?.en ?? p.nameEn})</span>
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        {details.length > 0 && (
          <aside className="h-fit space-y-4 rounded-xl border border-sewablue-100 bg-sewablue-50 p-6">
            {about?.detailsHeading && (
              <h2 lang="hi" className="text-lg font-bold text-sewablue-800">
                {about.detailsHeading}
              </h2>
            )}
            <dl className="space-y-3 text-sm">
              {details.map((d, i) => (
                <div key={d.id ?? i}>
                  <dt lang="hi" className="font-semibold text-ink">{d.label}</dt>
                  <dd className="text-ink-soft">{d.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>
    </>
  );
}
