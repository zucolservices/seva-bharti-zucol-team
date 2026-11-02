import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getVolunteerDetail } from "@/lib/volunteers";

// Volunteer profile from the dashboard details API
// (/api/content/volunteers/<uid>/). Only approved volunteers; mobile and email
// are shown masked, PAN is never shown (see src/lib/volunteers.ts).
//
// Under Cache Components generateStaticParams must return at least one param.
// Nothing is prerendered at build (a dashboard outage must not fail the
// build): the placeholder never matches a real uid (validated as a UUID) and
// renders notFound(). Real profiles render on every request (connection()),
// so dashboard edits and approvals show at once.
const PLACEHOLDER_UID = "__placeholder__";

// Unknown uids must answer with a real HTTP 404, so the volunteer is looked up
// before anything streams. Reading `params` outside <Suspense> needs this.
export const instant = false;

type Params = Promise<{ uid: string }>;

export async function generateStaticParams() {
  return [{ uid: PLACEHOLDER_UID }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  await connection();
  const volunteer = await getVolunteerDetail((await params).uid);
  if (!volunteer) return {};
  return { title: `${volunteer.name} · Volunteer` };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // Non-breaking spaces keep each date on one line; a range wraps only at the dash.
  return d
    .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
    .replace(/ /g, " ");
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

export default async function VolunteerProfilePage({ params }: { params: Params }) {
  await connection();
  const v = await getVolunteerDetail((await params).uid);
  if (!v) notFound();

  const period = [formatDate(v.startDate), formatDate(v.endDate)].filter(Boolean).join(" – ");
  const rows = [
    { hi: "मोबाइल", en: "Mobile", value: v.maskedMobile },
    { hi: "ई मेल", en: "Email", value: v.maskedEmail },
    { hi: "पद", en: "Designation", value: v.designation },
    { hi: "संस्थान", en: "Institute", value: v.institute },
    { hi: "शहर", en: "City", value: v.city },
    { hi: "रुचि", en: "Interest", value: v.interest },
    { hi: "सेवा अवधि", en: "Service period", value: period },
    { hi: "स्वयंसेवक कब से", en: "Volunteer since", value: formatDate(v.joinedAt) },
  ].filter((r) => r.value);

  return (
    <article className="border-b border-saffron-100 bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
      <div className="container-page py-6 md:py-8">
        <Link
          href="/volunteer#volunteers"
          className="inline-flex items-center gap-1 text-sm font-medium text-sewablue-600 hover:underline"
        >
          <span aria-hidden>←</span> <span lang="hi">सभी स्वयंसेवक</span> (All volunteers)
        </Link>

        <div className="mt-4">
          <div className="@container min-w-0">
            {/* Phone: photo above the name, centred. ≥sm: photo beside the name. */}
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              {v.photoUrl ? (
                <Image
                  src={v.photoUrl}
                  alt={v.name}
                  width={96}
                  height={96}
                  unoptimized
                  priority
                  className="h-20 w-20 shrink-0 rounded-full object-cover shadow-md ring-4 ring-white sm:h-24 sm:w-24"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-sewablue-700 text-3xl font-bold text-white shadow-md ring-4 ring-white sm:h-24 sm:w-24"
                >
                  {initials(v.name)}
                </span>
              )}
              <div className="min-w-0 max-w-full">
                <h1 className="text-balance wrap-anywhere text-[clamp(1.5rem,1.1rem+2vw,2.25rem)] font-bold leading-tight text-ink">
                  {v.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {v.role && (
                    <span className="rounded-full bg-saffron-100 px-3 py-1 text-sm font-medium text-saffron-800">
                      <span lang="hi">{v.role.hi}</span> · {v.role.en}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {rows.length > 0 && (
              <section aria-labelledby="volunteer-details-heading" className="mt-6">
                <h2 id="volunteer-details-heading" className="text-lg font-bold text-ink">
                  <span lang="hi">विवरण</span> <span className="font-normal text-ink-soft">(Details)</span>
                </h2>
                {/* Wrapping rows: each cell is at least 9.5rem or 30% of the column,
                    so ~2 per row on phones and 3 on desktop. Cells grow to fill a
                    short last row, so no empty slot is left. The 1px gaps over the
                    border colour draw the dividers. */}
                <dl className="mt-3 flex flex-wrap gap-px overflow-hidden rounded-xl border border-saffron-100 bg-saffron-100">
                  {rows.map((r) => (
                    <div key={r.en} className="min-w-0 grow basis-[max(9.5rem,30%)] bg-white px-3 py-2.5 sm:px-4">
                      <dt className="text-pretty text-xs text-ink-soft">
                        <span lang="hi" className="font-medium text-ink">{r.hi}</span> ({r.en})
                      </dt>
                      {/* wrap-anywhere: long emails or words break instead of overflowing. */}
                      <dd className="mt-0.5 text-pretty wrap-anywhere font-medium text-ink">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

        </div>
      </div>
    </article>
  );
}
