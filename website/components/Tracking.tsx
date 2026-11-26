"use client";
import Script from "next/script";
import { useEffect } from "react";
import { site } from "@/lib/site";
import { trackLead } from "@/lib/track";

export default function Tracking() {
  const gId = site.ga4Id || site.googleAdsId;
  useEffect(() => {
    const on = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const h = a.getAttribute("href") || "";
      if (h.startsWith("https://wa.me/")) trackLead("whatsapp");
      else if (h.startsWith("tel:")) trackLead("call");
      else if (h.startsWith("mailto:")) trackLead("email");
    };
    document.addEventListener("click", on, true);
    return () => document.removeEventListener("click", on, true);
  }, []);
  return (
    <>
      {gId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());${site.ga4Id ? `gtag('config','${site.ga4Id}');` : ""}${site.googleAdsId ? `gtag('config','${site.googleAdsId}');` : ""}`}</Script>
        </>
      )}
      {site.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${site.metaPixelId}');fbq('track','PageView');`}</Script>
      )}
    </>
  );
}
