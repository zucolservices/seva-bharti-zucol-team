import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header, { HeaderView } from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent, getGlobal, getPillars } from "@/lib/cms";
import { buildNavItems, siteLogo, a11yLabels } from "@/lib/site-data";
import type { HeaderData } from "@/lib/view-types";
import { HEADER_CTA, HEADER_NAV } from "@/content/navigation";
import { resolveFooter } from "@/content/resolve";
import { siteUrl } from "@/lib/site-url";

const latin = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-latin",
  weight: ["400", "500", "600", "700"],
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "swap",
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobal("site-settings");
  const name = settings?.name ?? "";
  const defaultTitle =
    settings?.metaTitle || [name, settings?.taglineEn].filter(Boolean).join(" — ") || name;
  const shortName = settings?.shortName || name;
  const description = settings?.metaDescription || settings?.introEn || undefined;
  const logo = siteLogo(settings);
  return {
    // Absolute base for Open Graph / canonical URLs (see src/lib/site-url.ts).
    metadataBase: new URL(siteUrl()),
    title: {
      default: defaultTitle,
      template: shortName ? `%s | ${shortName}` : "%s",
    },
    description,
    icons: { icon: logo.url },
    // Link previews when pages are shared (WhatsApp, Facebook, X …).
    openGraph: {
      type: "website",
      siteName: name || undefined,
      title: defaultTitle,
      description,
      images: [{ url: logo.url, alt: logo.alt }],
    },
    twitter: { card: "summary" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, ui, pillars, footerContent] = await Promise.all([
    getGlobal("site-settings"),
    getGlobal("ui-strings"),
    getPillars(),
    getContent("footer-content"),
  ]);

  const logo = siteLogo(settings);
  const header: HeaderData = {
    a11y: a11yLabels(ui),
    siteName: settings?.name ?? "",
    logoUrl: logo.url,
    logoAlt: logo.alt,
    brandTitle: settings?.brandTitle ?? "",
    tagline: settings?.tagline ?? "",
    items: buildNavItems(HEADER_NAV, pillars),
    cta: HEADER_CTA,
  };

  return (
    <html lang="en" className={`${latin.variable} ${devanagari.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-saffron-700 focus:shadow"
        >
          {/* Accessibility default when the CMS label is empty. */}
          {ui?.skipLink || "Skip to main content"}
        </a>
        <TopBar
          settings={settings}
          links={header.items.filter((i) => i.utility).flatMap((i) => i.children)}
          cta={header.cta}
        />
        {/* usePathname suspends while dynamic routes prerender their App Shell. */}
        <Suspense fallback={<HeaderView {...header} pathname={null} />}>
          <Header {...header} />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} content={resolveFooter(footerContent)} />
      </body>
    </html>
  );
}
