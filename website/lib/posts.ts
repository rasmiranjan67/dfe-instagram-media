import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import firestorePosts from "../content/generated/posts.json";

export type Post = {
  slug: string; title: string; description: string; date: string; updated?: string;
  keywords: string[]; body: string; html: string; faqs: { q: string; a: string }[];
  source: "repo" | "admin"; readMins: number;
};

const dir = path.join(process.cwd(), "content", "blog");
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function build(p: Partial<Post> & { body: string; title: string }, source: Post["source"]): Post {
  const slug = p.slug ? slugify(p.slug) : slugify(p.title);
  const words = p.body.split(/\s+/).length;
  return {
    slug, title: p.title, description: p.description || "", date: p.date || new Date().toISOString(),
    updated: p.updated || undefined, keywords: Array.isArray(p.keywords) ? p.keywords : String(p.keywords || "").split(",").map((k) => k.trim()).filter(Boolean),
    body: p.body, html: marked.parse(p.body, { async: false }) as string, faqs: Array.isArray(p.faqs) ? p.faqs : [],
    source, readMins: Math.max(1, Math.round(words / 220)),
  };
}

let cache: Post[] | null = null;
export function getPosts(): Post[] {
  if (cache) return cache;
  const map = new Map<string, Post>();
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      if (data.draft) continue;
      const date = data.date instanceof Date ? data.date.toISOString() : data.date;
      const p = build({ ...data, date, body: content, title: data.title } as Post, "repo");
      map.set(p.slug, p);
    }
  }
  // Posts written in the admin panel win over repo posts with the same slug.
  for (const raw of firestorePosts as Array<Record<string, unknown>>) {
    if (!raw.title || !raw.body) continue;
    const p = build(raw as unknown as Post, "admin");
    if (raw.published === false) { map.delete(p.slug); continue; }
    map.set(p.slug, p);
  }
  cache = [...map.values()].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return cache;
}
export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);
