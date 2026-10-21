import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getContent } from "@/lib/cms";
import { resolveVolunteer } from "@/content/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const { header } = resolveVolunteer(await getContent("volunteer-content"));
  return { title: header.eyebrow, description: header.subtitle };
}

export default async function VolunteerPage() {
  const { header: VOLUNTEER_HEADER, capacity: cap, cta: VOLUNTEER_CTA } = resolveVolunteer(
    await getContent("volunteer-content"),
  );

  return (
    <>
      <PageHeader
        eyebrow={VOLUNTEER_HEADER.eyebrow}
        title={VOLUNTEER_HEADER.title}
        subtitle={VOLUNTEER_HEADER.subtitle}
      />

      {/* Capacity building */}
      <section className="container-page py-12 md:py-14">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">{cap.heading}</h2>
          <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
          <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">{cap.text}</p>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-gradient-to-br from-sewablue-700 to-sewablue-800">
        <div className="container-page flex justify-center py-10 md:py-12">
          <Link
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
