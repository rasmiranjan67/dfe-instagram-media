"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { services, waLink } from "@/lib/site";
import { serviceIcon } from "./Icons";

const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [menu, setMenu] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener("scroll", on, { passive: true });
    const close = (e: MouseEvent) => { if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setMega(false); setMenu(false); } };
    document.addEventListener("click", close); document.addEventListener("keydown", esc);
    return () => { window.removeEventListener("scroll", on); document.removeEventListener("click", close); document.removeEventListener("keydown", esc); };
  }, []);
  return (
    <header className={`nav${scrolled || menu ? " scrolled" : ""}`}>
      <div className="wrap">
        <Link href="/" className="logo" aria-label="DFE Technology home"><img src={`${bp}/logo-light.png`} alt="DFE Technology" width={102} height={38} /></Link>
        <nav aria-label="Main">
          <ul>
            <li ref={megaRef} style={{ position: "relative" }}>
              <button className="link" aria-expanded={mega} aria-controls="mega" onClick={() => setMega(!mega)}>
                Services <span aria-hidden>▾</span>
              </button>
              {mega && (
                <div className="mega" id="mega">
                  {services.map((s) => { const I = serviceIcon[s.slug]; return (
                    <Link key={s.slug} href={`/services/${s.slug}/`} onClick={() => setMega(false)}>
                      <span className="ic"><I /></span>
                      <span><b>{s.name}</b><span>{s.metaDescription.split(".")[0].replace("DFE Technology ", "")}.</span></span>
                    </Link>); })}
                </div>
              )}
            </li>
            <li><Link className="link" href="/#process">How we work</Link></li>
            <li><Link className="link" href="/#audit">Free audit</Link></li>
            <li><Link className="link" href="/blog/">Blog</Link></li>
            <li><Link className="btn btn-primary" href="/#contact">Start a project</Link></li>
          </ul>
        </nav>
        <button className="burger" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">{menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
      </div>
      <div className={`mobile-menu${menu ? " open" : ""}`}>
        {services.map((s) => <Link key={s.slug} href={`/services/${s.slug}/`} onClick={() => setMenu(false)}>{s.name}</Link>)}
        <Link href="/#process" onClick={() => setMenu(false)}>How we work</Link>
        <Link href="/#audit" onClick={() => setMenu(false)}>Free audit</Link>
        <Link href="/blog/" onClick={() => setMenu(false)}>Blog</Link>
        <a className="btn btn-primary" href={waLink("Hi DFE Technology! I'd like to talk about a project.")} target="_blank" rel="noopener">Chat on WhatsApp</a>
      </div>
    </header>
  );
}
