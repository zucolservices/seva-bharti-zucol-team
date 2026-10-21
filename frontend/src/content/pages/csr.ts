// "Major Projects & CSR" copy from the client's content document (section 5),
// verbatim (initiative names as in the layout section). The pathology lab
// details are translated from the live site.

export const CSR_HEADER = {
  eyebrow: "Major Projects & CSR",
  title: "Invest in the Cycle of Empowerment",
  subtitle:
    "Corporate Social Responsibility with Sewa Bharti is an investment with compounding social interest. When partners join hands with us, they ignite a sustainable chain of goodwill. “Together We Can” build resilient infrastructure where the communities empowered by your support today will independently drive the progress of our nation tomorrow.",
};

export const CSR_INITIATIVES_HEADING = "Current Initiatives";

/** `id` = anchor used by the header menu (/csr#...). */
export const CSR_INITIATIVES: { id: string; title: string; text: string }[] = [
  {
    id: "scholarships",
    title: "Nomadic Community Scholarships",
    text: "A dedicated initiative designed to break generational poverty by providing uninterrupted educational funding to students from nomadic backgrounds, ensuring they have the resources to uplift their own communities in the future.",
  },
  {
    id: "medical-infrastructure",
    title: "Advanced Medical Infrastructure",
    text: "Establishing cutting-edge physiotherapy and neuro-therapy rehabilitation centers to provide continuous, high-quality care, transforming vulnerable patients into healthy, active contributors to society.",
  },
  {
    id: "internships",
    title: "Academic Internships & Accounting Courses",
    text: "Facilitating MoUs with universities and educational foundations to provide hands-on vocational training that translates directly into long-term livelihood generation.",
  },
];

export const CSR_PATH_LAB = {
  title: "Sewa Pathology Lab",
  intro: "All types of diagnostic tests on modern machines at minimal rates, at Sewa Sadan.",
  addressLabel: "Address",
  address: "Sahkar Lane, Sahkar Marg, Lal Kothi, Jaipur-302007",
  emailLabel: "Email",
  email: "sewabhartipathlabjpr@gmail.com",
  timingLabel: "Timings",
  timing: "8:00 AM to 6:30 PM",
};

export const CSR_CTA = {
  primary: { label: "Contact Our CSR Team Today", href: "/contact" },
  secondary: { label: "Our Sewa Partners", href: "/partners" },
};
