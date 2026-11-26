import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog: websites, apps, games & digital marketing tips",
  description: "Practical guides from DFE Technology on website development, mobile apps, game development, SEO, AI search and digital marketing for growing businesses.",
  alternates: { canonical: "blog/" },
};
const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Blog() {
  const posts = getPosts();
  return (
    <>
      <section className="sp-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Blog</span></nav>
          <h1>Guides to grow your business online</h1>
          <p className="lede" style={{ marginTop: 22 }}>Plain-language advice on websites, apps, games, SEO and marketing. New articles every Monday, Wednesday and Friday.</p>
        </div>
      </section>
      <section className="band" style={{ paddingTop: 20 }}>
        <div className="wrap">
          {posts.length === 0 ? <p className="lede">The first articles are on their way.</p> : (
            <div className="posts">
              {posts.map((p, i) => (
                <Link key={p.slug} href={`/blog/${p.slug}/`} className={`post-card${i === 0 ? " lead-post" : ""}`}>
                  <span className="meta">{fmt(p.date)} · {p.readMins} min read</span>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <span className="more">Read article <i>›</i></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
