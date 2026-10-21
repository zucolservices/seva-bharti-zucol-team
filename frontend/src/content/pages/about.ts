// About page copy. Header, vision and the Secretary's message come from the
// client's content document (section 3), verbatim. Mission and the
// organisational structure are translated from the live site
// (sewabhartirajasthan.org/about.php), because the document has no text for them.

export const ABOUT_HEADER = {
  /** Browser-tab title (unless the CMS sets an SEO title). */
  metaTitle: "About Us",
  eyebrow: "About Us · The Cycle of Service",
  title: "A Chain Reaction of Compassion and Capability",
};

export const ABOUT_VISION = {
  heading: "Our Vision",
  paragraphs: [
    "Rooted in the profound ethos of Nar Sewa, Narayan Sewa, Sewa Bharti Samiti Rajasthan goes beyond traditional charity. “Together We Can” is the driving force behind our mission to transform marginalized communities into self-sustaining ecosystems of support.",
    "We believe that true social transformation is achieved only when an individual, once empowered by society, feels a deep moral responsibility to give back.",
  ],
};

export const ABOUT_MESSAGE = {
  heading: "Message from the Secretary",
  quote: [
    "When we extend support—whether by providing a scholarship to a child from a nomadic community or securing critical rehabilitation for a patient—we are not just addressing an immediate need; we are investing in a future leader.",
    "By integrating the profound, character-building concepts of our ancient Gurukul traditions into modern welfare, we forge capable, self-reliant citizens who remember their roots.",
    "‘Together We Can’ means that as our family grows, the individuals who once walked through our doors seeking guidance will eventually walk out as our strongest pillars, ready to serve the next generation.",
  ],
  // Not in the content document; add the Secretary's name here once supplied.
  byline: null as string | null,
};

export const ABOUT_MISSION = {
  heading: "Mission",
  paragraphs: [
    "To uplift the socially, educationally and economically backward, deprived and neglected members of society, making them self-reliant, self-respecting and self-sufficient, and thereby to build a healthy, harmonious and organised society.",
    "To run all service activities without any discrimination of sect, caste, class, region, language or belief, and to foster faith in and devotion to the spirit of the nation; and to extend every possible help during natural calamities such as floods, earthquakes, droughts, fires and epidemics.",
  ],
};

export const ABOUT_STRUCTURE = {
  heading: "Organizational Structure",
  paragraphs: [
    "For administrative purposes, the 33 districts of Rajasthan are organised into 3 Prants, 20 Vibhags, 71 districts and 7 metropolitan units, with committees and sub-committees formed at every block and tehsil centre. All registered committees of the divisions and districts are affiliated. There are 1,431 Sewa Bastis in the cities, and in rural areas every village has been designated as the last unit of work.",
    "Regular meetings at every level, training camps and regular visits by office-bearers ensure that the work and the Karyakartas are properly supported.",
  ],
};
