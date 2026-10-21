// "Impact Philosophy" banner under the home stats band (copy: src/content/pages/home.ts).
import { HOME_IMPACT } from "@/content/pages/home";

export default function ImpactBanner() {
  return (
    <section className="bg-gradient-to-r from-saffron-500 to-saffron-600">
      <div className="container-page flex flex-col items-center gap-3 py-10 text-center md:py-12">
        <span aria-hidden className="font-serif text-5xl leading-none text-white/50">
          &ldquo;
        </span>
        <p lang="hi" className="text-2xl font-bold leading-snug text-white md:text-3xl">
          {HOME_IMPACT.lead}
        </p>
        <p lang="hi" className="max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
          {HOME_IMPACT.text}
        </p>
      </div>
    </section>
  );
}
