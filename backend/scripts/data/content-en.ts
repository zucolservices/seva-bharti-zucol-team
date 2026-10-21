// Hindi → English dictionary for scripts/content-en.ts.
// Keys are the EXACT Hindi strings stored in the CMS (production + local DB +
// backend/src/seed/data), including leading/trailing spaces of rich-text
// fragments: a paragraph with bold words is split into several text nodes, and
// each fragment is translated so that the joined English reads naturally.
// Not listed on purpose: the motto "सेवा परमो धर्मः" and site-settings nameHi
// (both kept in Hindi), and sample data the script deletes (pillar stats and
// success stories, event/events-page guests, "सेवा आयाम N" filler tiles).

export const CONTENT_EN: Record<string, string> = {
  " इसे ही अपना जन्मदिन बताती हैं… जन्मदिन नहीं, पुनर्जन्मदिन। सच तो ये है कि कई पुराने लोगों की तरह, उन्हें भी अपनी जन्मतारीख याद नहीं है। हाँ, उन्हें वो दिन अच्छी तरह याद है, जब संघ के वरिष्ठ प्रचारक ":
    " calls this her birthday… not her birthday, but her day of rebirth. The truth is that, like many people of her generation, she does not remember her date of birth. But she remembers that day well — the day when, inspired by the senior Sangh Pracharak ",
  " की प्रेरणा से वे जयपुर में अपने घर के नजदीक की वाल्मीकि बस्ती से कूड़ा बीनने वाले 5 बच्चों को पहली बार अपने घर पढ़ाने के लिए लाईं थीं।":
    ", she first brought 5 rag-picking children from the Valmiki Basti near her home in Jaipur to her house to teach them.",
  " की। बी.कॉम तृतीय वर्ष का छात्र लोकेश आज पढ़ाई के साथ इसी बाल विद्यालय में शिक्षक है। लोकेश बेहद होनहार बाँसुरी वादक भी है। विधवा माँ व तीन भाई-बहनों में सबसे बड़े लोकेश को विमलाजी पढ़ाने के लिए तब जबरदस्ती पकड़ कर लाईं थीं, जब वो महज आठ बरस का था। बी.ए. प्रथम वर्ष की छात्रा ":
    ". A third-year B.Com student, Lokesh today also teaches at this same Bal Vidyalaya alongside his studies. Lokesh is a highly talented flute player as well. The eldest of three siblings raised by a widowed mother, Lokesh was all but dragged in by Vimlaji to study when he was just eight years old. To help first-year B.A. student ",
  " को आठवीं की परीक्षा दिलवाने के लिए विमलाजी ने खुद 52 वर्ष की उम्र में आठवीं की परीक्षा दोबारा दी। ऐसी कितनी ही कहानियाँ यहाँ मिल जाएँगी।":
    " sit the Class 8 examination, Vimlaji herself took the Class 8 examination again at the age of 52. Many such stories can be found here.",
  " में बदल गई, जहाँ आज 400 से अधिक बच्चे पढ़ रहे हैं।":
    ", where more than 400 children study today.",
  " से, जो अब 12वीं की छात्रा है। ये बच्ची आज भी वो दिन नहीं भूली, जब विमलाजी उसे उसकी छोटी बहन के साथ छात्रावास लाईं थीं। माता-पिता की मौत के बाद ये दोनों बहनें अपनी ताई व ताऊ के साथ एक छोटी सी झोपड़ी में उनके 4 बच्चों के साथ रह रहीं थीं। जब वे यहाँ आईं थीं तो बहन के घाव पर कीड़े तक पड़ गए थे, फिर भी शिवानी सबसे खूब लड़ी थी, क्योंकि वो यहाँ नहीं आना चाहती थी। पर पिछले साल 10वीं में 62% लाने के बाद वो अपनी दादी माँ (विमलाजी) से गले लगकर फूट-फूटकर रोई, व उसने उन पर एक कविता भी लिखी।":
    ", who is now a Class 12 student. She has still not forgotten the day Vimlaji brought her and her younger sister to the hostel. After their parents died, the two sisters had been living with their aunt and uncle and their 4 children in a tiny hut. When they arrived, her sister’s wound was even infested with maggots; still, Shivani fought hardest of all, because she did not want to come here. But last year, after scoring 62% in Class 10, she hugged her grandmother (Vimlaji) and wept uncontrollably, and she even wrote a poem about her.",
  "26 जनवरी 2003… 62 से ऊपर की ":
    "26 January 2003… Now past 62, ",
  "80जी छूट":
    "80G Exemption",
  "अगला अतिथि":
    "Next guest",
  "अतिथि {n} दिखाएं":
    "Show guest {n}",
  "अतिथिगण":
    "Guests",
  "अब बात करते हैं ":
    "Now let us talk about ",
  "अभावग्रस्त बस्तियों के बच्चों के लिए निशुल्क शिक्षा — बाल संस्कार से लेकर पुस्तकालय एवं कोचिंग सहयोग तक।":
    "Free education for children of underprivileged settlements — from Bal Sanskar (value education) to library and coaching support.",
  "आइए मिलते हैं ":
    "Let us meet ",
  "आओ इस परिवर्तन यात्रा की सच्ची कहानी आपसे साझा करते हैं…":
    "Let us share with you the true story of this journey of transformation…",
  "आज दोमंजिला भवन में चल रहे इस विद्यालय में पढ़ने वाले 325 बच्चों का पूरा खर्च समाज के सहयोग से चलता है। 36 बच्चे यहीं छात्रावास में रहते हैं। अपना परिवार छोड़कर विमलाजी अब इन बच्चों के साथ यहीं रहती हैं, ताकि बड़ी बच्चियों की पढ़ाई न छूटे। बड़े बच्चों को इनकी दादी, यानी विमलाजी, एसएससी, बैंकिंग जैसी परीक्षाएँ दिलवाने अपने साथ लेकर जाती हैं। विद्यालय की एक शाखा अब सांगानेर में बक्सावाल में टैंट के नीचे चलती है, जहाँ 125 बच्चे पढ़ते हैं।":
    "Today, the entire cost of the 325 children studying in this school, which now runs in a two-storey building, is met with the support of society. 36 children live right here in the hostel. Leaving her own family, Vimlaji now lives here with these children, so that the older girls’ studies are not interrupted. Their grandmother, Vimlaji, takes the older children with her to sit examinations such as SSC and banking. A branch of the school now runs under a tent at Baksawala in Sanganer, where 125 children study.",
  "आयकर छूट प्राप्त":
    "Income Tax Exemption",
  "इन आयोजनों के माध्यम से समाज में समरसता, सहयोग एवं एकता का संदेश दिया जाता है तथा सादगीपूर्ण विवाह को प्रोत्साहन मिलता है।":
    "Through these events, a message of harmony, cooperation and unity is spread in society, and simple weddings are encouraged.",
  "इस अवसर पर बालकों को गीत, प्रार्थना एवं खेलों का अभ्यास कराया गया तथा उन्हें अच्छे संस्कार एवं शिक्षा के महत्व से अवगत कराया गया।":
    "On this occasion, the children practised songs, prayers and games, and were made aware of the importance of good values and education.",
  "ईमेल":
    "Email",
  "उत्सव एवं जयंतियाँ":
    "Festivals & Jayantis",
  "एंबुलेंस वैन में एक डॉक्टर एवं एक कंपाउंडर के साथ ग्रामीण एवं नगरीय क्षेत्रों में नियमित चिकित्सा सेवा उपलब्ध कराई जाती है।":
    "Regular medical services are provided in rural and urban areas through an ambulance van with a doctor and a compounder.",
  "और जानें":
    "Learn more",
  "कंप्यूटर प्रशिक्षण":
    "Computer Training",
  "कार्य के आयाम":
    "Areas of Work",
  "कार्यक्रम एवं सेवा गतिविधियाँ":
    "Events & Sewa Activities",
  "कार्यक्रम की तस्वीरें":
    "Event photos",
  "कार्यक्रम देखें":
    "View Events",
  "कार्यक्रम":
    "Events",
  "कुछ सेवा गतिविधियाँ":
    "Some Sewa Activities",
  "कौशल विकास केंद्र":
    "Kaushal Vikas Kendra (Skill Development)",
  "कौशल विकास, कंप्यूटर प्रशिक्षण एवं स्वयं सहायता समूहों के माध्यम से आत्मनिर्भरता की ओर।":
    "Towards self-reliance through skill development, computer training and self-help groups.",
  "गरीब रोगियों के लिए रुग्ण सहायता केंद्र, मनोरोग चिकित्सालय में भोजनशाला एवं समय-समय पर नेत्र चिकित्सा शिविर आयोजित किए जाते हैं।":
    "A patient assistance centre for poor patients, a dining hall at the psychiatric hospital, and eye-care camps organised from time to time.",
  "चल चिकित्सालय एवं नियमित चिकित्सा शिविरों से हजारों रोगियों को समय पर उपचार एवं परामर्श उपलब्ध हो रहा है।":
    "Through the mobile clinic and regular medical camps, thousands of patients are receiving timely treatment and consultation.",
  "चल चिकित्सालय":
    "Mobile Clinic (Chal Chikitsalaya)",
  "छोटे बच्चों के लिए प्रारंभिक शिक्षा एवं संस्कार केंद्र, जहाँ खेल-खेल में पढ़ाई, गीत-प्रार्थना एवं अच्छे संस्कार सिखाए जाते हैं।":
    "Early education and value-education centres for young children, where learning through play, songs, prayers and good values are taught.",
  "जिलों में उपस्थिति":
    "Districts Covered",
  "टैली, बेसिक कंप्यूटर एवं ग्राफिक्स के पाठ्यक्रम। अन्य सेवा बस्तियों में भी कंप्यूटर प्रशिक्षण केंद्र चलाए जाते हैं।":
    "Courses in Tally, basic computing and graphics. Computer training centres are also run in other Sewa Bastis.",
  "तस्वीर {n} दिखाएं":
    "Show photo {n}",
  "तीन बेटों–बहुओं व पोते-पोतियों से भरे परिवार की मालकिन, 8वीं पास विमलाजी ने 48 साल की उम्र में उन बच्चों का जीवन संवारने का निर्णय लिया, जो दिनभर कूड़ा बीनकर जो पैसा कमाते थे, उससे कुछ पैसे का वे नशा करते व बाकी से घर खर्च चलाने में मदद करते थे। मेहतरों की इस बस्ती का हाल बड़ा बुरा था — बस्ती के आसपास की भीषण गंदगी, छोटी सी झोपड़ी में सूअरों के बीच पल रहे बच्चे, उस पर नशे के आदी माता-पिता। ऐसे में इन बच्चों की पढ़ाई की चिंता कौन करता। फिर विमलाजी ईश्वरीय दूत की तरह इनके जीवन में आईं, व इनकी नाक साफ करने, नाखून काटने से लेकर उन्हें संस्कारित व शिक्षित करने का काम शुरू कर दिया।":
    "The matriarch of a family full of three sons, daughters-in-law and grandchildren, Vimlaji, who had studied up to Class 8, decided at the age of 48 to transform the lives of children who spent the whole day picking rags; of the money they earned, they spent some on intoxicants and used the rest to help run their homes. The condition of this sweepers’ settlement was dismal — appalling filth all around the basti, children growing up among pigs in tiny huts, and on top of that, parents addicted to intoxicants. In such circumstances, who would worry about these children’s education? Then Vimlaji came into their lives like a messenger of God, and took on everything from wiping their noses and cutting their nails to instilling values in them and educating them.",
  "त्वरित लिंक":
    "Quick Links",
  "धनप्रकाश त्यागी":
    "Dhanprakash Tyagi",
  "निशुल्क शिक्षा — सेवा भारती बाल विद्यालय":
    "Free Education — Sewa Bharti Bal Vidyalaya",
  "नीचे दिए गए कार्यालयों के माध्यम से सेवा भारती समिति, राजस्थान से संपर्क करें।":
    "Contact Sewa Bharti Samiti, Rajasthan through the offices listed below.",
  "पंजीकृत कार्यालय":
    "Registered Office",
  "पंजीकृत समाजसेवी संस्था · Reg. No. 106/Rajasthan 1987-88 · 80G आयकर छूट प्राप्त":
    "Registered Social Service Organisation · Reg. No. 106/Rajasthan 1987-88 · 80G Income Tax Exemption",
  "पंजीकृत समाजसेवी संस्था · स्थापना 1987":
    "Registered Social Service Organisation · Established 1987",
  "पंजीयन क्रमांक":
    "Registration No.",
  "पंजीयन दिनांक":
    "Registration Date",
  "परामर्श केंद्र, चल चिकित्सालय, चिकित्सा शिविर एवं रुग्ण सहायता के माध्यम से सुलभ स्वास्थ्य सेवा।":
    "Accessible healthcare through consultation centres, mobile clinics, medical camps and patient assistance.",
  "परिचय":
    "Introduction",
  "पिछड़ी बस्तियों की महिलाओं एवं पुरुषों में बचत के माध्यम से लघु उद्योग एवं आत्मनिर्भरता को प्रोत्साहन।":
    "Encouraging small enterprises and self-reliance through savings among the women and men of backward settlements.",
  "पिछला अतिथि":
    "Previous guest",
  "पुस्तकालय एवं वाचनालय":
    "Library & Reading Room",
  "पूरा पढ़ें":
    "Read the full story",
  "प्रान्त मंत्री":
    "Prant Mantri (State Secretary)",
  "फोटो गैलरी":
    "Photo Gallery",
  "बाकी सभी सेवा गतिविधियाँ यहाँ देखें":
    "See all other Sewa activities here",
  "बाबा रामदेव जी एवं खाटू श्याम जी जैसे मेलों में सेवा व्यवस्था। संस्था विगत 35 वर्षों से ‘सेवा सरोज’ पत्रिका प्रकाशित करती है।":
    "Service arrangements at fairs such as those of Baba Ramdev Ji and Khatu Shyam Ji. The organisation has been publishing the ‘Sewa Saroj’ magazine for the past 35 years.",
  "बाल संस्कार केंद्र अवलोकन — केसरपुरा (शिवगंज), सिरोही":
    "Bal Sanskar Kendra Inspection — Kesarpura (Shivganj), Sirohi",
  "बाल संस्कार केंद्र वंचित बस्तियों के बच्चों को प्रारंभिक शिक्षा एवं संस्कार प्रदान कर उन्हें मुख्यधारा से जोड़ने का कार्य करते हैं।":
    "Bal Sanskar Kendras provide early education and values to children of deprived settlements and connect them with the mainstream.",
  "बालवाड़ी एवं बाल संस्कार केंद्र":
    "Balwadi & Bal Sanskar Kendra",
  "बालवाड़ी एवं बाल संस्कार केंद्रों से लेकर निशुल्क विद्यालय एवं झोला पुस्तकालय तक, शिक्षा के अनेक आयामों के माध्यम से हजारों बच्चे शिक्षा की मुख्यधारा से जुड़ रहे हैं।":
    "From Balwadis and Bal Sanskar Kendras to free schools and Jhola libraries (bag libraries), thousands of children are joining mainstream education through the many areas of educational work.",
  "महर्षि वाल्मीकि जयंती, मकर संक्रांति एवं रक्षाबंधन जैसे पर्व सामाजिक समरसता के भाव से मनाए जाते हैं।":
    "Festivals such as Maharshi Valmiki Jayanti, Makar Sankranti and Raksha Bandhan are celebrated in a spirit of social harmony.",
  "मेलों में सेवा कार्य एवं ‘सेवा सरोज’ पत्रिका":
    "Service at Fairs & 'Sewa Saroj' Magazine",
  "ये काम जितना सरल दिखाई देता है, उससे कहीं अधिक कठिन था। अव्वल तो इन बच्चों के माता-पिता इन्हें पढ़ने भेजने को तैयार नहीं थे। कूड़े से प्लास्टिक चुनकर जो पंद्रह-बीस रुपए बच्चे कमाकर लाते थे, वो उनके लिए बच्चों की पढ़ाई से ज्यादा मायने रखते थे। कई बार समझाने के बाद वे इस शर्त पर राजी हुए कि बच्चे बस चार घंटे पढ़ेंगे व बाकी समय वे कूड़ा बीनेंगे। तीन साल बच्चे विमलाजी के घर में पढ़े, परंतु जब 100 बच्चे हो गए तो सेवाभारती के सहयोग से ये विद्यालय त्रिपाल (टैंट) के नीचे लगने लगा।":
    "This work was far harder than it looks. To begin with, the children’s parents were not willing to send them to study. The fifteen or twenty rupees the children earned by picking plastic out of the garbage mattered more to them than their children’s education. After being persuaded many times, they agreed on the condition that the children would study for just four hours and spend the rest of the time picking rags. For three years the children studied in Vimlaji’s home, but when their number reached 100, the school began to be held under a tarpaulin (tent) with the support of Sewa Bharti.",
  "योग एवं सत्संग केंद्र":
    "Yoga & Satsang Centres",
  "योग एवं सत्संग केंद्र, उत्सव-जयंतियों एवं मेलों में सेवा के माध्यम से सामाजिक समरसता का निर्माण।":
    "Building social harmony through yoga and satsang centres, festivals and jayantis, and service at fairs.",
  "राजस्थान क्षेत्रीय कार्यालय":
    "Rajasthan Regional Office",
  "राजस्थान भर में संचालित सेवा कार्यों की झलक।":
    "A glimpse of the service work carried out across Rajasthan.",
  "राज्य भर में संचालित सेवा कार्यों की एक झलक।":
    "A glimpse of the service work carried out across the state.",
  "रानीवाड़ा द्वारा संचालित बाल संस्कार केंद्र का अधिकारियों द्वारा अवलोकन किया गया। बालकों को गीत, प्रार्थना एवं खेलों का अभ्यास कराया गया।":
    "Officials inspected the Bal Sanskar Kendra run by Raniwara. The children practised songs, prayers and games.",
  "रुग्ण सहायता एवं नेत्र शिविर":
    "Patient Assistance & Eye Camps",
  "लक्ष्मी":
    "Lakshmi",
  "लोकेश कोली":
    "Lokesh Koli",
  "वंचित वर्ग के विद्यार्थियों को निशुल्क शिक्षा दी जाती है, जिससे वे मुख्यधारा की शिक्षा से जुड़ सकें।":
    "Free education is provided to students from deprived sections so that they can join mainstream education.",
  "वर्ष":
    "years",
  "विभिन्न पर्वों एवं जयंतियों के आयोजन तथा मेलों में सेवा व्यवस्था से बस्तियों में सामूहिकता एवं आत्मीयता का वातावरण बनता है।":
    "Celebrating various festivals and jayantis, and providing service arrangements at fairs, creates an atmosphere of togetherness and closeness in the settlements.",
  "विमला कुमावत":
    "Vimla Kumawat",
  "विमलाजी पढ़ाने के साथ-साथ बच्चों को गीता के श्लोक, बाल रामायण, भजन इत्यादि भी सिखाती थीं। इन बच्चों ने हारमोनियम, ढोलक, मंजीरा भी सीखा, व गर्मियों की छुट्टियों में सिलाई-कढ़ाई जैसी हॉबी क्लासेस भी करवाई गईं। जयपुर के हिंदू आध्यात्मिक मेले में, मंच पर जब इन बच्चों के सधे सुरों व मधुर कंठों से बाल रामायण निकली, तो खुशी से धनप्रकाशजी की आँखें भर आईं। मेले में मिली कई ट्रॉफियाँ बच्चे गर्व से दिखाते हैं।":
    "Along with their lessons, Vimlaji also taught the children verses of the Gita, the Bal Ramayana, bhajans and more. The children also learned the harmonium, dholak and manjira, and during the summer holidays hobby classes such as sewing and embroidery were held too. At the Hindu Spiritual Fair in Jaipur, when the Bal Ramayana flowed from these children’s well-trained, melodious voices on stage, Dhanprakashji’s eyes filled with tears of joy. The children proudly show off the many trophies they won at the fair.",
  "विवरण":
    "Details",
  "विस्तार से पढ़ें":
    "Read more",
  "शिक्षा":
    "Education",
  "शिवानी":
    "Shivani",
  "शिविर में वरिष्ठ चिकित्सकों द्वारा रोगियों की जाँच कर निशुल्क परामर्श एवं औषधि वितरण किया गया। इस अवसर पर लगभग 80 रोगी लाभान्वित हुए।":
    "At the camp, senior doctors examined the patients and provided free consultation and medicines. About 80 patients benefited on this occasion.",
  "संपर्क करें":
    "Contact Us",
  "संपर्क":
    "Contact",
  "संस्था का विवरण":
    "Organisation Details",
  "संस्था द्वारा संपूर्ण क्षेत्र में सीधे ही या संलग्न संस्थाओं के माध्यम से 1610 सेवा कार्य संचालित किए जा रहे हैं।":
    "The organisation runs 1610 service projects across the entire region, directly or through affiliated organisations.",
  "संस्था द्वारा संपूर्ण राजस्थान क्षेत्र में सीधे ही या संलग्न संस्थाओं के माध्यम से 1610 सेवा कार्य संचालित किए जा रहे हैं।":
    "The organisation runs 1610 service projects across the entire Rajasthan region, directly or through affiliated organisations.",
  "सफलता की कहानियाँ":
    "Success Stories",
  "सभी कार्यक्रम":
    "All events",
  "सभी सेवा कार्य संप्रदाय, जाति, वर्ग, प्रांत, भाषा एवं मत-मतांतर के भेदभाव के बिना संचालित किए जाते हैं। किसी भी प्रकार की दैवीय आपदा — जैसे बाढ़, भूकंप, अकाल, अग्निकांड एवं महामारी — में भी यथासंभव सहयोग किया जाता है।":
    "All service work is carried out without discrimination on the basis of sect, caste, class, region, language or belief. Assistance is also provided, as far as possible, during any natural disaster — such as floods, earthquakes, famine, fire and epidemics.",
  "समाज के सामाजिक, शैक्षणिक एवं आर्थिक रूप से पिछड़े, वंचित एवं उपेक्षित बंधुओं का विकास कर उन्हें आत्मनिर्भर, स्वाभिमानी एवं स्वावलंबी बनाकर स्वस्थ, समरस एवं संगठित समाज का निर्माण करना।":
    "To build a healthy, harmonious and organised society by developing the socially, educationally and economically backward, deprived and neglected members of society and making them self-reliant, self-respecting and independent.",
  "सामाजिक समरसता के क्षेत्र में संस्था योग एवं सत्संग केंद्र, उत्सव-जयंतियों एवं मेलों में सेवा के माध्यम से समाज में सद्भाव एवं एकता का भाव सुदृढ़ करती है।":
    "In the field of social harmony, the organisation strengthens goodwill and unity in society through yoga and satsang centres, festivals and jayantis, and service at fairs.",
  "सामाजिक समरसता के भाव से आयोजित सामूहिक विवाह कार्यक्रम, जिनमें समाज के सभी वर्गों की भागीदारी एवं समरसता देखने को मिली।":
    "Community wedding programmes organised in a spirit of social harmony, with the participation of all sections of society.",
  "सामाजिक समरसता के भाव से सेवा भारती द्वारा सामूहिक विवाह सम्मेलन का आयोजन किया गया, जिसमें समाज के सभी वर्गों की सहभागिता रही।":
    "In a spirit of social harmony, Sewa Bharti organised a community wedding ceremony with the participation of all sections of society.",
  "सामाजिक समरसता — सामूहिक विवाह आयोजन":
    "Social Harmony — Community Weddings",
  "सामाजिक समरसता":
    "Social Harmony",
  "सामाजिक":
    "Social Harmony",
  "सामान्य जानकारी हेतु संपर्क करें:":
    "For general information, contact:",
  "सिलाई एवं फैशन डिजाइनिंग प्रशिक्षण। सेवा सदन सहित बस्तियों में 15 से अधिक सिलाई केंद्र संचालित हैं।":
    "Training in sewing and fashion designing. More than 15 sewing centres are run in the settlements, including at Sewa Sadan.",
  "सिलाई, फैशन डिज़ाइनिंग एवं कंप्यूटर प्रशिक्षण केंद्रों से प्रशिक्षित होकर सैकड़ों महिलाएँ एवं युवा स्वरोज़गार से जुड़ चुके हैं।":
    "After training at the sewing, fashion designing and computer training centres, hundreds of women and young people have taken up self-employment.",
  "सेवा कार्य":
    "Service Projects",
  "सेवा कार्यों की झलकियाँ":
    "Glimpses of our service work",
  "सेवा गतिविधियाँ":
    "Sewa Activities",
  "सेवा बस्तियों में सामाजिक सद्भाव एवं समरसता हेतु साप्ताहिक योग एवं सत्संग केंद्र संचालित किए जाते हैं।":
    "Weekly yoga and satsang centres are run in Sewa Bastis to promote social goodwill and harmony.",
  "सेवा भारती ऐसे आयोजनों के द्वारा सामाजिक भेदभाव को समाप्त कर समरस एवं संगठित समाज के निर्माण हेतु प्रयासरत है।":
    "Through such events, Sewa Bharti strives to end social discrimination and build a harmonious and organised society.",
  "सेवा भारती का उद्देश्य समाज के प्रत्येक वर्ग तक सुलभ एवं निशुल्क स्वास्थ्य सेवा पहुँचाना है, जिससे कोई भी आवश्यक चिकित्सा से वंचित न रहे।":
    "Sewa Bharti aims to bring accessible and free healthcare to every section of society, so that no one is deprived of necessary medical care.",
  "सेवा भारती किशनगढ़ एवं आयुष क्लिनिक जयपुर के संयुक्त तत्वावधान में एक विशाल निशुल्क आयुर्वेदिक चिकित्सा शिविर का आयोजन किया गया। शिविर का शुभारंभ भगवान धन्वंतरी के पूजन एवं दीप प्रज्वलन के साथ हुआ।":
    "A large free Ayurvedic medical camp was organised under the joint auspices of Sewa Bharti Kishangarh and Ayush Clinic, Jaipur. The camp began with the worship of Lord Dhanvantari and the lighting of the lamp.",
  "सेवा भारती किशनगढ़ एवं आयुष क्लिनिक जयपुर के संयुक्त तत्वावधान में निशुल्क आयुर्वेदिक चिकित्सा शिविर आयोजित किया गया, जिसमें लगभग 80 रोगी लाभान्वित हुए।":
    "A free Ayurvedic medical camp was organised under the joint auspices of Sewa Bharti Kishangarh and Ayush Clinic, Jaipur, benefiting about 80 patients.",
  "सेवा भारती किशनगढ़ चिकित्सा शिविर":
    "Sewa Bharti Kishangarh Medical Camp",
  "सेवा भारती समिति एक गैर-सरकारी संगठन है, जो आर्थिक एवं सामाजिक दृष्टि से पिछड़े तथा वंचित वर्गों के बीच नगरीय झुग्गी-झोपड़ी बस्तियों एवं ग्रामीण क्षेत्रों में सेवा कार्य करता है। संस्था निशुल्क शिक्षा, निशुल्क चिकित्सा, कौशल विकास एवं सामाजिक समरसता के क्षेत्र में कार्यरत है।":
    "Sewa Bharti Samiti is a non-governmental organisation that carries out service work among economically and socially backward and deprived sections in urban slum settlements and rural areas. The organisation works in the fields of free education, free healthcare, skill development and social harmony.",
  "सेवा भारती समिति द्वारा संचालित बाल संस्कार केंद्र, केसरपुरा (शिवगंज), सिरोही का अधिकारियों द्वारा अवलोकन किया गया।":
    "Officials inspected the Bal Sanskar Kendra run by Sewa Bharti Samiti at Kesarpura (Shivganj), Sirohi.",
  "सेवा भारती समिति राजस्थान एक गैर-सरकारी संगठन है, जो आर्थिक एवं सामाजिक दृष्टि से पिछड़े तथा वंचित वर्गों के बीच नगरीय झुग्गी-झोपड़ी बस्तियों एवं ग्रामीण क्षेत्रों में सेवा कार्य करता है। संस्था निशुल्क शिक्षा, निशुल्क चिकित्सा, कौशल विकास एवं सामाजिक समरसता के क्षेत्र में कार्यरत है।":
    "Sewa Bharti Samiti Rajasthan is a non-governmental organisation that carries out service work among economically and socially backward and deprived sections in urban slum settlements and rural areas. The organisation works in the fields of free education, free healthcare, skill development and social harmony.",
  "सेवा भारती समिति राजस्थान":
    "Sewa Bharti Samiti Rajasthan",
  "सेवा भारती समिति राजस्थान, शिक्षा के क्षेत्र में वंचित एवं अभावग्रस्त बस्तियों के बच्चों तक निशुल्क शिक्षा पहुँचाने का कार्य करती है। प्रारंभिक बाल शिक्षा से लेकर संस्कार, पुस्तकालय एवं कोचिंग सहयोग तक — प्रत्येक बालक को मुख्यधारा की शिक्षा से जोड़ना संस्था का ध्येय है।":
    "In the field of education, Sewa Bharti Samiti Rajasthan works to bring free education to children of deprived and underprivileged settlements. From early childhood education to values, library and coaching support — the organisation’s goal is to connect every child with mainstream education.",
  "सेवा भारती समिति — एक परिचय":
    "Sewa Bharti Samiti — An Introduction",
  "सेवा भारती समिति, कोटा":
    "Sewa Bharti Samiti, Kota",
  "सेवा भारती समिति, जयपुर प्रान्त":
    "Sewa Bharti Samiti, Jaipur Prant",
  "सेवा भारती समिति, राजस्थान — एक परिचय":
    "Sewa Bharti Samiti, Rajasthan — An Introduction",
  "सेवा भारती समिति, राजस्थान":
    "Sewa Bharti Samiti, Rajasthan",
  "सेवा भारती":
    "Sewa Bharti",
  "सेवा सदन के प्रथम तल पर आधुनिक जांच केंद्र, जहाँ वरिष्ठ चिकित्सकों द्वारा परामर्श एवं उपचार किया जाता है। माह के अंतिम रविवार को चिकित्सा शिविर भी लगाए जाते हैं।":
    "A modern diagnostic centre on the first floor of Sewa Sadan, where senior doctors provide consultation and treatment. Medical camps are also held on the last Sunday of every month.",
  "सेवा सदन में हजारों पुस्तकों का पुस्तकालय एवं वाचनालय। अन्य सेवा बस्तियों में झोला पुस्तकालय एवं कोचिंग सेंटर भी चलाए जाते हैं।":
    "A library and reading room with thousands of books at Sewa Sadan. Jhola libraries (bag libraries) and coaching centres are also run in other Sewa Bastis.",
  "सेवाभारती के कार्यकर्ताओं की मदद से पहले तीन साल विमलाजी के घर में चलने वाली कक्षा धीरे-धीरे ":
    "With the help of Sewa Bharti Karyakartas, the class that ran in Vimlaji’s home for the first three years gradually grew into the ",
  "सेवाभारती बाल विद्यालय":
    "Sewa Bharti Bal Vidyalaya",
  "स्थापना वर्ष":
    "Year of Establishment",
  "स्वयं सहायता समूह":
    "Self-Help Groups",
  "स्वावलंबन के क्षेत्र में संस्था कौशल विकास, कंप्यूटर प्रशिक्षण एवं स्वयं सहायता समूहों के माध्यम से बस्तियों के युवाओं एवं महिलाओं को आत्मनिर्भर बनाने का कार्य करती है।":
    "In the field of self-reliance, the organisation works to make young people and women of the settlements self-reliant through skill development, computer training and self-help groups.",
  "स्वावलंबन":
    "Self-Reliance",
  "स्वास्थ्य के क्षेत्र में संस्था परामर्श केंद्र, चल चिकित्सालय, चिकित्सा शिविर एवं रुग्ण सहायता के माध्यम से वंचित वर्ग तक सुलभ एवं निशुल्क स्वास्थ्य सेवा पहुँचाती है।":
    "In the field of health, the organisation brings accessible and free healthcare to deprived sections through consultation centres, mobile clinics, medical camps and patient assistance.",
  "स्वास्थ्य परामर्श एवं जांच केंद्र":
    "Health Consultation & Diagnostic Centre",
  "स्वास्थ्य":
    "Healthcare",
  "हमारा उद्देश्य":
    "Our Objective",
  "हमारे चार आयाम":
    "Our Four Pillars",
  "हमारे बारे में":
    "About Us",
  "हाल की सेवा गतिविधियाँ":
    "Recent Sewa Activities",
  "होम":
    "Home",
  "“मैं जानती थी यह परिवर्तन शिक्षा से ही सम्भव है ……फिर क्या था सेवा भारती के सहयोग से यह समाज की पीड़ा विद्यालय का रूप लेने लगी और फिर ……….” बोलते-बोलते विमला जी की आँखें सजल हो गईं":
    "“I knew this change was possible only through education… and then, with the support of Sewa Bharti, this pain of society began to take the shape of a school, and then…” As she spoke, Vimla ji’s eyes filled with tears",
  "संपूर्ण राजस्थान में प्रत्यक्ष रूप से या संलग्न संस्थाओं के माध्यम से संचालित सेवा कार्य।":
    "Service projects run across Rajasthan, directly or through affiliated organisations.",
};

// Same Hindi, different meaning by place: "<global slug or collection>:<field path>" → English.
// Checked before CONTENT_EN. Array indexes are written as [] (any row).
export const CONTENT_EN_BY_PATH: Record<string, Record<string, string>> = {
  "ui-strings:pillarPage.bannerPrefix": { "सेवा कार्य": "Sewa Work" },
  "ui-strings:pillarPage.overview.title": { "विवरण": "Overview" },
};
