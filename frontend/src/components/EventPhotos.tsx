"use client";

import Image from "next/image";
import { useState } from "react";
import { DEFAULT_A11Y, fillN, langOf, type A11yLabels, type PhotoView } from "@/lib/view-types";

// Photo block for an event detail page.
// Layout: the selected photo fills the main frame on the LEFT (70% width).
// On the RIGHT, a narrow (30%) scrollable column of thumbnails lets the user
// pick which photo shows in the main frame. Stacks below on small screens.
export default function EventPhotos({
  photos,
  a11y = DEFAULT_A11Y,
}: {
  photos: PhotoView[];
  a11y?: A11yLabels;
}) {
  const [active, setActive] = useState(0);
  const main = photos[active] ?? photos[0];
  if (!main) return null;

  return (
    <section>
      <h2 lang={langOf(a11y.eventPhotosHeading)} className="sr-only">
        {a11y.eventPhotosHeading}
      </h2>

      <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-4 md:grid-cols-[8fr_2fr]">
        {/* Main photo — left (80%) */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-saffron-100 bg-saffron-50">
          {/* blurred backdrop fills the frame */}
          <Image
            key={`bg-${main.src}`}
            src={main.src}
            alt=""
            aria-hidden
            fill
            priority // same file as the main photo; load it eagerly too (LCP)
            sizes="(max-width: 768px) 100vw, 70vw"
            className="scale-110 object-cover blur-xl opacity-60"
          />
          <Image
            key={main.src}
            src={main.src}
            alt={main.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
          />
        </div>

        {/* Thumbnail scroller — right (20%, equal height to main on desktop) */}
        {photos.length > 1 && (
          <div className="relative rounded-2xl border border-saffron-100 bg-saffron-50">
            <div className="flex max-h-[60vh] scroll-smooth gap-3 overflow-x-auto p-3 md:absolute md:inset-0 md:max-h-none md:flex-col md:overflow-y-auto md:overflow-x-hidden">
              {photos.map((photo, i) => (
                <button
                  key={photo.src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={fillN(a11y.showPhoto, i + 1)}
                  aria-current={i === active}
                  className={`relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition md:w-full ${
                    i === active
                      ? "border-saffron-500 ring-2 ring-saffron-300"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt ? `${photo.alt} — ${i + 1}` : ""}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
