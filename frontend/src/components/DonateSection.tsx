// Donation section above the footer — same layout as the live site
// (sewabhartirajasthan.org), in English: appeal heading, ways to help + 80G
// note + contact on the left, the bank-details card (photo background) on the
// right. Copy: src/content/pages/home.ts; assets live in public/home/.
import Image from "next/image";
import SocialIcon, { socialLabels } from "@/components/SocialIcon";
import { HOME_DONATE as DEFAULT_DONATE } from "@/content/pages/home";
import { FOOTER_SOCIALS } from "@/content/pages/footer";

/** The organisation's main website (globe icon in the contact box). */
const WEBSITE_URL = "https://sewabhartirajasthan.org/";

// Same social links as the footer (src/content/pages/footer.ts).
const SOCIALS = FOOTER_SOCIALS.map((s) => ({ platform: s.platform, href: s.url, label: socialLabels[s.platform] }));

export default function DonateSection({ donate: d = DEFAULT_DONATE }: { donate?: typeof DEFAULT_DONATE }) {
  return (
    <section id="donate" className="scroll-mt-28 bg-[url('/home/bg-vission.webp')] bg-cover bg-center bg-no-repeat">
      <div className="container-wide py-8 md:py-10 2xl:py-12">
        {/* Fills the first line; only the last few words go to a second line
            (text-pretty, not balance), so the whole section fits one screen. */}
        <h2 className="text-xl font-bold leading-snug text-pretty text-saffron-700 md:text-2xl xl:text-[1.6rem]">{d.heading}</h2>
        <div aria-hidden className="mt-4 flex max-w-xs items-center gap-3">
          <span className="h-px flex-1 bg-saffron-400" />
          <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-saffron-500" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-saffron-400" />
        </div>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          {/* Ways to help, 80G note, contact */}
          <div className="text-ink-soft">
            <h3 className="text-xl font-bold leading-snug text-ink md:text-2xl">{d.waysHeading}</h3>
            <ul className="mt-3 list-disc space-y-0.5 pl-5 text-[15px] leading-normal marker:text-ink-soft">
              {d.ways.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>

            <p className="mt-5 text-base font-bold leading-snug text-ink md:text-[17px]">{d.taxNote}</p>

            <div className="mt-4 text-[15px] leading-normal">
              <p>{d.contactHeading}:</p>
              <address className="not-italic">
                {d.contactLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>

          {/* Bank details card on a photo background */}
          <div className="relative overflow-hidden rounded-2xl bg-[url('/home/card-bg-1.webp')] bg-cover bg-center shadow-sm">
            {/* The photo is already faded (as on the live site), so no extra overlay. */}
            <div className="relative p-6 md:px-8 md:py-7">
              <Image src="/home/donate-img.png" alt={d.imageAlt} width={392} height={106} className="h-auto w-56 md:w-64" />

              <h3 className="mt-5 text-xl font-bold text-ink">{d.bankHeading}:</h3>
              <dl className="mt-2 space-y-0.5 text-base leading-relaxed text-ink-soft">
                {d.bank.map((b) => (
                  <div key={b.label}>
                    <dt className="inline">{b.label} :- </dt>
                    <dd className="inline font-bold text-ink">{b.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-saffron-500 px-5 py-3 md:px-6">
                <div className="space-y-1 text-base text-ink">
                  <a href="tel:+911412740799" className="flex items-center gap-2 hover:text-saffron-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                      <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
                    </svg>
                    0141 2740799
                  </a>
                  <a href="mailto:sewabhartijpr@gmail.com" className="flex items-center gap-2 break-all hover:text-saffron-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
                    </svg>
                    sewabhartijpr@gmail.com
                  </a>
                </div>
                <ul className="flex items-center gap-2.5">
                  <li>
                    <a
                      href={WEBSITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Sewa Bharti Rajasthan website"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-colors hover:text-saffron-700"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.6 8.2 12S9.5 18.4 12 21" strokeLinecap="round" />
                      </svg>
                    </a>
                  </li>
                  {SOCIALS.map((s) => (
                    <li key={s.platform}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-colors hover:text-saffron-700"
                      >
                        <SocialIcon platform={s.platform} size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not linked: the live site's donation page should not be opened from here. */}
              <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-saffron-500 px-6 py-3.5 text-center text-base font-semibold text-ink shadow-sm">
                {d.onlineDonation}
                {/* Hand-with-coin "donation" mark, as on the live site's button. */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                  <path d="M12.6 2.2h-1.2v1.1c-1.3.2-2.2 1.1-2.2 2.3 0 1.4 1.1 2 2.4 2.3 1 .2 1.4.5 1.4 1s-.5.9-1.2.9c-.8 0-1.3-.4-1.4-1H9.1c.1 1.2 1 2 2.3 2.2V12h1.2v-1c1.3-.2 2.2-1 2.2-2.3 0-1.5-1.2-2-2.5-2.3-.9-.2-1.3-.4-1.3-.9 0-.4.4-.8 1.1-.8s1.1.4 1.2.9h1.3c-.1-1.1-.9-1.9-2-2.1V2.2Z" />
                  <path d="M2 15.5c0-.6.4-1 1-1h2.6c.5 0 1 .2 1.4.4l1.8 1.1h3.9c.8 0 1.4.6 1.4 1.3 0 .8-.6 1.4-1.4 1.4H9.9v.8h3.9c.6 0 1.1-.2 1.5-.6l3.4-2.9c.5-.4 1.3-.4 1.8.1.5.5.5 1.3 0 1.8l-3.6 3.7c-.8.8-1.8 1.2-2.9 1.2H3c-.6 0-1-.4-1-1v-5.3Z" />
                </svg>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
