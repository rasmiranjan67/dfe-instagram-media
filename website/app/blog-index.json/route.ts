import { getPosts } from "@/lib/posts";
export const dynamic = "force-static";
// Lets the admin panel list posts that live in the code repo (written by the auto-blog).
export function GET() {
  return Response.json(getPosts().map((p) => ({ slug: p.slug, title: p.title, description: p.description, date: p.date, keywords: p.keywords, body: p.body, faqs: p.faqs, source: p.source })));
}
