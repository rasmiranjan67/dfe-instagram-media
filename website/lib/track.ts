"use client";
import { site } from "./site";
type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
export function trackLead(kind: "whatsapp" | "call" | "email" | "form" | "audit") {
  const w = window as W;
  try {
    w.gtag?.("event", "generate_lead", { lead_type: kind });
    if (site.googleAdsId && site.googleAdsLabel) w.gtag?.("event", "conversion", { send_to: `${site.googleAdsId}/${site.googleAdsLabel}` });
    w.fbq?.(kind === "whatsapp" || kind === "call" ? "track" : "track", kind === "call" ? "Contact" : "Lead", { content_name: kind });
  } catch { /* tracking must never break the page */ }
}
