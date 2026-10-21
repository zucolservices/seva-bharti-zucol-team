import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getPillars, mediaAlt, mediaUrl } from "@/lib/cms";
import { WORK_CTA_LABEL, WORK_HEADER, WORK_PILLARS } from "@/content/pages/work";
import { PILLAR_NAMES, byPillar } from "@/content/pillars";

export const metadata: Metadata = { title: WORK_HEADER.eyebrow };

// "Our Work" overview: every pillar from the CMS with the content-document
// tagline and description (src/content/pages/work.ts).
export default async function OurWorkPage() {
  const pillars = await getPillars();

  return (
    <>
      <PageHeader eyebrow={WORK_HEADER.eyebrow} title={WORK_HEADER.title} />

      <div className="container-page space-y-8 py-12">
        {pillars.map((p, i) => {
          const copy = byPillar(WORK_PILLARS, p.slug);
          const names = byPillar(PILLAR_NAMES, p.slug);
          const banner = mediaUrl(p.banner, "card");
          const isBlue = p.accent === "blue";
          return (
            <article
              key={p.id}
              className={`grid overflow-hidden rounded-2xl border bg-white shadow-sm md:grid-cols-[2fr_3fr] ${
                isBlue ? "border-sewablue-100" : "border-saffron-100"
              }`}
            >
              <div className={`relative min-h-52 bg-saffron-50 ${i % 2 ? "md:order-2" : ""}`}>
                {banner && (
                  <Image
                    src={banner}
                    alt={mediaAlt(p.banner, p.nameEn)}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                    isBlue ? "bg-sewablue-50 text-sewablue-700" : "bg-saffron-50 text-saffron-700"
                  }`}
                >
                  {names?.en ?? p.nameEn}
                </span>
                <h2 lang="hi" className="mt-3 text-2xl font-bold text-ink md:text-3xl">
                  {names?.hi ?? p.nameHi}
                </h2>
                {copy && (
                  <>
                    <p lang="hi" className="mt-2 text-lg font-semibold italic text-saffron-700">
                      {copy.tagline}
                    </p>
                    <p lang="hi" className="mt-4 leading-relaxed text-ink-soft">
                      {copy.text}
                    </p>
                  </>
                )}
                <Link
                  href={`/${p.slug}`}
                  lang="hi"
                  className="group mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-sewablue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sewablue-600"
                >
                  {WORK_CTA_LABEL}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
