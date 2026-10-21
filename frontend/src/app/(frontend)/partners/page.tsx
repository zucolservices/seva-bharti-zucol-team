// "हमारे सेवा सहयोगी" (Our Sewa Partners): note to partners, logo grid and a
// CSR call to action. Copy lives in src/content/pages/partners.ts.
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
  PARTNERS,
  PARTNERS_CTA,
  PARTNERS_HEADER,
  PARTNERS_META,
  PARTNERS_MORE,
  PARTNERS_NOTE,
  type Partner,
} from "@/content/pages/partners";

export const metadata: Metadata = {
  title: PARTNERS_META.title,
  description: PARTNERS_META.description,
};

const STOP_WORDS = new Set(["of", "the", "and", "pvt.", "ltd.", "limited"]);

/** Two-letter initials from the English name, e.g. "Taparia Group" -> "TG". */
function initials(nameEn: string) {
  return nameEn
    .replace(/\(.*?\)/g, "")
    .split(/[\s,]+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const cardClass =
  "flex h-full flex-col items-center rounded-xl border border-saffron-100 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md";

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <li className={`group ${cardClass}`}>
      <div className="flex h-20 w-full items-center justify-center">
        {partner.logo ? (
          // Plain <img>: next/image refuses local SVGs without dangerouslyAllowSVG.
          <img
            src={partner.logo}
            alt={partner.nameEn}
            width={160}
            height={80}
            loading="lazy"
            decoding="async"
            className="h-20 w-full object-contain grayscale transition duration-300 group-hover:grayscale-0"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-lg font-bold tracking-wide text-white shadow-sm"
          >
            {initials(partner.nameEn)}
          </span>
        )}
      </div>
      <p lang="hi" className="mt-3 text-sm font-semibold leading-snug text-ink">
        {partner.name}
      </p>
      <p className="mt-0.5 text-xs leading-snug text-ink-soft">{partner.nameEn}</p>
    </li>
  );
}

export default function PartnersPage() {
  return (
    <>
      <PageHeader eyebrow={PARTNERS_HEADER.eyebrow} title={PARTNERS_HEADER.title} />

      {/* A Note to Our Partners */}
      <section className="container-page pt-12">
        <div lang="hi" className="mx-auto max-w-3xl">
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

      {/* Logo grid */}
      <section className="container-page py-10" aria-label="सहयोगी संस्थाएँ">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PARTNERS.map((p) => (
            <PartnerCard key={p.nameEn} partner={p} />
          ))}
          <li
            lang="hi"
            className="flex h-full min-h-40 items-center justify-center rounded-xl border-2 border-dashed border-saffron-200 bg-saffron-50/60 p-4 text-center text-sm font-semibold leading-snug text-saffron-700"
          >
            {PARTNERS_MORE}
          </li>
        </ul>
      </section>

      {/* Call to action */}
      <section className="container-page pb-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-saffron-500 via-saffron-600 to-saffron-700 px-6 py-10 text-white shadow-lg shadow-saffron-500/25 md:px-12 md:py-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/5" />
          <div lang="hi" className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold leading-snug md:text-3xl">{PARTNERS_CTA.heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-white/90 md:text-lg">{PARTNERS_CTA.text}</p>
            </div>
            <Link
              href={PARTNERS_CTA.href}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3.5 font-semibold text-saffron-700 shadow-sm transition-colors hover:bg-cream md:self-auto"
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
