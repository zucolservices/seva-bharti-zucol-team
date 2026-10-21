"use client";

// Quotes from the live site (sewabhartirajasthan.org, the CTA banners), rebuilt
// as text + portrait. Auto-advances in a loop (pauses on hover / focus, has a
// Pause/Play button, and stays still under prefers-reduced-motion) and can be
// changed with the dots. Copy: src/content/pages/quotes.ts (not home.ts, so the
// rest of the home copy stays out of the client bundle); portraits live in
// public/home/.
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { HOME_QUOTES, HOME_QUOTES_LABELS } from "@/content/pages/quotes";
// (constants are the standalone defaults; the home page passes the CMS-resolved ones as props)
import { langOf } from "@/lib/view-types";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const mql = window.matchMedia(REDUCED_MOTION);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};
/** Live `prefers-reduced-motion: reduce` (false on the server). */
const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

export default function QuoteCarousel({
  quotes: QUOTES = HOME_QUOTES,
  labels: HOME_QUOTES_LABELS_ = HOME_QUOTES_LABELS,
}: {
  quotes?: typeof HOME_QUOTES;
  labels?: typeof HOME_QUOTES_LABELS;
}) {
  const [index, setIndex] = useState(0);
  // Hover / focus pause (temporary) vs the Pause/Play button (sticks until
  // toggled). Until the visitor chooses, reduced-motion users get no
  // auto-advance; they can still press Play.
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const playing = userPlaying ?? !reducedMotion;
  const count = QUOTES.length;

  useEffect(() => {
    if (!playing || hoverPaused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [playing, hoverPaused, count]);

  return (
    <section className="container-page py-10" aria-roledescription="carousel" aria-label={HOME_QUOTES_LABELS_.carousel}>
      <div
        className="relative overflow-hidden rounded-2xl bg-[#2b2b2b] bg-[url('/home/bg-vission.webp')] bg-cover bg-center"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocus={() => setHoverPaused(true)}
        onBlur={() => setHoverPaused(false)}
      >
        {/* Dark wash over the photo, like the live banners */}
        <div aria-hidden className="absolute inset-0 bg-[#262626]/90" />

        {/* All slides share one grid cell, so the card keeps the tallest height */}
        <div className="relative grid">
          {QUOTES.map((q, i) => {
            const active = i === index;
            return (
              <figure
                key={q.name}
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${count}`}
                aria-hidden={!active}
                className={`col-start-1 row-start-1 flex flex-col items-center gap-6 px-6 pb-14 pt-8 transition-opacity duration-700 motion-reduce:transition-none md:flex-row md:gap-10 md:px-10 md:pb-12 md:pt-8 ${
                  active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <div className="relative aspect-[268/300] w-40 shrink-0 overflow-hidden rounded-xl md:w-56 lg:w-64">
                  <Image
                    src={q.photo}
                    alt={q.name}
                    fill
                    sizes="(max-width: 768px) 160px, 256px"
                    className="object-cover object-top"
                  />
                </div>

                <figcaption className="flex flex-1 flex-col items-center text-center">
                  <blockquote
                    lang={langOf(q.quote)}
                    className="max-w-2xl text-lg font-bold leading-relaxed text-white md:text-2xl"
                  >
                    {q.quote}
                  </blockquote>
                  {q.tagline && (
                    <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-saffron-400 md:text-base">
                      {q.tagline}
                    </p>
                  )}
                  <span aria-hidden className="mt-5 block h-1 w-14 rounded-full bg-saffron-500" />
                  <span lang={langOf(q.name)} className="mt-4 block text-base font-bold text-white md:text-lg">
                    {q.name}
                  </span>
                  {q.role && (
                    <span lang={langOf(q.role)} className="mt-1 block text-sm text-white/75 md:text-base">
                      {q.role}
                    </span>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Dots + Pause/Play */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          {QUOTES.map((q, i) => (
            <button
              key={q.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={HOME_QUOTES_LABELS_.dot.replace("{n}", String(i + 1)).replace("{name}", q.name)}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-7 bg-saffron-500" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
          {/* WCAG 2.2.2: auto-advancing content needs a pause control. The
              circle is small to sit with the dots; ::before widens the hit
              area to 44×44. */}
          <button
            type="button"
            onClick={() => setUserPlaying(!playing)}
            aria-label={playing ? HOME_QUOTES_LABELS_.pause : HOME_QUOTES_LABELS_.play}
            className="relative ml-2 flex size-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors before:absolute before:-inset-2 before:content-[''] hover:bg-white/30"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {playing ? (
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              ) : (
                <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
