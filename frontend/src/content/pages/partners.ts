// "Our Sewa Partners" copy from the client's content document (section 9),
// verbatim. Logos are the organisations' official files (sources in
// context/2.0/CONTENT_GAPS.md), stored in public/partners/; a partner without
// `logo` shows its name as text until a logo file is supplied.

export type Partner = {
  /** Name as in the content document; also the logo's alt text. */
  name: string;
  /** Path under public/, e.g. "/partners/sbi.svg". */
  logo?: string;
  /** Round/square emblem — shown taller so it reads at the same weight as wide wordmarks. */
  emblem?: boolean;
};

export const PARTNERS_META = {
  title: "Our Sewa Partners",
  description:
    "The journey from providing grassroots relief to building a self-reliant society is not one we walk alone.",
};

export const PARTNERS_HEADER = {
  eyebrow: "Our Sewa Partners",
  title: "Strengthening the Circle of Service",
};

export const PARTNERS_NOTE = {
  heading: "A Note to Our Partners",
  paragraphs: [
    "The journey from providing grassroots relief to building a self-reliant society is not one we walk alone. At Sewa Bharti Samiti Rajasthan, our vision of “Together We Can” is brought to life through the unwavering support and shared vision of our esteemed institutional and corporate partners.",
    "Whether it is funding advanced medical infrastructure, supporting educational scholarships, or expanding our skill development centers, your commitment to Corporate Social Responsibility (CSR) and public welfare is the engine that drives our mission forward. You are not just funding projects; you are investing in the cycle of empowerment. Thanks to your vital contributions, the individuals and communities we uplift today are being shaped into the capable, self-reliant benefactors of tomorrow.",
    "We extend our deepest gratitude to the visionary organizations that stand shoulder-to-shoulder with us in national service:",
  ],
};

export const PARTNERS_GRID_LABEL = "Partner organizations";

export const PARTNERS: Partner[] = [
  { name: "State Bank of India (SBI)", logo: "/partners/sbi.svg" },
  { name: "Government of Rajasthan", logo: "/partners/govt-rajasthan.png" },
  { name: "Department of Education, Rajasthan", logo: "/partners/rajasthan-education-department.png", emblem: true },
  { name: "Mahindra World City", logo: "/partners/mahindra-world-city.png" },
  { name: "Taparia Group", logo: "/partners/taparia.png" },
  { name: "Ganganagar Sugar Mills Pvt. Ltd.", logo: "/partners/rsgsm.png", emblem: true },
  { name: "Wonder Cement", logo: "/partners/wonder-cement.svg" },
  { name: "NTPC Limited", logo: "/partners/ntpc.svg" },
  { name: "Indian Oil Corporation Limited (IOCL)", logo: "/partners/iocl.svg" },
];

export const PARTNERS_CTA = {
  heading: "Join Our Alliance for Change",
  text: "Is your organization looking to create a lasting, sustainable impact at the grassroots level? Partner with us to build a self-reliant Rajasthan.",
  button: "Contact Our CSR Team Today",
  href: "/contact",
};
