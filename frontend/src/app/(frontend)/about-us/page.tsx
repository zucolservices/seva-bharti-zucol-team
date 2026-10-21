import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import RichText from "@/components/RichText";
import { getContent, getGlobal, getPillars } from "@/lib/cms";
import { pillarNames } from "@/content/pillars";
import { langOf } from "@/lib/view-types";
import type { AboutPage as AboutPageData } from "@/payload-types";
import { resolveAbout } from "@/content/resolve";

// Anchored blocks linked from the header menu (About Us ▾).
function AboutBlock({ id, heading, paragraphs }: { id: string; heading: string; paragraphs: string[] }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-bold text-ink">{heading}</h2>
      <span aria-hidden className="mt-2 block h-1 w-12 rounded-full bg-saffron-500" />
      <div className="mt-4 space-y-3 leading-relaxed text-ink-soft">
        {paragraphs.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
    </section>
  );
}

type CmsSection = NonNullable<AboutPageData["sections"]>[number];

/** Text of the rich-text body's first node when it is a heading (to avoid printing it twice). */
function leadingHeading(body: CmsSection["body"]): string | null {
  const first = (body as { root?: { children?: { type?: string; children?: { text?: string }[] }[] } })?.root
    ?.children?.[0];
  if (first?.type !== "heading") return null;
  return (first.children ?? []).map((c) => c.text ?? "").join("").trim();
}

function CmsBlock({ section, id }: { section: CmsSection; id?: string }) {
  const repeated = leadingHeading(section.body)?.toLowerCase() === section.heading.trim().toLowerCase();
  return (
    <section id={id} className="scroll-mt-28">
      {!repeated && (
        <h2 lang={langOf(section.heading)} className="text-xl font-bold text-ink">
          {section.heading}
        </h2>
      )}
      <RichText data={section.body} className={repeated ? undefined : "mt-3"} />
    </section>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const [about, settings, aboutContent] = await Promise.all([
    getGlobal("about-page"),
    getGlobal("site-settings"),
    getContent("about-content"),
  ]);
  const { header, vision } = resolveAbout(aboutContent);
  return {
    title: about?.seo?.metaTitle || header.metaTitle,
    description: about?.seo?.metaDescription || vision.paragraphs[0] || settings?.introEn || undefined,
  };
}

export default async function AboutPage() {
  const [about, pillars, aboutContent] = await Promise.all([
    getGlobal("about-page"),
    getPillars(),
    getContent("about-content"),
  ]);
  const {
    header: ABOUT_HEADER,
    vision: ABOUT_VISION,
    message: ABOUT_MESSAGE,
    mission: ABOUT_MISSION,
    structure: ABOUT_STRUCTURE,
  } = resolveAbout(aboutContent);
  // CMS sections, minus vision / mission ones — those are shown from the
  // content file below (src/content/pages/about.ts).
  // (Hindi words match the Hindi CMS headings.)
  const duplicate = /vision|mission|उद्देश्य|दृष्टि/i;
  const sections = (about?.sections ?? []).filter((s) => !duplicate.test(s.heading));
  // Document order (About Us menu): Vision, Message, Mission, Aims, Structure.
  const aims = sections.find((s) => /aims/i.test(s.heading));
  const otherSections = sections.filter((s) => s !== aims);
  const details = about?.details ?? [];

  return (
    <>
      {/* Team's CMS header (About Page → Header) wins; content-document text is the fallback. */}
      <PageHeader
        title={about?.header?.title?.trim() || ABOUT_HEADER.title}
        eyebrow={about?.header?.eyebrow?.trim() || ABOUT_HEADER.eyebrow}
        subtitle={about?.header?.subtitle}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <AboutBlock id="vision" heading={ABOUT_VISION.heading} paragraphs={ABOUT_VISION.paragraphs} />

          <section id="message" className="scroll-mt-28">
            <h2 className="text-xl font-bold text-ink">{ABOUT_MESSAGE.heading}</h2>
            <span aria-hidden className="mt-2 block h-1 w-12 rounded-full bg-saffron-500" />
            <figure className="relative mt-5 rounded-2xl border border-saffron-100 bg-saffron-50/60 p-6 md:p-8">
              <span aria-hidden className="absolute left-4 top-1 font-serif text-6xl leading-none text-saffron-300">
                &ldquo;
              </span>
              <blockquote className="relative space-y-3 pl-6 italic leading-relaxed text-ink">
                {ABOUT_MESSAGE.quote.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </blockquote>
              {ABOUT_MESSAGE.byline && (
                <figcaption className="mt-5 pl-6 text-sm font-semibold text-saffron-700">
                  — {ABOUT_MESSAGE.byline}
                </figcaption>
              )}
            </figure>
          </section>

          <AboutBlock id="mission" heading={ABOUT_MISSION.heading} paragraphs={ABOUT_MISSION.paragraphs} />
          {/* Aims: CMS section (target of the About Us → Aims menu link). */}
          {aims && <CmsBlock section={aims} id="aims" />}
          <AboutBlock id="structure" heading={ABOUT_STRUCTURE.heading} paragraphs={ABOUT_STRUCTURE.paragraphs} />
          {otherSections.map((s, i) => (
            <CmsBlock key={s.id ?? i} section={s} />
          ))}

          {pillars.length > 0 && (
            <section>
              {about?.pillarsHeading && (
                <h2 lang={langOf(about.pillarsHeading)} className="text-xl font-bold text-ink">
                  {about.pillarsHeading}
                </h2>
              )}
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {pillars.map((p) => {
                  const names = pillarNames(p);
                  // English first; Hindi only when the English name is empty.
                  const title = names?.title ?? (p.nameEn || p.nameHi);
                  const badge = names?.badge ?? (p.nameEn && p.nameEn !== title ? p.nameEn : null);
                  return (
                  <li
                    key={p.id}
                    className="rounded-lg border border-saffron-100 bg-white px-4 py-3"
                  >
                    <Link href={`/${p.slug}`} className="hover:underline">
                      <span lang={langOf(title)} className="font-semibold text-saffron-700">
                        {title}
                      </span>
                      {badge && <span className="text-sm text-ink-soft"> ({badge})</span>}
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
              <h2 lang={langOf(about.detailsHeading)} className="text-lg font-bold text-sewablue-800">
                {about.detailsHeading}
              </h2>
            )}
            <dl className="space-y-3 text-sm">
              {details.map((d, i) => (
                <div key={d.id ?? i}>
                  <dt lang={langOf(d.label)} className="font-semibold text-ink">{d.label}</dt>
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
