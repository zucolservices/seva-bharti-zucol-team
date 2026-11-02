import { connection } from "next/server";
import VolunteerGrid from "@/components/VolunteerGrid";
import { getVolunteers, VOLUNTEERS_PAGE_SIZE } from "@/lib/volunteers";

/**
 * "Our Volunteers" section: approved volunteers from the dashboard API, with a
 * "Show more" button for the rest. Renders nothing when there are none (or the
 * API is down).
 *
 * Rendered on every request (connection()) inside the page's <Suspense>, so a
 * volunteer approved in the dashboard shows on the next normal page load; the
 * rest of the page stays a static shell.
 */
export default async function VolunteerList() {
  await connection();
  const { volunteers, total, hasNext } = await getVolunteers(1, VOLUNTEERS_PAGE_SIZE);

  if (volunteers.length === 0) return null;

  return (
    <section id="volunteers" className="scroll-mt-24 border-t border-saffron-100">
      <div className="container-page py-12 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 className="text-2xl font-bold text-ink md:text-3xl">
              <span lang="hi">हमारे स्वयंसेवक</span> <span className="font-normal text-ink-soft">(Our Volunteers)</span>
            </h2>
            <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-saffron-500" />
          </div>
          <p className="rounded-full bg-saffron-50 px-3 py-1 text-sm text-ink-soft ring-1 ring-saffron-100">
            <span lang="hi">कुल स्वयंसेवक</span> (Total volunteers): <strong className="text-ink">{total}</strong>
          </p>
        </div>
        {/* The grid keeps its own list state (for "Show more"); the key remounts it
            when a refresh brings a different list, so new volunteers appear. */}
        <VolunteerGrid
          key={`${total}:${volunteers.map((v) => v.uid).join(",")}`}
          initial={volunteers}
          initialHasNext={hasNext}
        />
      </div>
    </section>
  );
}
