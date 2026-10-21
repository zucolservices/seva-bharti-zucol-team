// Home quotes carousel copy (QuoteCarousel), from the live site
// (sewabhartirajasthan.org, the CTA banners). Kept apart from home.ts because
// QuoteCarousel is a client component: importing home.ts would ship all of the
// home copy (donate / bank details) in the client bundle.

export type HomeQuote = {
  photo: string;
  quote: string;
  tagline?: string;
  name: string;
  role?: string;
};

/** Quotes carousel — QuoteCarousel. Portraits live in public/home/. */
export const HOME_QUOTES: HomeQuote[] = [
  // Kept in the original Hindi, word for word as on the live site (client decision).
  {
    photo: "/home/quote-vivekanand.png",
    quote:
      "जब तक लाखों लोग भूखे और अज्ञानी हैं, तब तक मैं उस व्यक्ति को कृतघ्न मानता हूँ जो उनके बल पर शिक्षित बना और अब उनकी ओर ध्यान नहीं देता है।",
    tagline: "“I dream of a strong and prosperous Bharat”",
    name: "स्वामी विवेकानन्द",
    role: "महान युवा सन्यासी",
  },
  {
    photo: "/home/quote-hedgewar.png",
    quote: "इस समाज को जागृत एवं सुसंघटित करना ही राष्ट्र का जागरण एवं संघटन है। यही राष्ट्र कार्य है।",
    name: "Dr. Keshav Baliram Hedgewar",
  },
  {
    photo: "/home/quote-guruji.png",
    quote:
      "सेवा करने का वास्तविक अर्थ है – हृदय की शुद्धि; अहंभावना का विनाश; सर्वत्र ईश्वरत्व की अनुभूति तथा शांति की प्राप्ति।",
    name: "Shri Guruji Madhav Sadashiv Golwalkar",
  },
];

export const HOME_QUOTES_LABELS = {
  carousel: "Inspiring thoughts",
  /** Dot button label; `{n}` = slide number, `{name}` = person. */
  dot: "Quote {n}: {name}",
  /** Auto-advance toggle (WCAG 2.2.2). */
  pause: "Pause quotes",
  play: "Play quotes",
};
