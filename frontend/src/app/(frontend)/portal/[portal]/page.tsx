import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { logoutAction } from "@/lib/portal-actions";
import { PORTALS, getPortalUser, isPortal, type Portal } from "@/lib/portal-auth";

// Signed-in portal dashboard. Rendered per request, never cached: the session
// check runs at the top of the page (no <Suspense> above it), so a missing or
// wrong session is a real HTTP redirect to /login/<portal> before anything
// streams. `instant = false` allows this route to block on the server (Cache
// Components otherwise expects session reads behind <Suspense>).
export const instant = false;

type Params = Promise<{ portal: string }>;

const PLACEHOLDERS: Record<Portal, { heading: string; text: string }[]> = {
  pathology: [
    { heading: "Lab reports", text: "Your lab reports will appear here once report upload is enabled." },
  ],
  publication: [
    {
      heading: "Submissions & downloads",
      text: "Publication submissions and downloads will appear here once enabled.",
    },
  ],
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { portal } = await params;
  return {
    title: isPortal(portal) ? PORTALS[portal].portalTitle : undefined,
    robots: { index: false, follow: false },
  };
}

export default async function PortalPage({ params }: { params: Params }) {
  const { portal } = await params;
  if (!isPortal(portal)) notFound();

  const user = await getPortalUser();
  if (!user || user.portal !== portal) redirect(`/login/${portal}`);

  const config = PORTALS[portal];

  return (
    <>
      <section className="border-b border-saffron-100 bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
        <div className="container-page flex flex-col gap-5 py-10 sm:flex-row sm:items-end sm:justify-between md:py-14">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-saffron-700">{config.portalTitle}</p>
            <h1 className="mt-1 break-words text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
              Welcome, {user.name ?? user.email}
            </h1>
            {user.name && <p className="mt-1 text-sm text-ink-soft [overflow-wrap:anywhere] sm:whitespace-nowrap">{user.email}</p>}
          </div>

          <form action={logoutAction}>
            <input type="hidden" name="portal" value={portal} />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg border border-saffron-300 bg-white px-5 py-2.5 font-semibold text-saffron-700 shadow-sm transition-colors hover:bg-saffron-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600"
            >
              Log out
            </button>
          </form>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {PLACEHOLDERS[portal].map((card) => (
            <div key={card.heading} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-saffron-100 md:p-8">
              <h2 className="text-lg font-bold text-ink">{card.heading}</h2>
              <span aria-hidden className="mt-3 block h-1 w-10 rounded-full bg-saffron-500" />
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{card.text}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-sewablue-100 bg-sewablue-50 p-6 md:p-8">
            <h2 className="text-lg font-bold text-sewablue-800">Need help?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              For account or access questions, contact{" "}
              <a href="mailto:sewabhartijpr@gmail.com" className="whitespace-nowrap font-medium text-sewablue-700 hover:underline">
                sewabhartijpr@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
