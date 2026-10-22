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
      <div className="container-page flex justify-center py-10 md:py-16">
        <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-saffron-100 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-saffron-700">Sewa Bharti Samiti Rajasthan</p>
          <h1 lang="hi" className="mt-1 text-2xl font-bold leading-snug tracking-tight text-ink md:text-3xl">
            पंजीकरण फ़ॉर्म
          </h1>
          <p className="text-base font-medium text-ink-soft">Registration Form</p>
          <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-saffron-500" />
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            <span lang="hi">कृपया नीचे अपनी जानकारी भरें।</span> Please fill in your details below.{" "}
            <span className="text-red-600">*</span> = <span lang="hi">आवश्यक</span> (required)
          </p>

          <div className="mt-6">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
