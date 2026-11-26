import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { WaIcon } from "@/components/Icons";
import { faqSchema } from "@/lib/schema";
import { getPost, getPosts } from "@/lib/posts";
import { services, site, waLink } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  const p = getPosts().map((x) => ({ slug: x.slug }));
  return p.length ? p : [{ slug: "coming-soon" }];
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return { robots: { index: false } };
  return {
    title: { absolute: `${p.title} | DFE Technology` }, description: p.description, keywords: p.keywords,
    alternates: { canonical: `blog/${p.slug}/` },
    openGraph: { type: "article", title: p.title, description: p.description, url: `blog/${p.slug}/`, publishedTime: p.date, modifiedTime: p.updated || p.date, images: ["og.png"] },
  };
}
const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const more = getPosts().filter((x) => x.slug !== p.slug).slice(0, 3);
  const text = (p.title + " " + p.keywords.join(" ")).toLowerCase();
  const related = services.filter((s) => s.keywords.some((k) => k.split(" ").some((w) => w.length > 4 && text.includes(w)))).slice(0, 2);
  const article = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BlogPosting", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.updated || p.date,
        keywords: p.keywords.join(", "), mainEntityOfPage: `${site.url}/blog/${p.slug}/`, image: `${site.url}/og.png`, inLanguage: "en-IN",
        author: { "@type": "Organization", name: site.name, url: `${site.url}/` }, publisher: { "@id": `${site.url}/#org`, "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/logo.png` } } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
        { "@type": "ListItem", position: 3, name: p.title, item: `${site.url}/blog/${p.slug}/` } ] },
    ],
  };
  return (
    <>
      <JsonLd data={article} />
      {p.faqs.length > 0 && <JsonLd data={faqSchema(p.faqs)} />}
      <article>
        <header className="sp-hero" style={{ paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span><Link href="/blog/">Blog</Link></nav>
            <h1 style={{ fontSize: "clamp(32px,4.6vw,56px)", maxWidth: "none" }}>{p.title}</h1>
            <p className="lede" style={{ marginTop: 20 }}>{p.description}</p>
            <p className="meta" style={{ marginTop: 20, color: "var(--dim)", fontSize: 15 }}>By {site.name} · <time dateTime={p.date}>{fmt(p.date)}</time>{p.updated ? <> · Updated <time dateTime={p.updated}>{fmt(p.updated)}</time></> : null} · {p.readMins} min read</p>
          </div>
        </header>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
          {p.faqs.length > 0 && (
            <section style={{ marginTop: 56 }}>
              <h2 style={{ fontSize: 30, marginBottom: 20 }}>Frequently asked questions</h2>
              <div className="faq">{p.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
            </section>
          )}
          <aside className="post-cta">
            <h2>Need help with this?</h2>
            <p>DFE Technology builds websites, apps and games and runs digital marketing. Tell us what you need and get a plan and fixed quote on WhatsApp.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href={waLink(`Hi DFE Technology! I read "${p.title}" and want to talk.`)} target="_blank" rel="noopener"><WaIcon /> Chat on WhatsApp</a>
              {related.map((s) => <Link key={s.slug} className="btn btn-line" href={`/services/${s.slug}/`}>{s.name}</Link>)}
            </div>
          </aside>
        </div>
      </article>
      {more.length > 0 && (
        <section className="band">
          <div className="wrap">
            <h2 style={{ marginBottom: 32 }}>More articles</h2>
            <div className="posts">{more.map((m) => <Link key={m.slug} href={`/blog/${m.slug}/`} className="post-card"><span className="meta">{fmt(m.date)}</span><h2>{m.title}</h2><p>{m.description}</p></Link>)}</div>
          </div>
        </section>
      )}
    </>
  );
}
