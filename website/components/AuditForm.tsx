"use client";
import { useState } from "react";
import { waLink } from "@/lib/site";
import { saveLead } from "@/lib/leads";
export default function AuditForm() {
  const [err, setErr] = useState("");
  return (
    <form className="form" noValidate onSubmit={(e) => {
      e.preventDefault();
      const d = new FormData(e.currentTarget);
      const url = String(d.get("url") || "").trim(), nm = String(d.get("nm") || "").trim();
      if (!url) { setErr("Enter your website address, for example www.yourbusiness.com."); return; }
      setErr("");
      const a = document.createElement("a");
      a.href = waLink(`Hi DFE Technology! I'd like a free website audit.\nWebsite: ${url}${nm ? "\nName: " + nm : ""}`);
      a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
      saveLead({ source: "audit", name: nm, website: url, page: location.pathname });
    }}>
      <div className="field"><label htmlFor="au-url">Your website address</label><input className="inp" id="au-url" name="url" inputMode="url" placeholder="www.yourbusiness.com" /></div>
      <div className="field"><label htmlFor="au-nm">Your name</label><input className="inp" id="au-nm" name="nm" autoComplete="name" placeholder="Your name" /></div>
      <p className="err" role="alert">{err}</p>
      <button className="btn btn-primary" type="submit" style={{ minHeight: 58 }}>Get my free audit on WhatsApp</button>
    </form>
  );
}
