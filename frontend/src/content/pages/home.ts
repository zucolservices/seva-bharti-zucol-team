// Home page copy from the client's content document (section 1 & 2),
// translated into Hindi. Source: context/2.0/WEBSITE_CONTENT.md.
import type { PillarKey } from "@/content/pillars";

export const HOME_HERO = {
  title: "साथ मिलकर हम कर सकते हैं: आज का सशक्तिकरण, कल की प्रेरणा",
  intro:
    "सामूहिक प्रयास की भावना से हम एक आत्मनिर्भर राजस्थान का निर्माण कर रहे हैं, जहाँ आज जिन्हें सहारे का हाथ मिलता है, वही कल दूसरों को ऊपर उठाने वाले हाथ बनते हैं।",
};

/** "Impact Philosophy" banner shown under the stats band. */
export const HOME_IMPACT = {
  lead: "राहत अस्थायी है; सच्चा सशक्तिकरण शाश्वत है।",
  text: "निर्भरता के चक्र को तोड़ने में हमारे साथ जुड़ें। हम ऐसे समाज की कल्पना करते हैं जहाँ हमारे द्वारा सहायता पाया हर व्यक्ति भविष्य में एक समर्पित कार्यकर्ता के रूप में आगे आए — राष्ट्र सेवा के लिए तत्पर।",
};

export const HOME_PILLARS_HEADING = {
  eyebrow: "The Four Pillars of Transformation",
  title: "परिवर्तन के चार स्तंभ",
};

/** One-line card text per pillar (overrides the CMS summary on the home grid). */
export const HOME_PILLAR_LINES: Record<PillarKey, string> = {
  shiksha: "मूल्य-आधारित शिक्षा के माध्यम से भविष्य के मार्गदर्शक तैयार करना।",
  swasthya: "व्यक्तियों को स्वस्थ बनाना, ताकि वे अपने परिवार की शक्ति बन सकें।",
  swavalamban: "युवाओं को कौशल देना, ताकि वे कल के रोज़गार-सृजक बनें।",
  samajik: "समुदायों को एकजुट करना, ताकि वे स्वयं अपने ज़मीनी कल्याण का नेतृत्व करें।",
};
