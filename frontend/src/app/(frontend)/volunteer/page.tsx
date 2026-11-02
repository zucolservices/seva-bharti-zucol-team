import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import VolunteerList from "@/components/VolunteerList";
import { getContent } from "@/lib/cms";
import { VOLUNTEER_APPLY_URL } from "@/lib/volunteers";
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
        action={
          <a
            href={VOLUNTEER_APPLY_URL}
            className="inline-block rounded-xl bg-saffron-500 px-6 py-3 font-semibold text-ink shadow-lg shadow-saffron-500/25 transition-colors hover:bg-saffron-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600"
          >
            {VOLUNTEER_CTA.label}
          </a>
        }
      />

      {/* Capacity building */}
      <section className="container-page py-12 md:py-14">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">{cap.heading}</h2>
          <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
          <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">{cap.text}</p>
        </div>
      </section>

      {/* Approved volunteers from the dashboard (hidden when there are none) */}
      <Suspense fallback={null}>
        <VolunteerList />
      </Suspense>
    </>
  );
}
