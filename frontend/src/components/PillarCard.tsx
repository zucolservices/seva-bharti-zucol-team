import Link from "next/link";
import type { Pillar } from "@/payload-types";
import type { PillarName } from "@/content/pillars";
import { langOf } from "@/lib/view-types";

export default function PillarCard({
  pillar,
  names,
  summary,
  ctaLabel,
}: {
  pillar: Pillar;
  /** Overrides the CMS names (English title + transliterated badge). */
  names?: PillarName;
  /** Fallback line when the CMS pillar has no summary (home-page one-liners). */
  summary?: string;
  ctaLabel?: string | null;
}) {
  const isBlue = pillar.accent === "blue";
  const ring = isBlue ? "border-sewablue-100 hover:border-sewablue-300" : "border-saffron-100 hover:border-saffron-300";
  const badge = isBlue ? "bg-sewablue-50 text-sewablue-700" : "bg-saffron-50 text-saffron-700";
  const cta = isBlue ? "text-sewablue-600" : "text-saffron-700";
  const title = names?.title ?? (pillar.nameEn || pillar.nameHi);
  // The team's CMS summary (Pillars → Summary) wins; `summary` is the fallback.
  const text = pillar.summaryEn?.trim() || pillar.summaryHi?.trim() || summary;

  return (
    <Link
      href={`/${pillar.slug}`}
      className={`group flex h-full flex-col rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${ring}`}
    >
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${badge}`}
      >
        {names?.badge ?? pillar.nameEn}
      </span>
      <h3 lang={langOf(title)} className="mt-3 text-xl font-bold text-ink">
        {title}
      </h3>
      <p lang={langOf(text)} className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {text}
      </p>
      {ctaLabel && (
        <span lang={langOf(ctaLabel)} className={`mt-4 text-sm font-semibold ${cta}`}>
          {ctaLabel}{" "}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      )}
    </Link>
  );
}
