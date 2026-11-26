"use client";
import { useState } from "react";
import { site, waLink } from "@/lib/site";
import { WaIcon } from "./Icons";

const NEEDS = ["Website", "Online store", "Mobile app", "Game", "Digital marketing", "SEO"];
const STAGES = ["Just an idea", "Need a redesign", "Want more customers"];
const WHEN = ["This week", "This month", "Just exploring"];

export default function ContactForm({ preset }: { preset?: string }) {
  const [needs, setNeeds] = useState<string[]>(preset ? [preset] : []);
  const [err, setErr] = useState("");
  const toggle = (n: string) => setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));

  function compose(f: HTMLFormElement) {
    const d = new FormData(f);
    const name = String(d.get("name") || "").trim();
    const lines = ["Hi DFE Technology! I'd like to start a project."];
    if (name) lines.push("Name: " + name);
    const biz = String(d.get("biz") || "").trim(); if (biz) lines.push("Business: " + biz);
    const city = String(d.get("city") || "").trim(); if (city) lines.push("City: " + city);
    lines.push("I need: " + needs.join(", "));
    if (d.get("stage")) lines.push("Where I am: " + d.get("stage"));
    if (d.get("when")) lines.push("Start: " + d.get("when"));
    const msg = String(d.get("msg") || "").trim(); if (msg) lines.push("Details: " + msg);
    return { name, text: lines.join("\n") };
  }
  function valid(name: string) {
    if (!needs.length) { setErr("Pick at least one thing you need, like Website or Mobile app."); return false; }
    if (!name) { setErr("Add your name so we know who we're talking to."); return false; }
    setErr(""); return true;
  }
  function open(url: string, blank = true) {
    const a = document.createElement("a"); a.href = url; if (blank) { a.target = "_blank"; a.rel = "noopener"; }
    document.body.appendChild(a); a.click(); a.remove();
  }
  return (
    <form className="form" noValidate onSubmit={(e) => { e.preventDefault(); const m = compose(e.currentTarget); if (valid(m.name)) open(waLink(m.text)); }}>
      <fieldset>
        <legend>What do you need?</legend>
        <div className="chips">
          {NEEDS.map((n) => (
            <label className="chip" key={n}><input type="checkbox" checked={needs.includes(n)} onChange={() => toggle(n)} /><span>{n}</span></label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Where are you now?</legend>
        <div className="chips">{STAGES.map((s) => <label className="chip" key={s}><input type="radio" name="stage" value={s} /><span>{s}</span></label>)}</div>
      </fieldset>
      <fieldset>
        <legend>When do you want to start?</legend>
        <div className="chips">{WHEN.map((s) => <label className="chip" key={s}><input type="radio" name="when" value={s} /><span>{s}</span></label>)}</div>
      </fieldset>
      <div className="two">
        <div className="field"><label htmlFor="cf-name">Your name</label><input className="inp" id="cf-name" name="name" autoComplete="name" placeholder="Priya Sharma" /></div>
        <div className="field"><label htmlFor="cf-biz">Business name (optional)</label><input className="inp" id="cf-biz" name="biz" autoComplete="organization" placeholder="Sharma Jewellers" /></div>
      </div>
      <div className="field"><label htmlFor="cf-city">Your city (optional)</label><input className="inp" id="cf-city" name="city" autoComplete="address-level2" placeholder="Bhubaneswar" /></div>
      <div className="field"><label htmlFor="cf-msg">Anything else? (optional)</label><textarea className="inp" id="cf-msg" name="msg" placeholder="E.g. I sell handmade jewellery and want orders online" /></div>
      <p className="err" role="alert">{err}</p>
      <button className="btn btn-primary" type="submit" style={{ width: "100%", minHeight: 58 }}><WaIcon /> Send to DFE on WhatsApp</button>
      <button type="button" className="btn btn-line" style={{ width: "100%" }}
        onClick={(e) => { const f = (e.currentTarget.form as HTMLFormElement); const m = compose(f); if (valid(m.name)) open(`mailto:${site.email}?subject=${encodeURIComponent("New project: " + needs.join(", "))}&body=${encodeURIComponent(m.text)}`, false); }}>
        Send by email instead
      </button>
    </form>
  );
}
