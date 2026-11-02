import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVolunteerDetail } from "@/lib/volunteers";

// Volunteer profile from the dashboard details API
// (/api/content/volunteers/<uid>/). Only approved volunteers and only public
// fields (see src/lib/volunteers.ts); mobile, email and PAN are never shown.
//
// Under Cache Components generateStaticParams must return at least one param.
// Nothing is prerendered at build (a dashboard outage must not fail the
// build): the placeholder never matches a real uid (validated as a UUID) and
// renders notFound(); real profiles render on first request and are cached.
const PLACEHOLDER_UID = "__placeholder__";

// Unknown uids must answer with a real HTTP 404, so the volunteer is looked up
// before anything streams. Reading `params` outside <Suspense> needs this.
export const instant = false;

type Params = Promise<{ uid: string }>;

export async function generateStaticParams() {
  return [{ uid: PLACEHOLDER_UID }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const volunteer = await getVolunteerDetail((await params).uid);
  if (!volunteer) return {};
  return { title: `${volunteer.name} · Volunteer` };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

export default async function VolunteerProfilePage({ params }: { params: Params }) {
  const v = await getVolunteerDetail((await params).uid);
  if (!v) notFound();

  const period = [formatDate(v.startDate), formatDate(v.endDate)].filter(Boolean).join(" – ");
  const rows = [
    { hi: "मोबाइल", en: "Mobile", value: v.maskedMobile },
    { hi: "ई मेल", en: "Email", value: v.maskedEmail },
    { hi: "पैन", en: "PAN", value: v.maskedPan },
    { hi: "पद", en: "Designation", value: v.designation },
    { hi: "संस्थान", en: "Institute", value: v.institute },
    { hi: "शहर", en: "City", value: v.city },
    { hi: "रुचि", en: "Interest", value: v.interest },
    { hi: "सेवा अवधि", en: "Service period", value: period },
    { hi: "स्वयंसेवक कब से", en: "Volunteer since", value: formatDate(v.joinedAt) },
  ].filter((r) => r.value);

  return (
    <article>
      <section className="border-b border-saffron-100 bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
        <div className="container-page py-10 md:py-12">
          <Link
            href="/volunteer#volunteers"
            className="inline-flex items-center gap-1 text-sm font-medium text-sewablue-600 hover:underline"
          >
            <span aria-hidden>←</span> <span lang="hi">सभी स्वयंसेवक</span> (All volunteers)
          </Link>

          {/* Phone: profile block, then the QR card centred below.
              ≥md: profile block left, QR card right. */}
          <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            {/* Phone: photo above the name, centred. ≥sm: photo beside the name. */}
            <div className="flex min-w-0 flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              {v.photoUrl ? (
                <Image
                  src={v.photoUrl}
                  alt={v.name}
                  width={112}
                  height={112}
                  unoptimized
                  priority
                  className="h-24 w-24 shrink-0 rounded-full object-cover shadow-md ring-4 ring-white sm:h-28 sm:w-28"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-sewablue-700 text-3xl font-bold text-white shadow-md ring-4 ring-white sm:h-28 sm:w-28 sm:text-4xl"
                >
                  {initials(v.name)}
                </span>
              )}
              <div className="min-w-0 max-w-full">
                <h1 className="text-balance wrap-anywhere text-[clamp(1.75rem,1.2rem+2.4vw,2.5rem)] font-bold leading-snug text-ink">
                  {v.name}
                </h1>
                {v.role && (
                  <span className="mt-2 inline-block rounded-full bg-saffron-100 px-3 py-1 text-sm font-medium text-saffron-800">
                    <span lang="hi">{v.role.hi}</span> · {v.role.en}
                  </span>
                )}
                <div>
                  {/* Each label part stays on one line; the parts wrap as whole units. */}
                  <a
                    href={v.certificateUrl}
                    download
                    className="mt-4 inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-1.5 rounded-lg bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-ink shadow-md shadow-saffron-500/25 transition-colors hover:bg-saffron-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="self-center"
                    >
                      <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" />
                    </svg>
                    <span lang="hi" className="whitespace-nowrap">प्रमाण पत्र डाउनलोड करें</span>
                    <span className="whitespace-nowrap font-normal">(Download certificate)</span>
                  </a>
                </div>
              </div>
            </div>

            {v.qrCode && (
              <aside
                aria-labelledby="volunteer-qr-heading"
                className="mx-auto flex w-full max-w-xs flex-col items-center rounded-xl border border-saffron-100 bg-white p-4 text-center shadow-sm md:mx-0 md:w-72"
              >
                <h2 id="volunteer-qr-heading" className="text-balance text-sm font-bold text-ink">
                  <span lang="hi">क्यूआर कोड</span> <span className="font-normal text-ink-soft">(QR code)</span>
                </h2>
                {/* eslint-disable-next-line @next/next/no-img-element -- inline data URI from the API */}
                <img
                  src={v.qrCode}
                  alt={`QR code for ${v.name}'s volunteer profile`}
                  width={160}
                  height={160}
                  className="mt-3 aspect-square w-40 max-w-full [image-rendering:pixelated]"
                />
                <p className="mt-2 text-balance text-xs text-ink-soft">
                  <span lang="hi" className="block">स्कैन करके यह प्रोफ़ाइल खोलें</span>
                  Scan to open this profile
                </p>
                <a
                  href={v.qrCode}
                  download={`volunteer-${v.uid}-qr.png`}
                  className="mt-3 flex w-full flex-wrap items-baseline justify-center gap-x-1.5 rounded-lg border border-saffron-300 bg-white px-3 py-2 text-sm font-semibold text-saffron-700 transition-colors hover:bg-saffron-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600"
                >
                  <span lang="hi" className="whitespace-nowrap">क्यूआर डाउनलोड करें</span>
                  <span className="whitespace-nowrap font-normal">(Download QR)</span>
                </a>
              </aside>
            )}
          </div>
        </div>
      </section>

      {rows.length > 0 && (
        <section className="container-page max-w-4xl py-10 md:py-12">
          <h2 className="text-xl font-bold text-ink">
            <span lang="hi">विवरण</span> <span className="font-normal text-ink-soft">(Details)</span>
          </h2>
          <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
          {/* Phone: label above value. ≥sm: label | value columns. */}
          <dl className="mt-6 divide-y divide-saffron-100 rounded-xl border border-saffron-100 bg-white">
            {rows.map((r) => (
              <div key={r.en} className="grid gap-1 px-4 py-3.5 sm:grid-cols-[minmax(9rem,13rem)_minmax(0,1fr)] sm:gap-4 sm:px-5">
                <dt className="text-pretty text-sm text-ink-soft">
                  <span lang="hi" className="font-medium text-ink">{r.hi}</span> ({r.en})
                </dt>
                {/* wrap-anywhere: long emails or words break instead of overflowing. */}
                <dd className="min-w-0 text-pretty wrap-anywhere text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
