import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import EventCard from "@/components/EventCard";
import EventPhotos from "@/components/EventPhotos";
import { getContent, getEvents, getGlobal } from "@/lib/cms";
import { a11yLabels, toPhotoViews } from "@/lib/site-data";
import { resolveGallery } from "@/content/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const { header } = resolveGallery(await getContent("gallery-content"));
  return { title: header.eyebrow, description: header.subtitle };
}

export default async function GalleryPage() {
  // Same CMS sources as the Events page: its gallery photos and the events list.
  const [page, events, ui, galleryContent] = await Promise.all([
    getGlobal("events-page"),
    getEvents(),
    getGlobal("ui-strings"),
    getContent("gallery-content"),
  ]);
  const {
    header: GALLERY_HEADER,
    photoAlt: GALLERY_PHOTO_ALT,
    recentHeading: GALLERY_RECENT_HEADING,
    allEvents: GALLERY_ALL_EVENTS,
  } = resolveGallery(galleryContent);
  const photos = toPhotoViews(page?.gallery, "hero", GALLERY_PHOTO_ALT);
  const recent = events.slice(0, 6);
  const readMore = page?.readMoreLabel;

  return (
    <>
      <PageHeader eyebrow={GALLERY_HEADER.eyebrow} title={GALLERY_HEADER.title} subtitle={GALLERY_HEADER.subtitle} />

      <div className="container-page py-12">
        {photos.length > 0 && (
          <section>
            <EventPhotos photos={photos} a11y={a11yLabels(ui)} />
          </section>
        )}

        {recent.length > 0 && (
          <section className={photos.length > 0 ? "mt-14" : undefined}>
            <SectionHeading title={GALLERY_RECENT_HEADING} />
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {recent.map((e) => (
                <EventCard key={e.id} event={e} readMore={readMore} />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href={GALLERY_ALL_EVENTS.href}
                className="group inline-flex items-center gap-1 font-semibold text-sewablue-600 hover:text-sewablue-700"
              >
                {GALLERY_ALL_EVENTS.label}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
