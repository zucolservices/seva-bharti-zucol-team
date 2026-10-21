"use client";

import { useRef, type ReactNode } from "react";
import { langOf } from "@/lib/view-types";

// "Read the full story" button that opens the full story in a modal (native <dialog>:
// Esc closes, focus is trapped, page behind is inert). Clicking the dark
// backdrop also closes it.
export default function StoryDialog({
  label,
  title,
  children,
}: {
  label: string;
  title?: string | null;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        lang={langOf(label)}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-saffron-500 px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-saffron-600"
      >
        {label}
        <span aria-hidden>→</span>
      </button>

      <dialog
        ref={ref}
        aria-label={title ?? label}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        className="m-auto w-[min(48rem,calc(100vw-2rem))] max-h-[85vh] rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/60"
      >
        <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-8">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="sticky top-0 float-right -mr-2 -mt-2 rounded-full bg-white p-2 text-ink-soft shadow-sm ring-1 ring-saffron-100 transition-colors hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          {children}
        </div>
      </dialog>
    </>
  );
}
