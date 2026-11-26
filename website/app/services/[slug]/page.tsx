import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { WaIcon } from "@/components/Icons";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { place, services, waLink } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: { absolute: s.metaTitle },
    description: s.metaDescription,
    keywords: s.keywords,
    alternates: { canonical: `services/${s.slug}/` },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `services/${s.slug}/`, images: ["og.png"] },
  };
}

const presetFor: Record<string, string> = { "website-development": "Website", "app-development": "Mobile app", "game-development": "Game", "digital-marketing": "Digital marketing" };
const steps = ["Free consultation", "Plan, timeline & fixed quote", "Design & feedback", "Build, test & launch", "Support & growth"];

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug);
  return (
    <>
      <JsonLd data={serviceSchema(s)} />
      <JsonLd data={faqSchema(s.faqs)} />
      <section className="sp-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden>/</span><span>Services</span><span aria-hidden>/</span><span aria-current="page">{s.name}</span></nav>
          <h1>{s.h1}</h1>
          <p className="answer">{s.answer.replace("in India", `in ${place()}`)}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
            <a className="btn btn-primary" href={waLink(s.waText)} target="_blank" rel="noopener"><WaIcon /> Get a free quote</a>
            <Link className="btn btn-line" href="#contact">Tell us about your project</Link>
          </div>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="head"><h2>What we offer</h2><p className="lede">{s.intro}</p></div>
          <div className="offers">{s.offers.map((o) => <article className="offer" key={o.title}><h3>{o.title}</h3><p>{o.text}</p></article>)}</div>
        </div>
      </section>

      <section className="band band-alt">
        <div className="wrap split">
          <div><h2>Who it&apos;s for</h2><ul className="ticks">{s.forWho.map((w) => <li key={w}>{w}</li>)}</ul></div>
          <div><h2>How it works</h2><ol className="ticks" style={{ listStyle: "none" }}>{steps.map((t, i) => <li key={t}><b style={{ marginRight: 6 }}>{i + 1}.</b>{t}</li>)}</ol>
            <h3 style={{ marginTop: 40 }}>Tools &amp; technology</h3><div className="stack">{s.stack.map((t) => <span key={t}>{t}</span>)}</div></div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="head"><h2>{s.name}: common questions</h2></div>
          <div className="faq">{s.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="band band-alt" id="contact">
        <div className="wrap contact">
          <div>
            <h2>Start your {s.short.toLowerCase()} project</h2>
            <p className="lede" style={{ marginTop: 18 }}>Answer a few quick questions. Your message goes straight to our WhatsApp.</p>
            <h3 style={{ marginTop: 44, marginBottom: 14 }}>Other services</h3>
            <div className="direct">{others.map((o) => <Link key={o.slug} href={`/services/${o.slug}/`}><span><small>{o.short}</small><b>{o.name}</b></span></Link>)}</div>
          </div>
          <div className="card"><ContactForm preset={presetFor[s.slug]} /></div>
        </div>
      </section>
    </>
  );
}
