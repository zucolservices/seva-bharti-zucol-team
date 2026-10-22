import Link from "next/link";
import type { CollectionSlug, ServerProps, Where } from "payload";

import "./dashboard.scss";

// Welcome panel rendered above Payload's default dashboard cards
// (admin.components.beforeDashboard). Receives Payload's ServerProps.

type Card = {
  titleHi: string;
  titleEn: string;
  description: string;
  path: string;
  /** Short label for a live count, e.g. "12 published · 3 drafts". */
  stat?: string | null;
  adminOnly?: boolean;
  primary?: boolean;
};

type Section = { id: string; titleHi: string; titleEn: string; cards: Card[] };

type Counts = {
  eventsPublished: number | null;
  eventsDraft: number | null;
  pillars: number | null;
  media: number | null;
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

async function getCounts(payload: ServerProps["payload"], user: ServerProps["user"]): Promise<Counts> {
  const count = async (collection: CollectionSlug, where?: Where): Promise<number | null> => {
    try {
      const res = await payload.count({ collection, where, overrideAccess: false, user });
      return res.totalDocs;
    } catch {
      return null;
    }
  };

  const [eventsPublished, eventsDraft, pillars, media] = await Promise.all([
    count("events", { _status: { equals: "published" } }),
    count("events", { _status: { equals: "draft" } }),
    count("pillars"),
    count("media"),
  ]);
  return { eventsPublished, eventsDraft, pillars, media };
}

export async function Dashboard({ payload, user }: ServerProps) {
  const liveSiteUrl = process.env.FRONTEND_URL?.trim() || "/";
  const adminRoute = (payload?.config?.routes?.admin || "/admin").replace(/\/+$/, "");
  const url = (path: string) => `${adminRoute}${path}`;

  const roles = (user as { roles?: string[] | null } | undefined)?.roles;
  const isAdmin = Array.isArray(roles) && roles.includes("admin");
  const name = (user as { name?: string | null } | undefined)?.name?.trim();

  const counts: Counts = user
    ? await getCounts(payload, user)
    : { eventsPublished: null, eventsDraft: null, pillars: null, media: null };

  const eventsStat =
    counts.eventsPublished !== null || counts.eventsDraft !== null
      ? [
          counts.eventsPublished !== null ? `${counts.eventsPublished} published` : null,
          counts.eventsDraft !== null ? plural(counts.eventsDraft, "draft", "drafts") : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null;

  const sections: Section[] = [
    {
      id: "pages",
      titleHi: "पेज",
      titleEn: "Pages",
      cards: [
        {
          titleHi: "होम पेज",
          titleEn: "Home Page",
          description: "Hero banner, introduction, numbers and highlights on the front page.",
          path: "/globals/home-page",
        },
        {
          titleHi: "हमारे बारे में",
          titleEn: "About Page",
          description: "Our story, mission and the people behind Sewa Bharti.",
          path: "/globals/about-page",
        },
        {
          titleHi: "कार्यक्रम पेज",
          titleEn: "Events Page",
          description: "Heading and intro text shown above the list of events.",
          path: "/globals/events-page",
        },
        {
          titleHi: "संपर्क पेज",
          titleEn: "Contact Page",
          description: "Address, phone numbers, map and contact details.",
          path: "/globals/contact-page",
        },
      ],
    },
    {
      id: "content",
      titleHi: "सामग्री",
      titleEn: "Content",
      cards: [
        {
          titleHi: "सेवा कार्य",
          titleEn: "Pillars",
          description: "The four seva pillars — Shiksha, Swasthya, Swavalamban, Samajik.",
          path: "/collections/pillars",
          stat: counts.pillars !== null ? plural(counts.pillars, "pillar", "pillars") : null,
        },
        {
          titleHi: "कार्यक्रम",
          titleEn: "Events",
          description: "All events and seva activities. Edit, publish or unpublish.",
          path: "/collections/events",
          stat: eventsStat,
        },
        {
          titleHi: "नया कार्यक्रम जोड़ें",
          titleEn: "Add new event",
          description: "Write up a new event with photos, date and location.",
          path: "/collections/events/create",
          primary: true,
        },
        {
          titleHi: "फ़ोटो / मीडिया",
          titleEn: "Media / Photos",
          description: "Every photo and file uploaded to the website.",
          path: "/collections/media",
          stat: counts.media !== null ? plural(counts.media, "file", "files") : null,
        },
        {
          titleHi: "पंजीकरण",
          titleEn: "Registrations",
          description: "Entries from the registration form on the website (/register).",
          path: "/collections/registrations",
        },
        {
          titleHi: "फ़ोटो अपलोड करें",
          titleEn: "Upload photo",
          description: "Add a new photo (max 5 MB). Remember to fill in the description.",
          path: "/collections/media/create",
          primary: true,
        },
      ],
    },
    {
      id: "settings",
      titleHi: "सेटिंग्स",
      titleEn: "Settings",
      cards: [
        {
          titleHi: "साइट सेटिंग्स",
          titleEn: "Site Settings",
          description: "Logo, contact details, social media links and footer.",
          path: "/globals/site-settings",
        },
        {
          titleHi: "नेविगेशन",
          titleEn: "Navigation",
          description: "Menu links in the header and footer.",
          path: "/globals/navigation",
        },
        {
          titleHi: "UI टेक्स्ट",
          titleEn: "UI Text & Labels",
          description: "Button labels and small bits of text used across the site.",
          path: "/globals/ui-strings",
        },
        {
          titleHi: "उपयोगकर्ता",
          titleEn: "Users",
          description: "Add or remove CMS accounts. Admins only.",
          path: "/collections/users",
          adminOnly: true,
        },
      ],
    },
  ];

  return (
    <section className="sb-dash" aria-labelledby="sb-dash-title">
      <header className="sb-dash__hero">
        <div className="sb-dash__hero-text">
          <h1 id="sb-dash-title" className="sb-dash__title">
            स्वागत है — Sewa Bharti CMS
          </h1>
          <p className="sb-dash__help">
            {name ? <strong>Namaste, {name}. </strong> : null}
            Edit any page below. Changes appear on the live site within seconds after you save.
          </p>
        </div>
        <a className="sb-dash__live" href={liveSiteUrl} target="_blank" rel="noopener noreferrer">
          View live site <span aria-hidden="true">↗</span>
        </a>
      </header>

      {sections.map((section) => {
        const cards = section.cards.filter((c) => !c.adminOnly || isAdmin);
        if (cards.length === 0) return null;
        return (
          <div key={section.id} className="sb-dash__section">
            <h2 className="sb-dash__section-title">
              <span lang="hi">{section.titleHi}</span>
              <span className="sb-dash__section-en">{section.titleEn}</span>
            </h2>
            <ul className={`sb-dash__grid sb-dash__grid--${section.id}`}>
              {cards.map((card) => (
                <li key={card.path}>
                  <Link
                    href={url(card.path)}
                    className={`sb-card${card.primary ? " sb-card--primary" : ""}`}
                    prefetch={false}
                  >
                    <span className="sb-card__title">
                      <span lang="hi" className="sb-card__title-hi">
                        {card.primary ? <span aria-hidden="true">+ </span> : null}
                        {card.titleHi}
                      </span>
                      <span className="sb-card__title-en">{card.titleEn}</span>
                    </span>
                    <span className="sb-card__desc">{card.description}</span>
                    {card.stat ? <span className="sb-card__stat">{card.stat}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
