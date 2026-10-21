import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { VOLUNTEER_CAPACITY, VOLUNTEER_CTA, VOLUNTEER_HEADER } from "@/content/pages/volunteer";

export const metadata: Metadata = {
  title: VOLUNTEER_HEADER.eyebrow,
  description: VOLUNTEER_HEADER.subtitle,
};

export default function VolunteerPage() {
  const cap = VOLUNTEER_CAPACITY;

  return (
    <>
      <PageHeader
        eyebrow={VOLUNTEER_HEADER.eyebrow}
        title={VOLUNTEER_HEADER.title}
        subtitle={VOLUNTEER_HEADER.subtitle}
      />

      {/* Capacity building */}
      <section className="container-page py-12 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-12">
          <div lang="hi">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-ink md:text-3xl">{cap.heading}</h2>
              <span className="rounded-full bg-saffron-100 px-3 py-1 text-sm font-semibold text-saffron-700">
                {cap.badge}
              </span>
            </div>
            <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
            <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">{cap.text}</p>
          </div>

          <ul lang="hi" className="space-y-3">
            {cap.highlights.map((h, i) => (
              <li
                key={h}
                className="flex items-center gap-4 rounded-xl border border-saffron-100 bg-white p-4 shadow-sm"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-saffron-100 text-sm font-bold text-saffron-700">
                  {i + 1}
                </span>
                <span className="font-semibold text-ink">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-gradient-to-br from-sewablue-700 to-sewablue-800">
        <div className="container-page flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <p lang="hi" className="text-xl font-bold leading-snug text-white md:text-2xl">
            {VOLUNTEER_CTA.text}
          </p>
          <Link
            lang="hi"
            href={VOLUNTEER_CTA.href}
            className="shrink-0 rounded-xl bg-saffron-500 px-6 py-3 font-semibold text-ink shadow-lg shadow-black/15 transition-colors hover:bg-saffron-400"
          >
            {VOLUNTEER_CTA.label}
          </Link>
        </div>
      </section>
    </>
  );
}
