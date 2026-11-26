import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";
import { getPosts } from "@/lib/posts";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${site.url}/blog/`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...getPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}/`, lastModified: new Date(p.updated || p.date), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
