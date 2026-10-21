import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import GuestCarousel from "@/components/GuestCarousel";
import { formatDate, getEvents, getGlobal, mediaAlt, mediaUrl } from "@/lib/cms";
import { toGuestViews, toPhotoViews, a11yLabels } from "@/lib/site-data";
import { langOf } from "@/lib/view-types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGlobal("events-page");
  return {
    title: page?.seo?.metaTitle || page?.header?.eyebrow || page?.header?.title || undefined,
    description: page?.seo?.metaDescription || page?.header?.subtitle || undefined,
  };
}

export default async function EventsPage() {
  const [page, events, ui] = await Promise.all([getGlobal("events-page"), getEvents(), getGlobal("ui-strings")]);
  const gallery = toPhotoViews(page?.gallery, "card", "");
  const guests = toGuestViews(page?.guests);
  const readMore = page?.readMoreLabel;

  return (
    <>
      <PageHeader
        title={page?.header?.title}
        eyebrow={page?.header?.eyebrow}
        subtitle={page?.header?.subtitle}
      />

      <div className="container-page py-12">
        {/* Recent activities as photo cards */}
        {events.length > 0 && (
          <>
            <SectionHeading eyebrow={page?.recentHeading?.eyebrow} title={page?.recentHeading?.title} />
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {events.map((e) => {
                const cover = mediaUrl(e.coverImage, "card");
                const date = formatDate(e.date);
                const title = e.titleEn || e.titleHi;
                return (
                  <Link
                    key={e.id}
                    href={`/blog/${e.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-saffron-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    {cover && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-saffron-50">
                        <Image
                          src={cover}
                          alt={mediaAlt(e.coverImage, title)}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {date && (
                          <span lang="en" className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-sewablue-700 shadow-sm">
                            {date}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 lang={langOf(title)} className="text-lg font-bold leading-snug text-ink">
                        {title}
                      </h3>
                      {e.location && (
                        <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-saffron-50 px-3 py-1 text-xs font-medium text-saffron-700">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                          </svg>
                          {e.location}
                        </p>
                      )}
                      <p lang={langOf(e.summaryHi)} className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                        {e.summaryHi}
                      </p>
                      {readMore && (
                        <span lang={langOf(readMore)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sewablue-600">
                          {readMore}
                          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Photo gallery */}
        {gallery.length > 0 && (
          <div className="mt-14">
            <div className="flex items-end justify-between">
              <SectionHeading eyebrow={page?.galleryHeading?.eyebrow} title={page?.galleryHeading?.title} />
              {page?.galleryCaption && (
                <span lang={langOf(page.galleryCaption)} className="hidden text-sm text-ink-soft sm:block">
                  {page.galleryCaption}
                </span>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {gallery.map((img, i) => (
                <div
                  key={`${img.src}-${i}`}
                  className="group relative aspect-[3/2] overflow-hidden rounded-xl border border-saffron-100 bg-saffron-50 shadow-sm"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dignitaries / Guests — standalone list, separate from
            the per-event guests shown on each blog/detail page. */}
        {guests.length > 0 && (
          <div className="mt-14">
            <SectionHeading eyebrow={page?.guestsHeading?.eyebrow} title={page?.guestsHeading?.title} />
            {page?.guestsNote && (
              <p lang={langOf(page.guestsNote)} className="mt-2 text-xs italic text-ink-soft">
                {page.guestsNote}
              </p>
            )}
            <div className="mt-6">
              <GuestCarousel guests={guests} a11y={a11yLabels(ui)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
