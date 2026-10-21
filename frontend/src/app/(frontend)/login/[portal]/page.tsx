import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import PortalLoginForm from "@/components/PortalLoginForm";
import { PORTALS, PORTAL_SLUGS, getPortalUser, isPortal, type Portal } from "@/lib/portal-auth";

// /login/pathology and /login/publication. Both are prerendered (static
// shell with the form); the "already signed in?" check reads the cookie at
// request time behind <Suspense>. Any other value is a real 404 (notFound()
// runs before any Suspense boundary). Reading `params` outside <Suspense> is
// what makes that 404 possible, so the route opts out of instant-navigation
// validation; the two known portals are still prerendered via
// generateStaticParams.
export const instant = false;

type Params = Promise<{ portal: string }>;

export function generateStaticParams() {
  return PORTAL_SLUGS.map((portal) => ({ portal }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { portal } = await params;
  if (!isPortal(portal)) return { robots: { index: false, follow: false } };
  return {
    title: PORTALS[portal].title,
    description: PORTALS[portal].blurb,
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params }: { params: Params }) {
  const { portal } = await params;
  if (!isPortal(portal)) notFound();
  const config = PORTALS[portal];

  return (
    <section className="bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
      <Suspense fallback={null}>
        <RedirectIfSignedIn portal={portal} />
      </Suspense>

      <div className="container-page flex justify-center py-12 md:py-20">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-saffron-100 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-saffron-700">Sewa Bharti</p>
          <h1 className="mt-1 text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
            {config.title}
          </h1>
          <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-saffron-500" />
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{config.blurb}</p>

          <div className="mt-6">
            <PortalLoginForm portal={portal} />
          </div>

          <p className="mt-6 border-t border-saffron-100 pt-5 text-sm leading-relaxed text-ink-soft">
            Accounts are created by Sewa Bharti administrators. Forgot your password? Contact{" "}
            <a
              href="mailto:sewabhartijpr@gmail.com"
              className="whitespace-nowrap font-medium text-sewablue-700 hover:underline"
            >
              sewabhartijpr@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

/** Already signed in to this portal → go straight to it (client-side redirect, mid-stream). */
async function RedirectIfSignedIn({ portal }: { portal: Portal }) {
  const user = await getPortalUser();
  if (user && user.portal === portal) redirect(`/portal/${portal}`);
  return null;
}
