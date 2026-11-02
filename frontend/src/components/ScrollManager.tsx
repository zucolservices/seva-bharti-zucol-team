"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Scroll position on client-side navigation, for every page.
//
// Next keeps the scroll position when the new page's content is already in
// view (e.g. clicking a footer link on a long page), so pages could open half
// way down. Here every new page starts at the top, or at its #section when the
// link has one. Back/forward is left alone: the browser restores the position.
//
// The #section may stream in after navigation (e.g. /volunteer#volunteers), so
// it is looked for for up to ~2s before falling back to the top.

const HASH_WAIT_MS = 2000;

export default function ScrollManager() {
  const pathname = usePathname();
  const isFirst = useRef(true);
  const isHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // Full page loads: the browser already handles the top / #hash.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (isHistory.current) {
      isHistory.current = false;
      return;
    }

    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    let frame = 0;
    const started = performance.now();
    const find = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      } else if (performance.now() - started < HASH_WAIT_MS) {
        frame = requestAnimationFrame(find);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    };
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    find();
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
