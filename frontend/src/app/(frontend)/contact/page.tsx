import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getGlobal } from "@/lib/cms";
import { telHref } from "@/lib/site-data";
import { CONTACT_HEADER } from "@/content/pages/contact";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getGlobal("contact-page");
  return {
    title: contact?.seo?.metaTitle || contact?.header?.eyebrow || contact?.header?.title || undefined,
    description: contact?.seo?.metaDescription || contact?.header?.subtitle || undefined,
  };
}

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([getGlobal("contact-page"), getGlobal("site-settings")]);
  const offices = settings?.offices ?? [];
  const email = settings?.primaryEmail;

  return (
    <>
      <PageHeader
        title={CONTACT_HEADER.title}
        eyebrow={CONTACT_HEADER.eyebrow}
        subtitle={CONTACT_HEADER.subtitle}
      />

      <div className="container-page py-12">
        {offices.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {offices.map((office, oi) => {
              const phones = office.phones ?? [];
              return (
                <section
                  key={office.id ?? `${office.name}-${oi}`}
                  className="rounded-xl border border-saffron-100 bg-white p-6 shadow-sm"
                >
                  <h2 lang="hi" className="text-lg font-bold text-saffron-700">
                    {office.nameHi || office.name}
                  </h2>
                  {office.nameHi && (
                    <p className="text-sm text-ink-soft">{office.name}</p>
                  )}
                  <address className="mt-4 space-y-2 text-sm not-italic text-ink-soft">
                    <p>{office.address}</p>
                    {phones.length > 0 && (
                      <p>
                        {phones.map((p, i) => (
                          <span key={p.id ?? `${p.number}-${i}`}>
                            <a
                              href={telHref(p.number)}
                              className="font-medium text-sewablue-700 hover:underline"
                            >
                              {p.number}
                            </a>
                            {i < phones.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    )}
                    {office.email && (
                      <p>
                        <a
                          href={`mailto:${office.email}`}
                          className="font-medium text-sewablue-700 hover:underline"
                        >
                          {office.email}
                        </a>
                      </p>
                    )}
                    {office.role && (
                      <p lang="hi" className="text-xs font-medium text-saffron-600">
                        {office.role}
                      </p>
                    )}
                  </address>
                </section>
              );
            })}
          </div>
        )}

        {(contact?.emailBox?.heading || contact?.emailBox?.text || email) && (
          <div className="mt-10 rounded-xl border border-sewablue-100 bg-sewablue-50 p-6">
            {contact?.emailBox?.heading && (
              <h2 lang="hi" className="text-lg font-bold text-sewablue-800">
                {contact.emailBox.heading}
              </h2>
            )}
            <p lang="hi" className="mt-2 text-sm text-ink-soft">
              {contact?.emailBox?.text}
              {contact?.emailBox?.text && email ? " " : ""}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-sewablue-700 hover:underline"
                >
                  {email}
                </a>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
