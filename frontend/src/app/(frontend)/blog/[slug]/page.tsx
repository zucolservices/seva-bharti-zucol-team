import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHeading from "@/components/SectionHeading";
import GuestCarousel from "@/components/GuestCarousel";
import EventPhotos from "@/components/EventPhotos";
import RichText from "@/components/RichText";
import { formatDate, getEventBySlug, getEvents, getGlobal } from "@/lib/cms";
import { toGuestViews, toPhotoViews, a11yLabels } from "@/lib/site-data";
import { langOf } from "@/lib/view-types";

// Under Cache Components generateStaticParams must return at least one param
// (an empty list is a build error). When the DB has no published events at
// build time we return a placeholder that can never match a real slug (slugs
// are validated to [a-z0-9-]) — it renders notFound(). Unlisted slugs are
// rendered on first request and cached (ISR with Cache Components).
const PLACEHOLDER_SLUG = "__placeholder__";

// Unknown slugs must answer with a real HTTP 404 (not a 200 "soft 404"), so
// the event is looked up before anything streams. Reading `params` outside
// <Suspense> needs this opt-out from instant-navigation validation.
export const instant = false;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const events = await getEvents();
  return events.length > 0 ? events.map((e) => ({ slug: e.slug })) : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.seo?.metaTitle || event.titleEn || event.titleHi,
    description: event.seo?.metaDescription || event.summaryHi,
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [event, ui] = await Promise.all([getEventBySlug(slug), getGlobal("ui-strings")]);
  if (!event) notFound();

  const labels = ui?.eventPage;
  // English first; Hindi only when the English field is empty.
  const title = event.titleEn || event.titleHi;
  const fallbackAlt = title;
  const gallery = toPhotoViews(event.photos, "hero", fallbackAlt);
  const photos = gallery.length > 0 ? gallery : toPhotoViews([event.coverImage], "hero", fallbackAlt);
  const guests = toGuestViews(event.guests);
  const date = formatDate(event.date);

  return (
    <article>
      {/* Header band */}
      <section className="border-b border-saffron-100 bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
        <div className="container-page py-10 md:py-12">
          {labels?.backLabel && (
            <Link
              href="/events"
              lang={langOf(labels.backLabel)}
              className="inline-flex items-center gap-1 text-sm font-medium text-sewablue-600 hover:underline"
            >
              <span aria-hidden>←</span> {labels.backLabel}
            </Link>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
            {date && (
              <span lang="en" className="rounded-full bg-sewablue-600 px-3 py-1 text-white">
                {date}
              </span>
            )}
            {event.location && (
              <span lang={langOf(event.location)} className="inline-flex items-center gap-1 rounded-full bg-saffron-100 px-3 py-1 text-saffron-800">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                {event.location}
              </span>
            )}
          </div>
          <h1 lang={langOf(title)} className="mt-3 text-3xl font-bold leading-snug text-ink md:text-4xl">
            {title}
          </h1>
        </div>
      </section>

      <div className="container-page max-w-4xl py-12">
        {/* 3. Photos */}
        {photos.length > 0 && <EventPhotos photos={photos} a11y={a11yLabels(ui)} />}

        {/* 4. Description */}
        <section className="mt-10">
          {labels?.descriptionHeading && (
            <>
              <h2 lang={langOf(labels.descriptionHeading)} className="text-xl font-bold text-ink">
                {labels.descriptionHeading}
              </h2>
              <span className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
            </>
          )}
          {event.content ? (
            <RichText data={event.content} className="mt-5" />
          ) : (
            <div className="mt-5 space-y-4">
              <p lang={langOf(event.summaryHi)} className="text-base leading-relaxed text-ink-soft">
                {event.summaryHi}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Guests at this event */}
      {guests.length > 0 && (
        <section className="border-t border-saffron-100 bg-cream">
          <div className="container-page py-12">
            <SectionHeading eyebrow={labels?.guestsHeading?.eyebrow} title={labels?.guestsHeading?.title} />
            {labels?.guestsNote && (
              <p lang={langOf(labels.guestsNote)} className="mt-2 text-xs italic text-ink-soft">
                {labels.guestsNote}
              </p>
            )}
            <div className="mt-6">
              <GuestCarousel guests={guests} variant="split" a11y={a11yLabels(ui)} />
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
