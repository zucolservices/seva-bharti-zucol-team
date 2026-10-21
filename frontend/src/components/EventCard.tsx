import Image from "next/image";
import Link from "next/link";
import { formatDate, mediaAlt, mediaUrl } from "@/lib/cms";
import type { Event } from "@/payload-types";
import { langOf } from "@/lib/view-types";

// Event summary card (cover photo, date, title, location, summary, "read more").
// Same markup as the cards on the Events page.
export default function EventCard({ event, readMore }: { event: Event; readMore?: string | null }) {
  const cover = mediaUrl(event.coverImage, "card");
  const date = formatDate(event.date);
  const title = event.titleEn || event.titleHi;

  return (
    <Link
      href={`/blog/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-saffron-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {cover && (
        <div className="relative aspect-[16/10] overflow-hidden bg-saffron-50">
          <Image
            src={cover}
            alt={mediaAlt(event.coverImage, title)}
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
        {event.location && (
          <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-saffron-50 px-3 py-1 text-xs font-medium text-saffron-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
            </svg>
            {event.location}
          </p>
        )}
        <p lang={langOf(event.summaryHi)} className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
          {event.summaryHi}
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
}
