// "सहयोग करें" section above the footer, copied from the live site
// (sewabhartirajasthan.org): ways to help, 80G note, address, and the bank
// details card. Static content; assets live in public/home/.
import Image from "next/image";
import SocialIcon from "@/components/SocialIcon";

const WAYS = [
  "विद्यार्थियों की पाठ्यसामग्री, ड्रेस, जरुरतमंदों को वस्त्र एवं औषधि देकर।",
  "अपने घर परिवार के मांगलिक अवसरों पर मंगल निधि प्रदान कर।",
  "सेवा कार्यों व संगठन हेतु समय दान कर।",
  "वानप्रस्थी के रूप में सेवा कार्यों से जुड़कर।",
  "किसी एक सेवा कार्य के पालक बन कर।",
  "नव सेवा सरोज मासिक पत्रिका (प्रसार संख्या 10000) के वार्षिक सदस्य 100 रुपये, पन्द्रह वर्षीय सदस्य 1000 रुपये एवं पत्रिका में विज्ञापन देकर।",
  "सेवा निधि “सेवा भारती समिति राजस्थान” नाम से चैक अथवा बैंक खाते में राशि जमा कराकर अपना नाम, पता, मोबाईल न०, पैन न०, पोस्टल पिन कोड के साथ बैंक द्वारा जारी जमा रसीद की फोटो प्रति सेवा भारती समिति राजस्थान के कार्यालय में भेजें; जिससे दानदाता को पावती की रसीद भिजवाई जा सके।",
];

const BANK = [
  { label: "बैंक का नाम", value: "स्टेट बैंक ऑफ़ इंडिया, ज्योति नगर जयपुर" },
  { label: "खाते का नाम", value: "सेवा भारती समिति राजस्थान, जयपुर" },
  { label: "बैंक खाता स०", value: "61041857746" },
  { label: "IFSC CODE", value: "SBIN0010548" },
];

const SOCIALS = [
  { platform: "facebook", href: "https://www.facebook.com/sewabhartirajasthan", label: "Facebook" },
  { platform: "youtube", href: "https://www.youtube.com/channel/UCFMz0rHDYD1xkN5JZR79Qag", label: "YouTube" },
  { platform: "twitter", href: "https://x.com/sewa_bharti", label: "X (Twitter)" },
] as const;

export default function DonateSection() {
  return (
    <section id="donate" className="scroll-mt-28 bg-[url('/home/bg-vission.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="container-page py-12">
        <h2 lang="hi" className="text-2xl font-bold leading-snug text-saffron-500 md:text-3xl">
          “सेवा” ईश्वर भक्ति का प्रथम सोपान एवं देशभक्ति का प्रकट स्वरूप है। इस कार्य में आप भी सामर्थ्य
          अनुसार सहयोग करें।
        </h2>
        <span aria-hidden className="mt-4 block h-1 w-16 rounded-full bg-saffron-500" />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Ways to help */}
          <div lang="hi" className="rounded-2xl bg-white/85 p-6 shadow-sm ring-1 ring-saffron-100 backdrop-blur-sm md:p-8">
            <h3 className="text-xl font-bold text-ink md:text-2xl">हम सेवक हैं मानवता के सेवा धर्म हमारा है</h3>
            <ul className="mt-5 divide-y divide-saffron-100">
              {WAYS.map((w) => (
                <li key={w} className="flex gap-3 py-2.5 text-[15px] leading-relaxed text-ink-soft">
                  <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-saffron-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-xl border-l-4 border-saffron-500 bg-saffron-50 px-4 py-3 font-bold leading-relaxed text-ink">
              सेवा भारती समिति राजस्थान को दिया गया आर्थिक सहयोग आयकर अधिनियम 1961 की धारा 80G के अन्तर्गत
              आयकर से मुक्त है।
            </p>

            <div className="mt-5 border-t border-saffron-100 pt-5 text-[15px] leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">सम्पर्क सूत्र</p>
              <address className="not-italic">
                सेवा भारती समिति राजस्थान
                <br />
                सेवा सदन, सहकार मार्ग, लालकोठी योजना, जयपुर-302015
              </address>
            </div>
          </div>

          {/* Bank details card */}
          <div className="relative overflow-hidden rounded-2xl bg-[url('/home/card-bg-1.png')] bg-cover bg-center shadow-sm ring-1 ring-saffron-100">
            <div aria-hidden className="absolute inset-0 bg-white/85" />
            <div className="relative flex h-full flex-col justify-center p-6 md:p-8">
              <Image src="/home/donate-img.png" alt="Donate" width={392} height={106} className="h-auto w-56" />

              <h3 lang="hi" className="mt-6 text-xl font-bold text-ink">
                दान राशि जमा कराने के लिए बैंक विवरण
              </h3>
              <dl lang="hi" className="mt-4 divide-y divide-saffron-100 rounded-xl border border-saffron-200 bg-white">
                {BANK.map((b) => (
                  <div key={b.label} className="grid items-baseline gap-1 px-4 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
                    <dt className="text-sm text-ink-soft">{b.label}</dt>
                    <dd className="font-semibold text-ink">{b.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-saffron-300 px-4 py-4">
                <div className="space-y-1.5 text-[15px] text-ink">
                  <a href="tel:+911412740799" className="flex items-center gap-2 hover:text-saffron-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
                    </svg>
                    0141 2740799
                  </a>
                  <a href="mailto:sewabhartijpr@gmail.com" className="flex items-center gap-2 hover:text-saffron-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
                    </svg>
                    sewabhartijpr@gmail.com
                  </a>
                </div>
                <ul className="flex items-center gap-2">
                  {SOCIALS.map((s) => (
                    <li key={s.platform}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-saffron-500"
                      >
                        <SocialIcon platform={s.platform} size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not linked: the live site's donation page should not be opened from here. */}
              <p className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-saffron-500 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-saffron-500/25">
                Online Donation Now Click here
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
