// "Our Work" copy from the client's content document (section 4), verbatim.
// Keyed by pillar (see src/content/pillars.ts); used on /our-work and on each
// pillar page.
import type { PillarKey } from "@/content/pillars";

export const WORK_HEADER = {
  eyebrow: "Our Work",
  title: "From Beneficiaries to Benefactors: Our Core Initiatives",
};

export const WORK_PILLARS: Record<PillarKey, { tagline: string; text: string }> = {
  shiksha: {
    tagline: "Educating the Mentors of Tomorrow.",
    text: "We blend modern learning with classical Sanskrit shlokas and ethical teachings, ensuring students develop strong moral foundations. The child who receives educational support today is groomed to become the guiding light for their community tomorrow.",
  },
  swasthya: {
    tagline: "Healing to Rebuild Communities.",
    text: "Our medical camps and specialized care units do more than treat ailments; they restore dignity. We heal the individual today so they can return to being the strong, resilient support system their society needs.",
  },
  swavalamban: {
    tagline: "Empowering the Next Generation of Creators.",
    text: "Through dedicated skill development programs—such as collaborative RSLDC skill initiatives and academic internships—we foster entrepreneurship. The youth who learn a trade with us today are empowered to open doors and train others in their villages in the years to come.",
  },
  samajik: {
    tagline: "United in Purpose.",
    text: "We bridge social divides by preserving our shared cultural heritage, including traditional arts and folk songs, creating a harmonious environment where the marginalized are elevated to lead grassroots welfare efforts.",
  },
};

export const WORK_CTA_LABEL = "Learn More";
