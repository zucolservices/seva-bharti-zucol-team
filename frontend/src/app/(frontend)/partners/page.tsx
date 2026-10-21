// "Our Sewa Partners": note to partners, logo grid and a
// CSR call to action. Copy lives in src/content/pages/partners.ts.
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getContent } from "@/lib/cms";
import type { Partner } from "@/content/pages/partners";
import { resolvePartners } from "@/content/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = resolvePartners(await getContent("partners-content"));
  return { title: meta.title, description: meta.description };
}

/**
 * One partner tile: the logo shown large, with the organisation's name below
 * (the name doubles as a caption for logos that are emblems without text).
 */
function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <li className="flex w-[calc(50%-0.5rem)] flex-col items-center gap-4 rounded-2xl bg-white px-4 py-6 text-center md:w-[calc(25%-0.9375rem)] ring-1 ring-saffron-100 transition-shadow hover:shadow-md">
      <div className="flex h-24 w-full items-center justify-center md:h-28">
        {partner.logo ? (
          // Plain <img>: next/image refuses local SVGs without dangerouslyAllowSVG.
          <img
            src={partner.logo}
            alt={partner.name}
            width={240}
            height={128}
            loading="lazy"
            decoding="async"
            className={`w-auto max-w-full object-contain ${partner.emblem ? "h-24 md:h-28" : "h-14 md:h-16"}`}
          />
        ) : (
          <span className="text-2xl font-bold tracking-tight text-ink/80">{partner.name}</span>
        )}
      </div>
      <p className="text-balance text-sm font-semibold leading-snug text-ink-soft">{partner.name}</p>
    </li>
  );
}

export default async function PartnersPage() {
  const {
    header: PARTNERS_HEADER,
    note: PARTNERS_NOTE,
    gridLabel: PARTNERS_GRID_LABEL,
    partners: PARTNERS,
    cta: PARTNERS_CTA,
  } = resolvePartners(await getContent("partners-content"));
  return (
    <>
      <PageHeader eyebrow={PARTNERS_HEADER.eyebrow} title={PARTNERS_HEADER.title} />

      {/* A Note to Our Partners */}
      <section className="container-page pt-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">{PARTNERS_NOTE.heading}</h2>
          <span aria-hidden className="mt-4 block h-1 w-16 rounded-full bg-saffron-500" />
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink-soft md:text-lg">
            {PARTNERS_NOTE.paragraphs.map((p, i) => (
              <p key={i} className={i === PARTNERS_NOTE.paragraphs.length - 1 ? "font-semibold text-ink" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Partner logos: a responsive grid, each logo shown large. */}
      <section aria-label={PARTNERS_GRID_LABEL} className="container-wide py-12">
        {/* Four per row on desktop (two on phones); an incomplete last row is centred. */}
        <ul className="flex flex-wrap justify-center gap-4 md:gap-5">
          {PARTNERS.map((p) => (
            <PartnerTile key={p.name} partner={p} />
          ))}
        </ul>
      </section>

      {/* Call to action */}
      <section className="container-page pb-14 pt-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-saffron-400 via-saffron-500 to-saffron-600 px-6 py-10 text-ink shadow-lg shadow-saffron-500/20 md:px-12 md:py-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/5" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold leading-snug md:text-3xl">{PARTNERS_CTA.heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink/85 md:text-lg">{PARTNERS_CTA.text}</p>
            </div>
            <Link
              href={PARTNERS_CTA.href}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3.5 font-semibold text-ink shadow-sm transition-colors hover:bg-cream md:self-auto"
            >
              {PARTNERS_CTA.button}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
