import { homeFaqs, services, site, type Service } from "./site";
const addr = () => ({
  "@type": "PostalAddress",
  ...(site.city ? { addressLocality: site.city } : {}),
  ...(site.region ? { addressRegion: site.region } : {}),
  addressCountry: site.countryCode,
});
export const orgSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${site.url}/#org`,
      name: site.name,
      url: `${site.url}/`,
      logo: `${site.url}/logo.png`,
      image: `${site.url}/og.png`,
      description: site.description,
      email: site.email,
      telephone: site.phone,
      address: addr(),
      areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
      sameAs: [site.instagram],
      knowsAbout: services.flatMap((s) => s.keywords),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Digital services",
        itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: `${site.url}/services/${s.slug}/` } })),
      },
      contactPoint: { "@type": "ContactPoint", contactType: "sales", telephone: site.phone, email: site.email, availableLanguage: ["English", "Hindi"] },
    },
    { "@type": "WebSite", "@id": `${site.url}/#web`, url: `${site.url}/`, name: site.name, publisher: { "@id": `${site.url}/#org` }, inLanguage: "en-IN" },
  ],
});
export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
export const serviceSchema = (s: Service) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: s.name,
      serviceType: s.name,
      description: s.answer,
      url: `${site.url}/services/${s.slug}/`,
      provider: { "@id": `${site.url}/#org`, "@type": "ProfessionalService", name: site.name, url: `${site.url}/` },
      areaServed: { "@type": "Country", name: "India" },
      hasOfferCatalog: { "@type": "OfferCatalog", name: s.name, itemListElement: s.offers.map((o) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: o.title, description: o.text } })) },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: s.name, item: `${site.url}/services/${s.slug}/` },
      ],
    },
  ],
});
export { homeFaqs };
