"use client";

import { useRowLabel } from "@payloadcms/ui";

// Collapsed slide rows in Home Page → Hero → Slider show their heading.
export function SlideRowLabel() {
  const { data, rowNumber } = useRowLabel<{ heading?: string }>();
  const n = String((rowNumber ?? 0) + 1).padStart(2, "0");
  return <span>{data?.heading?.trim() ? `${n} · ${data.heading}` : `Slide ${n}`}</span>;
}
