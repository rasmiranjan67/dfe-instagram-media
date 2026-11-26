import { homeFaqs, place, services, site } from "@/lib/site";
import { getPosts } from "@/lib/posts";
export const dynamic = "force-static";
export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Location: ${place()}. Serves clients across India and worldwide.`,
    `Contact: WhatsApp https://wa.me/${site.whatsapp} | Phone ${site.phone} | Email ${site.email} | Instagram ${site.instagram}`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.name}](${site.url}/services/${s.slug}/): ${s.answer}`),
    "",
    "## Articles",
    ...getPosts().slice(0, 30).map((p) => `- [${p.title}](${site.url}/blog/${p.slug}/): ${p.description}`),
    "",
    "## FAQ",
    ...homeFaqs.map((f) => `- ${f.q} ${f.a}`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
