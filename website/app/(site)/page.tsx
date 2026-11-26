import Link from "next/link";
import HeroCanvas from "@/components/HeroCanvas";
import ContactForm from "@/components/ContactForm";
import AuditForm from "@/components/AuditForm";
import JsonLd from "@/components/JsonLd";
import { WaIcon, IconMail, IconPhone, IconInsta, serviceIcon } from "@/components/Icons";
import { faqSchema } from "@/lib/schema";
import { homeFaqs, place, services, site, waLink } from "@/lib/site";

const pains = [
  { t: "Nobody finds you on Google", d: "Customers search for what you sell and find your competitors instead." },
  { t: "Your website doesn't bring enquiries", d: "Slow, outdated or hard to use on a phone, so visitors leave without contacting you." },
  { t: "Social media without results", d: "Posting regularly but likes aren't turning into customers or sales." },
  { t: "Too many vendors", d: "One person for the website, another for the app, another for ads. Nothing connects." },
];
const industries = [
  { b: "Retail & shops", s: "Online stores, catalogues and local SEO" },
  { b: "Restaurants & cafés", s: "Ordering apps, menus and reels" },
  { b: "Clinics & healthcare", s: "Booking websites and Google visibility" },
  { b: "Education & coaching", s: "Course sites, learning apps and games" },
  { b: "Real estate", s: "Property listings and lead campaigns" },
  { b: "Startups", s: "MVP apps, launch sites and growth" },
  { b: "Fitness & salons", s: "Booking apps and social content" },
  { b: "Brands & D2C", s: "E-commerce, ads and branded games" },
];
const journey = [
  { t: "Chat", d: "Tell us your goal on WhatsApp or a call. We ask the right questions." },
  { t: "Plan & quote", d: "A clear plan, timeline and fixed price before work starts." },
  { t: "Design", d: "See screens and give feedback before anything is built." },
  { t: "Build & launch", d: "We develop, test on real devices and go live." },
  { t: "Grow", d: "Marketing, SEO and updates so it keeps bringing customers." },
];
const compare: [string, string, string, string][] = [
  ["Website, app, game and marketing in one team", "yes", "no", "yes"],
  ["Fixed quote before work starts", "yes", "Sometimes", "Sometimes"],
  ["Direct WhatsApp updates from the team", "yes", "yes", "no"],
  ["SEO and speed included as standard", "yes", "Sometimes", "Extra cost"],
  ["Marketing after launch", "yes", "no", "yes"],
  ["Pricing for growing businesses", "yes", "yes", "no"],
];
const cell = (v: string) => (v === "yes" ? <span className="yes" aria-label="Yes">✓</span> : v === "no" ? <span className="no" aria-label="No">—</span> : <span className="no">{v}</span>);

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />
      <section className="hero">
        <HeroCanvas />
        <div className="wrap">
          <h1 className="rise">We build websites, apps &amp; games <span className="grad-text">that grow your business.</span></h1>
          <p className="lede rise">DFE Technology is a digital agency in {place()} for website development, mobile app development, game development and digital marketing. Tell us your goal; we&apos;ll reply with a plan and a fixed quote, usually the same day.</p>
          <div className="ctas rise">
            <a className="btn btn-primary" href={waLink("Hi DFE Technology! I'd like to talk about a project.")} target="_blank" rel="noopener"><WaIcon /> Chat on WhatsApp</a>
            <Link className="btn btn-line" href="#services">Explore services</Link>
          </div>
          <div className="proof rise"><span>Reply within a few hours</span><span>Fixed quote before we start</span><span>SEO &amp; speed built in</span></div>
        </div>
      </section>

      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((k) => <span key={k}>{["Website development", "E-commerce", "Android & iOS apps", "Game development", "Social media marketing", "Meta & Google ads", "SEO", "UI/UX design"].map((t) => <span key={t}>{t}</span>)}</span>)}
        </div>
      </div>

      <section className="band">
        <div className="wrap">
          <div className="head"><h2>Struggling to get customers online?</h2><p className="lede">Most businesses we talk to are stuck on at least one of these.</p></div>
          <div className="pains">{pains.map((p) => <div className="pain" key={p.t}><span className="x" aria-hidden>✕</span><h3>{p.t}</h3><p>{p.d}</p></div>)}</div>
          <div className="fix"><p>One team that builds it, ranks it and markets it. That&apos;s DFE.</p><Link className="btn btn-primary" href="#contact">Fix it with us</Link></div>
        </div>
      </section>

      <section className="band band-alt" id="services">
        <div className="wrap">
          <div className="head"><h2>Everything your business needs online, under one roof.</h2><p className="lede">Design, development and marketing working together, so every part pushes the same goal: more customers.</p></div>
          <div className="bento">
            {services.map((s, i) => { const I = serviceIcon[s.slug]; const glow = ["#8A3DFF", "#E21CB8", "#FF2D55", "#8A3DFF"][i]; return (
              <Link className="svc" key={s.slug} href={`/services/${s.slug}/`}>
                <span className="glow" style={{ background: glow }} aria-hidden />
                {(i === 0 || i === 3) && <span className="art" aria-hidden style={{ opacity: .14, width: 200, height: 200, right: 40, top: "auto", bottom: 40 }}><I /></span>}
                <span className="kicker" style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--grad)", display: "grid", placeItems: "center" }}><span style={{ width: 20, height: 20, display: "block" }}><I /></span></span>{s.short}</span>
                <h3>{s.h1}</h3>
                <p>{s.intro}</p>
                <ul>{s.offers.slice(0, 4).map((o) => <li key={o.title}>{o.title}</li>)}</ul>
                <span className="more">Explore {s.short.toLowerCase()} <i>›</i></span>
              </Link>); })}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="head"><h2>Built for businesses like yours.</h2><p className="lede">From neighbourhood shops to funded startups, we tailor the plan to how your customers buy.</p></div>
          <div className="inds">{industries.map((x) => <div className="ind" key={x.b}><b>{x.b}</b><span>{x.s}</span></div>)}</div>
        </div>
      </section>

      <section className="band band-alt" id="process">
        <div className="wrap">
          <div className="head"><h2>From first message to more customers.</h2><p className="lede">No jargon and no surprise bills. You always know what happens next.</p></div>
          <ol className="journey" style={{ listStyle: "none" }}>{journey.map((j, i) => <li className="step" key={j.t}><div className="n">{i + 1}</div><h3>{j.t}</h3><p>{j.d}</p></li>)}</ol>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="head"><h2>Why choose DFE over a freelancer or a big agency?</h2><p className="lede">The speed and personal attention of a small team, with the full range of a large one.</p></div>
          <div className="scroll">
            <table className="compare">
              <thead><tr><th scope="col">What you get</th><th scope="col" className="us">DFE Technology</th><th scope="col">Typical freelancer</th><th scope="col">Typical big agency</th></tr></thead>
              <tbody>{compare.map((r) => <tr key={r[0]}><td>{r[0]}</td><td className="us">{cell(r[1])}</td><td>{cell(r[2])}</td><td>{cell(r[3])}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="band band-alt" id="audit">
        <div className="wrap">
          <div className="audit">
            <div>
              <h2>Get a free website audit.</h2>
              <p className="lede" style={{ marginTop: 18 }}>Send your website and we&apos;ll tell you, in plain language, what&apos;s stopping it from bringing customers.</p>
              <ul><li>Speed on mobile</li><li>Google visibility and SEO basics</li><li>How easy it is to contact you</li><li>Design and trust fixes to make first</li></ul>
            </div>
            <AuditForm />
          </div>
        </div>
      </section>

      <section className="band" id="faq">
        <div className="wrap">
          <div className="head"><h2>Questions people ask us.</h2></div>
          <div className="faq">{homeFaqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="band band-alt" id="contact">
        <div className="wrap contact">
          <div>
            <h2>Let&apos;s build something your customers love.</h2>
            <p className="lede" style={{ marginTop: 18 }}>Takes 30 seconds. Your details go straight to our WhatsApp, and we reply with ideas and a quote.</p>
            <div className="direct">
              <a href={waLink("Hi DFE Technology!")} target="_blank" rel="noopener"><span className="ic"><WaIcon /></span><span><small>WhatsApp</small><b>Chat with the team</b></span></a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}><span className="ic"><IconPhone /></span><span><small>Call</small><b>{site.phone}</b></span></a>
              <a href={`mailto:${site.email}`}><span className="ic"><IconMail /></span><span><small>Email</small><b>{site.email}</b></span></a>
              <a href={site.instagram} target="_blank" rel="noopener"><span className="ic"><IconInsta /></span><span><small>Instagram</small><b>@dfe_technology</b></span></a>
            </div>
          </div>
          <div className="card"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
