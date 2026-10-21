// Home page copy from the client's content document (section 1 & 2), verbatim.
// Source: context/2.0/WEBSITE_CONTENT.md.
import type { PillarKey } from "@/content/pillars";

export const HOME_HERO = {
  title: "Together We Can: Empowering Today, Inspiring Tomorrow",
  intro:
    "Through the spirit of collective effort, we are building a self-reliant Rajasthan where those who receive a helping hand today become the hands that uplift others tomorrow.",
};

/** "Impact Philosophy" banner shown under the stats band. */
export const HOME_IMPACT = {
  lead: "Relief is temporary; true empowerment is eternal.",
  text: "Join us in breaking the cycle of dependency. We envision a society where every individual we support steps forward in the future as a dedicated Karyakarta, ready to serve the nation.",
};

export const HOME_PILLARS_HEADING = {
  title: "The Four Pillars of Transformation",
};

/** One-line card text per pillar (overrides the CMS summary on the home grid). */
export const HOME_PILLAR_LINES: Record<PillarKey, string> = {
  shiksha: "Cultivating future mentors through values-based education.",
  swasthya: "Healing individuals so they can become the strength of their families.",
  swavalamban: "Skilling the youth to become tomorrow's job creators.",
  samajik: "Uniting communities to lead their own grassroots welfare.",
};

/**
 * Events teaser: the original Hindi seed wording is swapped for English; any
 * other text set in the CMS (Home Page → Events Teaser) is shown as-is.
 */
export const HOME_EVENTS_TEASER_OVERRIDES = {
  title: { cms: ["सेवा गतिविधियाँ", "कुछ सेवा गतिविधियाँ"], text: "Sewa Activities" },
  cta: { cms: ["कार्यक्रम देखें", "बाकी सभी सेवा गतिविधियाँ यहाँ देखें"], text: "View All Sewa Activities" },
};

export function overrideSeedText(
  value: string | null | undefined,
  override: { cms: readonly string[]; text: string },
): string | null | undefined {
  const v = value?.trim().toLowerCase();
  return v && override.cms.some((c) => c.toLowerCase() === v) ? override.text : value;
}

// ---- Static sections copied from the live site (sewabhartirajasthan.org) ----
// Translated from the Hindi originals. A paragraph is a list of segments;
// `{ hl }` segments are highlighted in saffron.

export type Segment = string | { hl: string };

/** "Our Objective" block (with the Sewa Geet image) — MissionVision. */
export const HOME_OBJECTIVE = {
  heading: "Our Objective",
  /** Image beside the text (CMS: Page Content → Home → Our Objective → image). */
  image: "/home/sewa-geet-bg-01.png",
  paragraphs: [
    [
      "To uplift the socially, educationally and economically backward, deprived and neglected members of society, making them ",
      { hl: "self-reliant, self-respecting and self-sufficient" },
      ", and thereby to build a healthy, harmonious and organised society.",
    ],
    [
      "To run all service activities without any discrimination of sect, caste, class, region, language or belief, and ",
      { hl: "to foster faith in and devotion to the spirit of the nation." },
      " To extend every possible help during natural calamities such as floods, earthquakes, droughts, fires and epidemics.",
    ],
  ] as Segment[][],
  structureHeading: "Organisational and Administrative Structure",
  structureParagraphs: [
    [
      "The registered office of Sewa Bharti Samiti Rajasthan is at Sewa Sadan, Lal Kothi Scheme, Sahkar Marg, Sahkar Lane, Jaipur-302015. ",
      { hl: "It is registered with the Registration Department of Rajasthan under Registration No. 106/Rajasthan 1987-88, dated 16 July 1987." },
      " Its exemption under Section 80G of the Income Tax Act continues under order no. Commissioner (Recovery) 80G/831/2007-2008, dated 24-8-2007. The organisation’s PAN is AABTS4114N.",
    ],
    [
      "For administrative purposes, the 33 districts of Rajasthan are organised into 3 Prants, 20 Vibhags, 71 districts and 7 metropolitan units, with committees and sub-committees formed at every block and tehsil centre. All registered committees of the divisions and districts are affiliated. There are 1,431 Sewa Bastis in the cities, and in rural areas every village has been designated as the last unit of work.",
    ],
    [
      "Regular meetings at every level, training camps and regular visits by office-bearers ensure that the work and the Karyakartas are properly supported.",
    ],
  ] as Segment[][],
  imageAlt: "Sewa Geet — Sewa Bharti Rajasthan",
};

/** "Vision" block — MissionVision. */
export const HOME_VISION = {
  heading: "Vision",
  paragraph: [
    "The making of a strong and empowered society is possible only when each of its sections gets equal rights to growth and opportunity. ",
    { hl: "A homogeneous society can be created by making educated, suppressed, and backward brethren self-supporting and empowered." },
    " Sewa Bharati works tirelessly and relentlessly towards the realization of this vision",
  ] as Segment[],
  appeal:
    "“Sewa” is the first step of devotion to God and the visible form of devotion to the nation. Please support this work according to your means.",
  imageAlt: "Children at a Sewa Bharti programme",
};

/** Donation section above the footer — DonateSection. */
export const HOME_DONATE = {
  heading:
    "“Sewa” is the first step of devotion to God and the visible form of devotion to the nation. Please support this work according to your means.",
  waysHeading: "We are servants of humanity; service is our dharma.",
  ways: [
    "By providing study materials and uniforms for students, and clothing and medicines for those in need.",
    "By offering a Mangal Nidhi (an auspicious contribution) on happy occasions in your family.",
    "By giving your time to service activities and the organisation.",
    "By joining service activities as a Vanaprasthi, in the retired stage of life.",
    "By becoming the patron (Palak) of a service project.",
    "By subscribing to the monthly magazine Nav Sewa Saroj (circulation 10,000) — annual membership ₹100, fifteen-year membership ₹1,000 — or by advertising in the magazine.",
    "By contributing to the Sewa Nidhi by cheque in the name of “Sewa Bharti Samiti Rajasthan” or by depositing the amount in our bank account, then sending a photocopy of the bank’s deposit receipt, with your name, address, mobile number, PAN and postal PIN code, to the Sewa Bharti Samiti Rajasthan office, so that an acknowledgement receipt can be sent to you.",
  ],
  taxNote:
    "Contributions to Sewa Bharti Samiti Rajasthan are exempt from income tax under Section 80G of the Income Tax Act, 1961.",
  contactHeading: "Contact",
  contactLines: ["Sewa Bharti Samiti Rajasthan", "Sewa Sadan, Sahkar Marg, Lal Kothi Scheme, Jaipur-302015"],
  bankHeading: "Bank Details for Donations",
  bank: [
    { label: "Bank Name", value: "State Bank of India, Jyoti Nagar, Jaipur" },
    { label: "Account Name", value: "Sewa Bharti Samiti Rajasthan, Jaipur" },
    { label: "Account No.", value: "61041857746" },
    { label: "IFSC Code", value: "SBIN0010548" },
  ],
  imageAlt: "Donate",
  onlineDonation: "Online Donation Now Click here",
};
