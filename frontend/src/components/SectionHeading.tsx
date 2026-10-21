import { langOf } from "@/lib/view-types";

// Formal section heading with an accent underline — authoritative, consistent.
// Renders nothing when the CMS heading is empty.
export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow?: string | null;
  title?: string | null;
  align?: "left" | "center";
}) {
  if (!title && !eyebrow) return null;
  const centered = align === "center";
  // A label that only repeats the heading (e.g. "Overview" / "Overview") is noise.
  if (eyebrow && title && eyebrow.trim().toLowerCase() === title.trim().toLowerCase()) eyebrow = null;
  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && (
        <p lang={langOf(eyebrow)} className="text-xs font-semibold uppercase tracking-[0.15em] text-sewablue-600">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 lang={langOf(title)} className="mt-1 text-2xl font-bold text-ink md:text-3xl">
          {title}
        </h2>
      )}
      <span
        className={`mt-3 block h-1 w-16 rounded-full bg-saffron-500 ${
          centered ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
