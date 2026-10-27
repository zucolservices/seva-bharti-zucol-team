"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { langOf } from "@/lib/view-types";

// Home-page hero slider (CMS: Home Page → Hero → Slider). Same layout as the
// old static hero: text on the left, the photo on the right in a rounded
// 3:2 frame. Slides cross-fade every INTERVAL_MS; hovering,
// focusing inside, a hidden tab or the pause button stop it. With
// prefers-reduced-motion it never advances on its own.

export type HeroSlide = {
  heading: string;
  content: string;
  image: { url: string; alt: string; width: number; height: number } | null;
};

const INTERVAL_MS = 6000;

export default function HeroCarousel({
  slides,
  badge,
  fallbackImage,
}: {
  slides: HeroSlide[];
  badge?: string | null;
  fallbackImage: { url: string; alt: string };
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // pause button
  const [held, setHeld] = useState(false); // hover / focus inside
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Restarts on every slide change, so a manual pick gets the full interval.
  useEffect(() => {
    if (count < 2 || paused || held || reduced) return;
    const t = window.setTimeout(() => {
      if (!document.hidden) go(index + 1);
    }, INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [index, count, paused, held, reduced, go]);

  const running = count > 1 && !paused && !held && !reduced;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setHeld(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className="container-wide grid items-center gap-10 py-12 md:grid-cols-[1fr_1.3fr] md:gap-8 md:py-16 lg:py-20"
    >
      <div>
        {badge && (
          <span
            lang={langOf(badge)}
            className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-white/70 px-3 py-1 text-xs font-semibold text-saffron-700 shadow-sm"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1 3 5v6c0 5.25 3.75 10.16 9 11 5.25-.84 9-5.75 9-11V5l-9-4Zm-1.2 14.4L7 11.6l1.4-1.4 2.4 2.4 5-5L17.2 9l-6.4 6.4Z" />
            </svg>
            {badge}
          </span>
        )}

        {/* All slides share one grid cell, so the block is as tall as the
            longest slide and nothing below jumps when the text changes. */}
        <div className="grid" aria-live={running ? "off" : "polite"}>
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!active}
                inert={!active}
                // Outgoing text fades out quickly; incoming waits for it, so
                // the two never overlap.
                className={`col-start-1 row-start-1 transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  active
                    ? "translate-y-0 opacity-100 delay-300 duration-700"
                    : "pointer-events-none -translate-y-1 opacity-0 duration-300"
                }`}
              >
                {/* The first slide is the page's main heading; the rest are h2. */}
                {i === 0 ? (
                  <h1 lang={langOf(s.heading)} className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-[2.75rem] xl:text-[3.25rem]">
                    {s.heading}
                  </h1>
                ) : (
                  <h2 lang={langOf(s.heading)} className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-[2.75rem] xl:text-[3.25rem]">
                    {s.heading}
                  </h2>
                )}
                <p lang={langOf(s.content)} className="mt-5 max-w-xl whitespace-pre-line text-base leading-relaxed text-ink-soft md:text-lg">
                  {s.content}
                </p>
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2" role="group" aria-label="Choose slide">
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}: ${s.heading}`}
                    aria-current={active || undefined}
                    className={`relative h-2 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                      active ? "w-10 bg-saffron-200" : "w-2 bg-saffron-200 hover:bg-saffron-300"
                    }`}
                  >
                    {active && (
                      // Fills over the interval; restarts on each slide (key).
                      <span
                        key={`${index}-${running}`}
                        aria-hidden
                        className="absolute inset-y-0 left-0 rounded-full bg-saffron-500"
                        style={{
                          width: running ? undefined : "100%",
                          animation: running ? `hero-progress ${INTERVAL_MS}ms linear forwards` : undefined,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-saffron-200 bg-white/70 text-saffron-700 transition-colors hover:bg-white"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {paused ? <path d="M7 4.5v15l13-7.5-13-7.5Z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Photo: a plain 3:2 frame with rounded corners, so any normal photo
          looks right (no fading needed); it stays inside the page width. */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-saffron-50 shadow-[0_24px_48px_-24px_rgba(95,50,10,0.35)] ring-1 ring-saffron-100">
        {slides.map((s, i) => {
          const img = s.image ?? null;
          const active = i === index;
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
            >
              {img ? (
                <Image
                  src={img.url}
                  alt={active ? img.alt : ""}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <Image
                  src={fallbackImage.url}
                  alt={active ? fallbackImage.alt : ""}
                  fill
                  sizes="320px"
                  className="object-contain p-10 drop-shadow-sm"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
