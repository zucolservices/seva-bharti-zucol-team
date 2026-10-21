import type { MetadataRoute } from "next";
import { getEvents, getPillars } from "@/lib/cms";
import { siteUrl } from "@/lib/site-url";

// Public pages: fixed routes, every pillar page and every published event.
const STATIC_ROUTES = ["/", "/about-us", "/our-work", "/csr", "/volunteer", "/gallery", "/partners", "/events", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [pillars, events] = await Promise.all([getPillars(), getEvents()]);
  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${base}${path}` })),
    ...pillars.map((p) => ({ url: `${base}/${p.slug}` })),
    ...events.map((e) => ({ url: `${base}/blog/${e.slug}`, lastModified: e.updatedAt })),
  ];
}
