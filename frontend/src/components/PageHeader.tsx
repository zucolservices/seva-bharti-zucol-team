import { langOf } from "@/lib/view-types";

interface PageHeaderProps {
  title?: string | null;
  /** Small line shown above the title. */
  eyebrow?: string | null;
  subtitle?: string | null;
  /** Optional button shown at the top right (below the text on mobile). */
  action?: React.ReactNode;
}

// Shared hero band for inner pages. Content-only; no fabricated claims.
export default function PageHeader({ title, eyebrow, subtitle, action }: PageHeaderProps) {
  return (
    <section className="border-b border-saffron-100 bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
      <div className="container-page flex flex-col gap-6 py-12 md:flex-row md:items-start md:justify-between md:py-16">
        <div>
          {eyebrow && (
            <p lang={langOf(eyebrow)} className="text-lg font-semibold text-saffron-700 md:text-xl">
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 lang={langOf(title)} className="mt-1 text-3xl font-bold leading-snug tracking-tight text-ink md:text-4xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p lang={langOf(subtitle)} className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}
