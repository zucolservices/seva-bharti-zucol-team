"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { langOf, type HeaderData, type NavItemView } from "@/lib/view-types";
import { NAV_NEW_TAB_LABEL } from "@/content/navigation";

// Site header. Menu items come from src/content/navigation.ts; an item with
// children renders as a click-to-open dropdown (e.g. Our Work → pillars).
// Absolute http(s) links (e.g. Login → Dashboard, the CMS admin) open in a
// new tab.
//
// `usePathname` suspends while Next.js prerenders the App Shell of dynamic
// routes, so the layout wraps <Header> in <Suspense> and uses <HeaderView>
// with `pathname={null}` (no active highlight) as the fallback.
export default function Header(props: HeaderData) {
  const pathname = usePathname();
  return <HeaderView {...props} pathname={pathname} />;
}

const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** Internal links use next/link; absolute URLs open in a new tab. */
function MenuLink({
  href,
  className,
  onClick,
  current,
  children,
}: {
  href: string;
  className: string;
  onClick?: () => void;
  current?: boolean;
  children: React.ReactNode;
}) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        <span className="inline-flex items-center gap-1.5">
          {children}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
            className="opacity-60"
          >
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">{NAV_NEW_TAB_LABEL}</span>
        </span>
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} aria-current={current ? "page" : undefined} className={className}>
      {children}
    </Link>
  );
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
  const dropdownButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  // Item ids contain labels (spaces), so dropdown list ids use useId + index.
  const idPrefix = useId();

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

  // Escape closes the open dropdown / mobile menu and returns focus to the
  // button that opened it.
  useEffect(() => {
    if (!open && openDropdown == null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openDropdown != null) {
        dropdownButtonRefs.current.get(openDropdown)?.focus();
        setOpenDropdown(null);
      }
      if (open) {
        toggleRef.current?.focus();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openDropdown]);

  // The mobile panel starts below the TopBar + header, and that offset changes
  // as the TopBar scrolls away, so a fixed calc() let the last items (Donate)
  // fall below the viewport. Size it to the space actually left under its top.
  useLayoutEffect(() => {
    const nav = mobileNavRef.current;
    if (!open || !nav) return;
    const fit = () => {
      const top = Math.max(0, nav.getBoundingClientRect().top);
      nav.style.maxHeight = `${window.innerHeight - top}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("scroll", fit, { passive: true });
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("scroll", fit);
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    `whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-saffron-100 text-saffron-800"
        : "text-ink hover:bg-saffron-50 hover:text-saffron-700"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block rounded-md px-3 py-3 text-sm font-medium ${
      active ? "bg-saffron-100 text-saffron-800" : "text-ink hover:bg-saffron-50"
    }`;

  // Desktop: "utility" items (Login) are shown in the top bar instead.
  const mainItems = items.filter((i) => !i.utility);

  // One desktop menu entry: a link, or a click-to-open dropdown.
  const desktopItem = (item: NavItemView, idx: number, alignRight: boolean) =>
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
          ref={(el) => {
            if (el) dropdownButtonRefs.current.set(item.id, el);
            else dropdownButtonRefs.current.delete(item.id);
          }}
          type="button"
          aria-haspopup="true"
          aria-expanded={openDropdown === item.id}
          aria-controls={`${idPrefix}-dropdown-${idx}`}
          onClick={() => setOpenDropdown((v) => (v === item.id ? null : item.id))}
          className={`flex items-center gap-0.5 ${linkClass(groupActive(item.children))}`}
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
          // Items near the right edge open leftwards to stay on screen.
          <div className={`absolute top-full pt-1 ${alignRight ? "right-0" : "left-0"}`}>
            <ul
              id={`${idPrefix}-dropdown-${idx}`}
              className="min-w-52 whitespace-nowrap rounded-lg border border-saffron-100 bg-white py-2 shadow-lg">
              {item.children.map((c) => (
                <li key={c.label}>
                  <MenuLink
                    href={c.href}
                    onClick={() => setOpenDropdown(null)}
                    current={isActive(c.href)}
                    className={`block px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(c.href)
                        ? "bg-saffron-50 text-saffron-800"
                        : "text-ink hover:bg-saffron-50 hover:text-saffron-700"
                    }`}
                  >
                    {c.label}
                  </MenuLink>
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
    ) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-saffron-100 bg-white/95 backdrop-blur">
      <div className="container-wide flex items-center justify-between gap-3 py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={siteName ? `${siteName} — ${a11y.homeLinkLabel}` : a11y.homeLinkLabel}
        >
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={68}
            height={75}
            priority
            className="h-16 w-auto shrink-0"
          />
          <span className="leading-tight">
            {brandTitle && (
              <span className="block text-base font-bold text-saffron-700 sm:text-lg">
                {brandTitle}
              </span>
            )}
            {tagline && (
              <span lang={langOf(tagline)} className="block text-xs text-ink-soft sm:text-sm">
                {tagline}
              </span>
            )}
          </span>
        </Link>

        {/* Desktop menu (Login and Donate are in the top bar on desktop). */}
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center">
            {mainItems.map((item, idx) => desktopItem(item, idx, idx >= mainItems.length - 2))}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="rounded-md p-2 text-ink hover:bg-saffron-50 xl:hidden"
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
          ref={mobileNavRef}
          id="mobile-nav"
          aria-label="Primary mobile"
          // max-height is set from the panel's measured top (see above); the
          // class is only the pre-measure fallback.
          className="max-h-[calc(100dvh-6.25rem)] overflow-y-auto overscroll-contain border-t border-saffron-100 bg-white xl:hidden"
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
                      <li key={c.label}>
                        <MenuLink
                          href={c.href}
                          onClick={() => setOpen(false)}
                          current={isActive(c.href)}
                          className={mobileLinkClass(isActive(c.href))}
                        >
                          {c.label}
                        </MenuLink>
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
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-saffron-500 px-3 py-3 text-center text-sm font-semibold text-ink hover:bg-saffron-600"
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
