import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import { getContent } from "@/lib/cms";
import { resolveCsr } from "@/content/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const { header } = resolveCsr(await getContent("csr-content"));
  return { title: header.eyebrow, description: header.subtitle };
}

export default async function CsrPage() {
  const {
    header: CSR_HEADER,
    initiativesHeading: CSR_INITIATIVES_HEADING,
    initiatives: CSR_INITIATIVES,
    pathLab: lab,
    cta: CSR_CTA,
  } = resolveCsr(await getContent("csr-content"));
  const labRows = [
    { label: lab.addressLabel, value: <address className="not-italic">{lab.address}</address> },
    {
      label: lab.emailLabel,
      value: (
        <a href={`mailto:${lab.email}`} className="break-all text-sewablue-700 hover:underline">
          {lab.email}
        </a>
      ),
    },
    { label: lab.timingLabel, value: lab.timing },
  ];

  return (
    <>
      <PageHeader eyebrow={CSR_HEADER.eyebrow} title={CSR_HEADER.title} subtitle={CSR_HEADER.subtitle} />

      {/* Current initiatives */}
      <section className="container-page py-12 md:py-14">
        <SectionHeading title={CSR_INITIATIVES_HEADING} />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {CSR_INITIATIVES.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="scroll-mt-32 overflow-hidden rounded-xl border border-saffron-100 bg-white shadow-sm transition-all hover:border-saffron-300 hover:shadow-md"
            >
              <div className="h-1.5 w-full bg-saffron-500" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-saffron-700">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Sewa Pathology Lab */}
      <section id="pathology-labs" className="container-page scroll-mt-32 pb-12 md:pb-14">
        <div className="grid gap-6 rounded-2xl border border-sewablue-100 bg-sewablue-50 p-6 md:grid-cols-[2fr_3fr] md:items-center md:p-8">
          <div>
            <h2 className="text-2xl font-bold text-ink md:text-3xl">{lab.title}</h2>
            <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
            <p className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">{lab.intro}</p>
          </div>
          <dl className="divide-y divide-sewablue-100 rounded-xl border border-sewablue-100 bg-white">
            {labRows.map((row) => (
              <div key={row.label} className="grid items-baseline gap-1 px-4 py-3.5 sm:grid-cols-[6rem_1fr] sm:gap-3">
                <dt className="text-sm text-ink-soft">{row.label}</dt>
                <dd className="min-w-0 font-semibold text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-gradient-to-br from-sewablue-700 to-sewablue-800">
        <div className="container-page flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-center md:py-12">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={CSR_CTA.primary.href}
              className="rounded-xl bg-saffron-500 px-6 py-3 font-semibold text-ink shadow-lg shadow-black/15 transition-colors hover:bg-saffron-400"
            >
              {CSR_CTA.primary.label}
            </Link>
            <Link
              href={CSR_CTA.secondary.href}
              className="inline-flex items-center gap-1 font-semibold text-white underline-offset-4 hover:underline"
            >
              {CSR_CTA.secondary.label}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
