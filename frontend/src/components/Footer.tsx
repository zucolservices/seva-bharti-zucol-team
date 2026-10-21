import Image from "next/image";
import Link from "next/link";
import type { SiteSetting } from "@/payload-types";
import SocialIcon, { socialLabels } from "@/components/SocialIcon";
import { siteLogo, telHref } from "@/lib/site-data";
import { langOf } from "@/lib/view-types";
import { FOOTER_LINKS } from "@/content/navigation";
import { FOOTER_COMPLIANCE, FOOTER_COPYRIGHT, FOOTER_HEADINGS, FOOTER_MOTTO, FOOTER_SOCIALS } from "@/content/pages/footer";

const DEFAULT_CONTENT = {
  motto: FOOTER_MOTTO,
  copyright: FOOTER_COPYRIGHT,
  headings: FOOTER_HEADINGS,
  compliance: FOOTER_COMPLIANCE,
};

// Links the organisation name inside the copyright text (if present) to orgUrl.
function Copyright({ text, name, url }: { text: string; name: string; url?: string | null }) {
  const linkClass = "font-semibold text-saffron-400 hover:underline";
  const at = name && url ? text.toLowerCase().indexOf(name.toLowerCase()) : -1;
  if (at === -1 || !url) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {text.slice(at, at + name.length)}
      </a>
      {text.slice(at + name.length)}
    </>
  );
}

export default function Footer({
  settings,
  content = DEFAULT_CONTENT,
}: {
  settings: SiteSetting | null;
  content?: typeof DEFAULT_CONTENT;
}) {
  const main = settings?.offices?.[0];
  const phones = main?.phones ?? [];
  const logo = siteLogo(settings);
  const quickLinks = FOOTER_LINKS;
  // Live-site links until Site Settings → Social is filled in.
  const socials = settings?.socials?.length ? settings.socials : FOOTER_SOCIALS;
  const email = settings?.primaryEmail;
  // English first; Hindi only when the English field is empty.
  const intro = settings?.introEn || settings?.introHi;

  return (
    <footer className="mt-16 bg-footer text-neutral-300">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-4">
            <Image
              src={logo.url}
              alt={logo.alt}
              width={96}
              height={106}
              className="h-24 w-auto"
            />
            <div>
              {settings?.brandTitle && <p className="font-bold text-white">{settings.brandTitle}</p>}
              {settings?.tagline && (
                <p lang={langOf(settings.tagline)} className="text-sm text-saffron-300">
                  {settings.tagline}
                </p>
              )}
            </div>
          </div>
          {intro && (
            <p lang={langOf(intro)} className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              {intro}
            </p>
          )}
          <p className="mt-4 max-w-sm border-l-2 border-saffron-400 pl-3 text-sm font-semibold italic leading-relaxed text-saffron-200">
            {content.motto}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            {content.headings.quickLinks}
          </h2>
          {quickLinks.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {quickLinks.map((item, i) => (
                <li key={`${item.href}-${i}`}>
                  <Link
                    href={item.href}
                    className="text-neutral-300 hover:text-saffron-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            {content.headings.contact}
          </h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-neutral-400">
            {main?.address && <p>{main.address}</p>}
            {phones.length > 0 && (
              <p>
                {phones.map((p, i) => (
                  <span key={p.id ?? `${p.number}-${i}`}>
                    <a href={telHref(p.number)} className="hover:text-saffron-300">
                      {p.number}
                    </a>
                    {i < phones.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
            {email && (
              <p>
                <a href={`mailto:${email}`} className="hover:text-saffron-300">
                  {email}
                </a>
              </p>
            )}
          </address>

          {socials.length > 0 && (
            <ul className="mt-5 flex items-center gap-3">
              {socials.map((s, i) => (
                <li key={`${s.platform}-${i}`}>
                  <a
                    href={s.url}
                    aria-label={socialLabels[s.platform] ?? s.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded border border-white/25 text-neutral-300 transition-colors hover:border-saffron-400 hover:text-saffron-300"
                  >
                    <SocialIcon platform={s.platform} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Registration / tax-exemption details */}
      <div className="border-t border-white/10">
        <dl className="container-page flex flex-wrap gap-x-8 gap-y-2 py-4 text-xs text-neutral-400">
          {content.compliance.map((c) => (
            <div key={c.label} className="flex gap-1.5">
              <dt className="font-semibold text-neutral-300">{c.label}:</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-saffron-500/60">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {/* Copyright line as written in the content document (Global Footer). */}
            <Copyright text={content.copyright} name={settings?.name ?? ""} url={settings?.orgUrl} />
            {settings?.developerName && (
              <>
                {" "}{settings.developerCreditPrefix ?? "Developed & Managed by"}{" "}
                {settings.developerUrl ? (
                  <a
                    href={settings.developerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-saffron-400 hover:underline"
                  >
                    {settings.developerName}
                  </a>
                ) : (
                  <span className="font-semibold text-saffron-400">{settings.developerName}</span>
                )}
              </>
            )}
          </p>
          {/* The organisation's name in Hindi, as before (client decision). */}
          {(settings?.nameHi || settings?.name) && (
            <p lang={langOf(settings.nameHi || settings.name)} className="text-neutral-400">
              {settings.nameHi || settings.name}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
