import type { Metadata } from "next";
import RegistrationForm from "@/components/RegistrationForm";

// Public registration form, mainly reached by QR code (context/2.0/
// Sewa_Bharti_Form_QR.png). Entries are saved in the CMS under
// Forms → Registrations. Not in the menu.
export const metadata: Metadata = {
  title: "Registration Form",
  description: "Sewa Bharti Samiti Rajasthan registration form.",
};

export default function FormPage() {
  return (
    <section className="bg-gradient-to-br from-saffron-50 via-cream to-sewablue-50">
      {/* Desktop: intro on the left, form on the right, so the whole form fits
          on one screen without scrolling. Mobile: one column. */}
      <div className="container-page flex justify-center py-6 sm:py-10 lg:py-8">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-saffron-100 sm:p-8 lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
          <div className="lg:flex lg:flex-col lg:justify-center lg:border-r lg:border-saffron-100 lg:pr-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-saffron-700">Sewa Bharti Samiti Rajasthan</p>
            <h1 lang="hi" className="mt-1 text-balance text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl lg:text-4xl">
              पंजीकरण फ़ॉर्म
            </h1>
            <p className="text-base font-medium text-ink-soft">Registration Form</p>
            <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-saffron-500" />
            {/* Hindi line, English line, then the required-field key: each wraps on its own. */}
            <div className="mt-4 space-y-0.5 text-[15px] leading-relaxed text-ink-soft">
              <p lang="hi" className="text-pretty">कृपया नीचे अपनी जानकारी भरें।</p>
              <p className="text-pretty">Please fill in your details below.</p>
              <p className="pt-1.5 text-sm">
                <span className="block">
                  <span aria-hidden className="text-red-600">*</span>{" "}
                  <span lang="hi">सभी जानकारी भरना आवश्यक है।</span>
                </span>
                <span className="block">All fields are required.</span>
              </p>
            </div>

          </div>

          <div className="mt-6 lg:mt-0">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
