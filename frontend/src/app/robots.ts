import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Portals and login pages are private (they also send noindex).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/login/", "/portal/", "/api/"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
