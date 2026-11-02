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
          <div className="mt-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            {v.photoUrl ? (
              <Image
                src={v.photoUrl}
                alt={v.name}
                width={112}
                height={112}
                unoptimized
                priority
                className="h-28 w-28 shrink-0 rounded-full object-cover shadow-md ring-4 ring-white"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-sewablue-700 text-4xl font-bold text-white shadow-md ring-4 ring-white"
              >
                {initials(v.name)}
              </span>
            )}
            <div>
              <h1 className="text-3xl font-bold leading-snug text-ink md:text-4xl">{v.name}</h1>
              {v.role && (
                <span className="mt-2 inline-block rounded-full bg-saffron-100 px-3 py-1 text-sm font-medium text-saffron-800">
                  <span lang="hi">{v.role.hi}</span> · {v.role.en}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {rows.length > 0 && (
        <section className="container-page max-w-3xl py-12">
          <h2 className="text-xl font-bold text-ink">
            <span lang="hi">विवरण</span> <span className="font-normal text-ink-soft">(Details)</span>
          </h2>
          <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
          <dl className="mt-6 divide-y divide-saffron-100 rounded-xl border border-saffron-100 bg-white">
            {rows.map((r) => (
              <div key={r.en} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <dt className="text-sm text-ink-soft">
                  <span lang="hi" className="font-medium text-ink">{r.hi}</span> ({r.en})
                </dt>
                <dd className="break-words text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
