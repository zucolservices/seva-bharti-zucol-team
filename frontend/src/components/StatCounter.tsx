"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1200;

// A statistic that counts up from 0 to `value` when it scrolls into view.
// The server (and no-JS visitors, crawlers, screen readers) get the final
// number: it is always in the markup and sizes the box, so the animation
// never shifts layout. The count-up is a client-only, aria-hidden overlay and
// is skipped under prefers-reduced-motion.
export default function StatCounter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // null = not animating (show the final value).
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let frame = 0;
    // Start from 0 right after hydration so the count-up is visible when the
    // stat scrolls in.
    setShown(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - (1 - t) ** 3; // ease-out cubic
          if (t < 1) {
            setShown(Math.round(value * eased));
            frame = requestAnimationFrame(tick);
          } else {
            setShown(null);
          }
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={`relative inline-block tabular-nums ${className ?? ""}`}>
      {/* Final value: read by assistive tech; transparent only while counting. */}
      <span className={shown === null ? undefined : "opacity-0"}>
        {value}
        {suffix}
      </span>
      {shown !== null && (
        <span aria-hidden className="absolute inset-0 text-center">
          {shown}
          {suffix}
        </span>
      )}
    </span>
  );
}
