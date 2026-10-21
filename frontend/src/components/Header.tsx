"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { HeaderData } from "@/lib/view-types";

// Site header. Menu items come from src/content/navigation.ts; an item with
// children renders as a click-to-open dropdown (e.g. हमारा कार्य → pillars).
//
// `usePathname` suspends while Next.js prerenders the App Shell of dynamic
// routes, so the layout wraps <Header> in <Suspense> and uses <HeaderView>
// with `pathname={null}` (no active highlight) as the fallback.
export default function Header(props: HeaderData) {
  const pathname = usePathname();
  return <HeaderView {...props} pathname={pathname} />;
}

export function HeaderView({
  a11y,
  siteName,
  logoUrl,
  logoAlt,
  brandTitle,
  tagline,
  items,
  cta,
  pathname,
}: HeaderData & { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef(new Map<string, HTMLLIElement>());

  const isActive = (href: string | null | undefined) => {
    // In-page links (/about-us#vision) are never "the current page".
    if (!href || pathname == null || !href.startsWith("/") || href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };
  // A dropdown is active when any child's page (ignoring #section) is open.
  const groupActive = (children: { href: string }[]) =>
    children.some((c) => isActive(c.href.split("#")[0]));

  // Mobile list: items from the first dropdown onwards get a small top gap
  // (matches the original layout).
  const firstDropdown = items.findIndex((i) => i.children.length > 0);
  const mobileGap = (i: number) => (firstDropdown !== -1 && i >= firstDropdown ? "mt-1" : undefined);

  // Close the desktop dropdown on route change and outside clicks.
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = [...dropdownRefs.current.values()].some((el) => el.contains(target));
      if (!inside) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const linkClass = (active: boolean) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-saffron-100 text-saffron-800"
        : "text-ink hover:bg-saffron-50 hover:text-saffron-700"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block rounded-md px-3 py-3 text-sm font-medium ${
      active ? "bg-saffron-100 text-saffron-800" : "text-ink hover:bg-saffron-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-saffron-100 bg-white/95 backdrop-blur">
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={siteName ? `${siteName} — ${a11y.homeLinkLabel}` : a11y.homeLinkLabel}
        >
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={68}
            height={75}
            priority
            className="h-16 w-auto"
          />
          <span className="leading-tight">
            {brandTitle && (
              <span className="block text-base font-bold text-saffron-700 sm:text-lg">
                {brandTitle}
              </span>
            )}
            {tagline && (
              <span lang="hi" className="block text-xs text-ink-soft sm:text-sm">
                {tagline}
              </span>
            )}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) =>
              item.children.length > 0 ? (
                <li
                  key={item.id}
                  ref={(el) => {
                    if (el) dropdownRefs.current.set(item.id, el);
                    else dropdownRefs.current.delete(item.id);
                  }}
                  className="relative"
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.id}
                    onClick={() => setOpenDropdown((v) => (v === item.id ? null : item.id))}
                    className={`flex items-center gap-1 ${linkClass(groupActive(item.children))}`}
                  >
                    {item.label}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                      className={`transition-transform ${openDropdown === item.id ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {openDropdown === item.id && (
                    // Click-to-open dropdown; pt-1 gives a small visual gap.
                    <div className="absolute left-0 top-full pt-1">
                      <ul className="min-w-52 rounded-lg border border-saffron-100 bg-white py-2 shadow-lg">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setOpenDropdown(null)}
                              aria-current={isActive(c.href) ? "page" : undefined}
                              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                                isActive(c.href)
                                  ? "bg-saffron-50 text-saffron-800"
                                  : "text-ink hover:bg-saffron-50 hover:text-saffron-700"
                              }`}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : item.href ? (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={linkClass(isActive(item.href))}
                  >
                    {item.label}
                  </Link>
                </li>
              ) : null,
            )}
            {cta && (
              <li className="ml-2">
                <Link
                  href={cta.href}
                  lang="hi"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-saffron-500/30 transition-colors hover:bg-saffron-600"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.4 2.6.8-1.5 2.3-2.6 4.4-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" />
                  </svg>
                  {cta.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="rounded-md p-2 text-ink hover:bg-saffron-50 lg:hidden"
        >
          <span className="sr-only">{open ? a11y.menuClose : a11y.menuOpen}</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t border-saffron-100 bg-white lg:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {items.map((item, i) =>
              item.children.length > 0 ? (
                <li key={item.id} className={mobileGap(i)}>
                  <p className="px-3 pt-2 text-sm font-semibold text-saffron-700">
                    {item.label}
                  </p>
                  <ul className="border-l border-saffron-100 pl-3">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(c.href) ? "page" : undefined}
                          className={mobileLinkClass(isActive(c.href))}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : item.href ? (
                <li key={item.id} className={mobileGap(i)}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={mobileLinkClass(isActive(item.href))}
                  >
                    {item.label}
                  </Link>
                </li>
              ) : null,
            )}
            {cta && (
              <li className="mt-3 pb-2">
                <Link
                  href={cta.href}
                  lang="hi"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-saffron-500 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-saffron-600"
                >
                  {cta.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
