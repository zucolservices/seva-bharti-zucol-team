import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getContent, getGlobal } from "@/lib/cms";
import { telHref } from "@/lib/site-data";
import { langOf } from "@/lib/view-types";
import { resolveContact } from "@/content/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const [contact, contactContent] = await Promise.all([getGlobal("contact-page"), getContent("contact-content")]);
  const { header: CONTACT_HEADER } = resolveContact(contactContent);
  return {
    title: contact?.seo?.metaTitle || CONTACT_HEADER.eyebrow,
    description: contact?.seo?.metaDescription || CONTACT_HEADER.subtitle,
  };
}

export default async function ContactPage() {
  const [contact, settings, contactContent] = await Promise.all([
    getGlobal("contact-page"),
    getGlobal("site-settings"),
    getContent("contact-content"),
  ]);
  const { header: CONTACT_HEADER } = resolveContact(contactContent);
  const offices = settings?.offices ?? [];
  const email = settings?.primaryEmail;

  return (
    <>
      <PageHeader
        // Team's CMS header (Contact Page → Header) wins; content-document text is the fallback.
        title={contact?.header?.title?.trim() || CONTACT_HEADER.title}
        eyebrow={contact?.header?.eyebrow?.trim() || CONTACT_HEADER.eyebrow}
        subtitle={contact?.header?.subtitle?.trim() || CONTACT_HEADER.subtitle}
      />

      <div className="container-page py-12">
        {offices.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {offices.map((office, oi) => {
              const phones = office.phones ?? [];
              // English name first; Hindi only when the English one is empty.
              const officeName = office.name || office.nameHi;
              return (
                <section
                  key={office.id ?? `${office.name}-${oi}`}
                  className="rounded-xl border border-saffron-100 bg-white p-6 shadow-sm"
                >
                  <h2 lang={langOf(officeName)} className="text-lg font-bold text-saffron-700">
                    {officeName}
                  </h2>
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
                      <p lang={langOf(office.role)} className="text-xs font-medium text-saffron-700">
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
              <h2 lang={langOf(contact.emailBox.heading)} className="text-lg font-bold text-sewablue-800">
                {contact.emailBox.heading}
              </h2>
            )}
            <p lang={langOf(contact?.emailBox?.text)} className="mt-2 text-sm text-ink-soft">
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
