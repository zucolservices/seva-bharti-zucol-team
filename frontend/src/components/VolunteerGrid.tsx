"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { loadMoreVolunteers } from "@/lib/volunteer-actions";
import type { PublicVolunteer } from "@/lib/volunteers";

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

/** Volunteer cards linking to /volunteer/<uid>; "Show more" appends the next page. */
export default function VolunteerGrid({ initial, initialHasNext }: { initial: PublicVolunteer[]; initialHasNext: boolean }) {
  const [volunteers, setVolunteers] = useState(initial);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

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
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {volunteers.map((v) => (
          <li key={v.uid}>
            <Link
              href={`/volunteer/${v.uid}`}
              className="flex items-center gap-4 rounded-xl border border-saffron-100 bg-white p-4 shadow-sm transition-colors hover:border-saffron-300 hover:bg-saffron-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600"
            >
              {v.photoUrl ? (
                <Image
                  src={v.photoUrl}
                  alt={v.name}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sewablue-700 text-lg font-bold text-white"
                >
                  {initials(v.name)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink">{v.name}</span>
                {v.designation && <span className="block truncate text-sm text-ink-soft">{v.designation}</span>}
                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  {v.role && (
                    <span className="rounded-full bg-saffron-100 px-2 py-0.5 font-medium text-saffron-800">
                      <span lang="hi">{v.role.hi}</span> · {v.role.en}
                    </span>
                  )}
                  {v.city && <span className="text-ink-soft">{v.city}</span>}
                </span>
              </span>
            </Link>
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
