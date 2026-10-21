import type { ReactNode } from "react";
import type { SiteSetting } from "@/payload-types";
import { langOf, type NavLinkView } from "@/lib/view-types";
import SocialIcon, { socialLabels } from "@/components/SocialIcon";
import { primaryPhone, telHref } from "@/lib/site-data";

// Official utility bar — registration credentials + direct contact.
// A hallmark of legitimate registered-organisation sites.
export default function TopBar({
  settings,
  links = [],
  cta,
}: {
  settings: SiteSetting | null;
  /** Desktop-only quick links (the Login items); the mobile menu has them too. */
  links?: NavLinkView[];
  /** Desktop-only highlighted link (Donate). */
  cta?: NavLinkView | null;
}) {
  const phone = primaryPhone(settings);
  const email = settings?.primaryEmail;
  const socials = settings?.socials ?? [];

  // Separators only between items that are actually shown.
  const items: ReactNode[] = [];
  if (email) {
    items.push(
      <a key="email" href={`mailto:${email}`} className="hover:text-saffron-300">
        {email}
      </a>,
    );
  }
  if (phone) {
    items.push(
      <a key="phone" href={telHref(phone)} className="hover:text-saffron-300">
        {phone}
      </a>,
    );
  }
  if (socials.length > 0) {
    items.push(
      <ul key="socials" className="flex items-center gap-2">
        {socials.map((s, i) => (
          <li key={s.id ?? `${s.platform}-${i}`}>
            <a
              href={s.url}
              aria-label={socialLabels[s.platform] ?? s.platform}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 items-center justify-center rounded text-white/90 transition-colors hover:bg-white/10 hover:text-saffron-300"
            >
              <SocialIcon platform={s.platform} size={15} />
            </a>
          </li>
        ))}
      </ul>,
    );
  }

  return (
    <div className="bg-sewablue-800 text-white">
      <div
        className={`container-wide flex flex-col items-center justify-between gap-1 py-1.5 text-xs sm:flex-row [&_a]:whitespace-nowrap ${
          links.length > 0 ? "xl:justify-end 2xl:justify-between" : ""
        }`}
      >
        {settings?.topBarText ? (
          // Between 1280 and 1535 px the login links need the room; the same
          // registration details are in the footer.
          <p
            lang={langOf(settings.topBarText)}
            className={`flex items-center gap-2 text-center ${links.length > 0 ? "xl:hidden 2xl:flex" : ""}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0 text-saffron-300">
              <path d="M12 1 3 5v6c0 5.25 3.75 10.16 9 11 5.25-.84 9-5.75 9-11V5l-9-4Zm-1.2 14.4L7 11.6l1.4-1.4 2.4 2.4 5-5L17.2 9l-6.4 6.4Z" />
            </svg>
            <span>{settings.topBarText}</span>
          </p>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-4">
          {links.length > 0 && (
            <ul className="hidden items-center gap-4 xl:flex">
              {links.map((l) => {
                const external = /^https?:\/\//.test(l.href);
                return (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="font-medium hover:text-saffron-300"
                    >
                      {l.label}
                      {external && <span className="sr-only"> (opens in new tab)</span>}
                    </a>
                  </li>
                );
              })}
              <li aria-hidden className="text-white/30">|</li>
            </ul>
          )}
          {items.flatMap((node, i) =>
            i === 0
              ? [node]
              : [
                  <span key={`sep-${i}`} aria-hidden className="text-white/30">
                    |
                  </span>,
                  node,
                ],
          )}
          {cta && (
            <a
              href={cta.href}
              className="hidden rounded bg-saffron-500 px-3 py-0.5 font-semibold text-ink transition-colors hover:bg-saffron-600 xl:inline-block"
            >
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
