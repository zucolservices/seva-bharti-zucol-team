import VolunteerGrid from "@/components/VolunteerGrid";
import { getVolunteers, VOLUNTEERS_PAGE_SIZE } from "@/lib/volunteers";

/**
 * "Our Volunteers" section: approved volunteers from the dashboard API, with a
 * "Show more" button for the rest. Renders nothing when there are none (or the
 * API is down).
 */
export default async function VolunteerList() {
  const { volunteers, total, hasNext } = await getVolunteers(1, VOLUNTEERS_PAGE_SIZE);

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
      <VolunteerGrid initial={volunteers} initialHasNext={hasNext} />
    </section>
  );
}
