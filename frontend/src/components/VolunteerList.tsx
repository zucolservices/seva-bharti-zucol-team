import Image from "next/image";
import Link from "next/link";
import { getVolunteers, ROLE_LABELS } from "@/lib/volunteers";

export const VOLUNTEERS_PAGE_SIZE = 12;

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

/**
 * "Our Volunteers" section: approved volunteers from the dashboard, as a card
 * grid with ?page= pagination. Renders nothing when there are none (or the API
 * is down).
 */
export default async function VolunteerList({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const raw = Number((await searchParams).page);
  const page = Number.isInteger(raw) && raw > 1 ? raw : 1;
  const { volunteers, total, hasNext } = await getVolunteers(page, VOLUNTEERS_PAGE_SIZE);

  if (volunteers.length === 0) return null;

  return (
    <section id="volunteers" className="container-page scroll-mt-24 py-12 md:py-14">
      <h2 className="text-2xl font-bold text-ink md:text-3xl">
        <span lang="hi">हमारे स्वयंसेवक</span> <span className="font-normal text-ink-soft">(Our Volunteers)</span>
      </h2>
      <span aria-hidden className="mb-6 mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
      <p className="text-sm text-ink-soft">
        <span lang="hi">कुल स्वयंसेवक</span> (Total volunteers): <strong className="text-ink">{total}</strong>
      </p>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {volunteers.map((v) => {
          const role = ROLE_LABELS[v.roleType];
          return (
            <li key={v.uid} className="flex items-center gap-4 rounded-xl border border-saffron-100 bg-white p-4 shadow-sm">
              {v.photoUrl ? (
                <Image
                  src={v.photoUrl}
                  alt={v.name}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sewablue-700 text-lg font-bold text-white"
                >
                  {initials(v.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{v.name}</p>
                {v.designation && <p className="truncate text-sm text-ink-soft">{v.designation}</p>}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  {role && (
                    <span className="rounded-full bg-saffron-100 px-2 py-0.5 font-medium text-saffron-800">
                      <span lang="hi">{role.hi}</span> · {role.en}
                    </span>
                  )}
                  {v.city && <span className="text-ink-soft">{v.city}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {(page > 1 || hasNext) && (
        <nav aria-label="Volunteer list pages" className="mt-6 flex items-center justify-center gap-3 text-sm">
          {page > 1 && (
            <Link
              href={page === 2 ? "/volunteer#volunteers" : `/volunteer?page=${page - 1}#volunteers`}
              className="rounded-lg border border-saffron-300 bg-white px-4 py-2.5 font-semibold text-saffron-700 transition-colors hover:bg-saffron-50"
            >
              ← <span lang="hi">पिछला</span> (Previous)
            </Link>
          )}
          <span className="text-ink-soft">Page {page}</span>
          {hasNext && (
            <Link
              href={`/volunteer?page=${page + 1}#volunteers`}
              className="rounded-lg border border-saffron-300 bg-white px-4 py-2.5 font-semibold text-saffron-700 transition-colors hover:bg-saffron-50"
            >
              <span lang="hi">अगला</span> (Next) →
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
