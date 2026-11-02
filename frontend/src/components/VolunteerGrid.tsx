"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { loadMoreVolunteers } from "@/lib/volunteer-actions";
import type { PublicVolunteer } from "@/lib/volunteers";

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

/** Volunteer cards with a "View full profile" button to /volunteer/<uid>; "Show more" appends the next page. */
export default function VolunteerGrid({ initial, initialHasNext }: { initial: PublicVolunteer[]; initialHasNext: boolean }) {
  const [volunteers, setVolunteers] = useState(initial);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // Coming back with the browser's Back button (e.g. from the dashboard form)
  // restores a frozen copy of the page; fetch the current list instead.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) router.refresh();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  function showMore() {
    startTransition(async () => {
      const next = await loadMoreVolunteers(page + 1);
      // An empty result with more expected means the API failed; keep the button to retry.
      if (next.volunteers.length === 0 && next.total === 0) {
        setFailed(true);
        return;
      }
      setFailed(false);
      setVolunteers((prev) => {
        const seen = new Set(prev.map((v) => v.uid));
        return [...prev, ...next.volunteers.filter((v) => !seen.has(v.uid))];
      });
      setPage(page + 1);
      setHasNext(next.hasNext);
    });
  }

  return (
    <>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {volunteers.map((v) => (
          <li
            key={v.uid}
            className="flex h-full flex-col rounded-2xl border border-saffron-100 bg-white p-5 shadow-sm transition-shadow hover:border-saffron-200 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              {v.photoUrl ? (
                <Image
                  src={v.photoUrl}
                  alt={v.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-saffron-100"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sewablue-700 text-xl font-bold text-white ring-2 ring-saffron-100"
                >
                  {initials(v.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                {/* Long names / designations wrap (max 2 lines) instead of being cut. */}
                <p className="line-clamp-2 text-pretty wrap-anywhere text-lg font-semibold leading-snug text-ink">{v.name}</p>
                {v.designation && (
                  <p className="mt-0.5 line-clamp-2 text-pretty wrap-anywhere text-sm text-ink-soft">{v.designation}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                  {v.role && (
                    <span className="rounded-full bg-saffron-100 px-2.5 py-0.5 font-medium text-saffron-800">
                      <span lang="hi">{v.role.hi}</span> · {v.role.en}
                    </span>
                  )}
                  {v.city && (
                    <span className="inline-flex min-w-0 items-center gap-1 text-ink-soft">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
                        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                      </svg>
                      <span className="wrap-anywhere">{v.city}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* mt-auto pins the separator + button to the bottom, so buttons line up across a row. */}
            <div className="mt-auto pt-4">
              <hr className="border-saffron-100" />
              <Link
                href={`/volunteer/${v.uid}`}
                aria-label={`${v.name}: पूरी जानकारी देखें (View full profile)`}
                className="mt-4 flex flex-wrap items-baseline justify-center gap-x-1.5 rounded-lg bg-saffron-500 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-saffron-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600"
              >
                {/* Each part stays on one line; the parts wrap as whole units. */}
                <span lang="hi" className="whitespace-nowrap">पूरी जानकारी देखें</span>
                <span className="whitespace-nowrap font-normal">
                  (View full profile) <span aria-hidden>→</span>
                </span>
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {hasNext && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={showMore}
            disabled={pending}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-saffron-300 bg-white px-5 py-2.5 text-sm font-semibold text-saffron-700 transition-colors hover:bg-saffron-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600 disabled:cursor-wait disabled:opacity-70"
          >
            {pending && (
              <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-saffron-200 border-t-saffron-600" />
            )}
            <span lang="hi">{pending ? "लोड हो रहा है…" : "और देखें"}</span>
            <span className="font-normal">{pending ? "(Loading…)" : "(Show more)"}</span>
          </button>
          {failed && (
            <p role="alert" className="text-sm text-red-700">
              <span lang="hi">अभी लोड नहीं हो सका, पुनः प्रयास करें।</span> Could not load, please try again.
            </p>
          )}
        </div>
      )}
    </>
  );
}
