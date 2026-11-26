import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
