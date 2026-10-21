// "Our Sewa Partners" copy from the client's content document (section 9),
// translated into Hindi. Logos are the brands' official SVGs (Wikimedia),
// stored in public/partners/; a partner without `logo` shows a name card.

export type Partner = {
  /** Hindi name, shown first. */
  name: string;
  /** Usual English / brand name, shown small below; also the logo's alt text. */
  nameEn: string;
  /** Path under public/, e.g. "/partners/sbi.svg". */
  logo?: string;
};

export const PARTNERS_META = {
  title: "हमारे सेवा सहयोगी",
  description:
    "सेवा भारती समिति राजस्थान के संस्थागत एवं कॉर्पोरेट सहयोगी, जो सेवा के चक्र को सुदृढ़ करने में हमारे साथ खड़े हैं।",
};

export const PARTNERS_HEADER = {
  eyebrow: "हमारे सेवा सहयोगी",
  title: "सेवा के चक्र को सुदृढ़ करना",
};

export const PARTNERS_NOTE = {
  heading: "हमारे सहयोगियों के नाम एक संदेश",
  paragraphs: [
    "ज़मीनी स्तर पर राहत पहुँचाने से लेकर एक आत्मनिर्भर समाज के निर्माण तक की यह यात्रा हम अकेले तय नहीं करते। सेवा भारती समिति राजस्थान में ‘साथ मिलकर हम कर सकते हैं’ की हमारी परिकल्पना हमारे सम्मानित संस्थागत एवं कॉर्पोरेट सहयोगियों के अटूट समर्थन और साझा दृष्टि से ही साकार होती है।",
    "चाहे उन्नत चिकित्सा अवसंरचना के लिए वित्तीय सहयोग हो, शैक्षिक छात्रवृत्तियों का समर्थन हो, या हमारे कौशल विकास केंद्रों का विस्तार — कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR) और जनकल्याण के प्रति आपकी प्रतिबद्धता ही वह शक्ति है जो हमारे मिशन को आगे बढ़ाती है। आप केवल परियोजनाओं को वित्तीय सहायता नहीं दे रहे; आप सशक्तिकरण के चक्र में निवेश कर रहे हैं। आपके अमूल्य योगदान के कारण, जिन व्यक्तियों और समुदायों का हम आज उत्थान करते हैं, वे कल के सक्षम और आत्मनिर्भर दाता बन रहे हैं।",
    "राष्ट्र सेवा में कंधे से कंधा मिलाकर हमारे साथ खड़ी दूरदर्शी संस्थाओं के प्रति हम हृदय से आभार व्यक्त करते हैं:",
  ],
};

export const PARTNERS: Partner[] = [
  { name: "भारतीय स्टेट बैंक", nameEn: "State Bank of India (SBI)", logo: "/partners/sbi.svg" },
  { name: "राजस्थान सरकार", nameEn: "Government of Rajasthan" },
  { name: "शिक्षा विभाग, राजस्थान", nameEn: "Department of Education, Rajasthan" },
  { name: "महिंद्रा वर्ल्ड सिटी", nameEn: "Mahindra World City" },
  { name: "तापड़िया समूह", nameEn: "Taparia Group" },
  { name: "गंगानगर शुगर मिल्स प्रा. लि.", nameEn: "Ganganagar Sugar Mills Pvt. Ltd." },
  { name: "वंडर सीमेंट", nameEn: "Wonder Cement", logo: "/partners/wonder-cement.svg" },
  { name: "एनटीपीसी लिमिटेड", nameEn: "NTPC Limited", logo: "/partners/ntpc.svg" },
  {
    name: "इंडियन ऑयल कॉर्पोरेशन लिमिटेड",
    nameEn: "Indian Oil Corporation Limited (IOCL)",
    logo: "/partners/iocl.svg",
  },
];

export const PARTNERS_MORE = "...और भी अनेक समर्पित सहयोगी";

export const PARTNERS_CTA = {
  heading: "परिवर्तन के लिए हमारे गठबंधन से जुड़ें",
  text: "क्या आपकी संस्था ज़मीनी स्तर पर स्थायी और दीर्घकालिक प्रभाव उत्पन्न करना चाहती है? एक आत्मनिर्भर राजस्थान के निर्माण के लिए हमारे साथ साझेदारी करें।",
  button: "हमारी CSR टीम से संपर्क करें",
  href: "/contact",
};
