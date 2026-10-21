// "Impact Philosophy" banner under the home stats band (copy: src/content/pages/home.ts).
import { HOME_IMPACT as DEFAULT_IMPACT } from "@/content/pages/home";

export default function ImpactBanner({ impact: HOME_IMPACT = DEFAULT_IMPACT }: { impact?: typeof DEFAULT_IMPACT }) {
  return (
    <section className="bg-gradient-to-r from-saffron-500 to-saffron-600">
      <div className="container-page flex flex-col items-center gap-3 py-10 text-center md:py-12">
        <span aria-hidden className="font-serif text-5xl leading-none text-ink/40">
          &ldquo;
        </span>
        <p className="text-2xl font-bold leading-snug text-ink md:text-3xl">
          {HOME_IMPACT.lead}
        </p>
        <p className="max-w-3xl text-base leading-relaxed text-ink/85 md:text-lg">
          {HOME_IMPACT.text}
        </p>
      </div>
    </section>
  );
}
