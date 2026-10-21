import Link from "next/link";

// Shown when a page calls notFound() (unknown pillar / event slug, etc.).
// Kept static so it renders even if the CMS is unavailable.
export default function NotFound() {
  return (
    <section className="border-b border-saffron-100 bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
      <div className="container-page py-16 text-center md:py-24">
        <p className="text-lg font-semibold text-saffron-700 md:text-xl">404</p>
        <h1 className="mt-1 text-3xl font-bold leading-snug tracking-tight text-ink md:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          The page you are looking for is not available or has been removed.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-saffron-400 to-saffron-500 px-7 py-3.5 text-base font-semibold text-ink shadow-lg shadow-saffron-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-saffron-500/35 active:translate-y-0"
          >
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
