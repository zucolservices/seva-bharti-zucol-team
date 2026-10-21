// Public origin of the website, for absolute URLs (Open Graph, sitemap,
// robots). Set SITE_URL in production (e.g. https://sewabhartirajasthan.org);
// on Vercel the production domain is used when SITE_URL is not set.
export function siteUrl(): string {
  const fromEnv =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return (fromEnv || "http://localhost:3000").replace(/\/+$/, "");
}
