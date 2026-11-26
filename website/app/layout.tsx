import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { orgSchema } from "@/lib/schema";
import { services, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url + "/"),
  title: { default: "DFE Technology | Website, App & Game Development and Digital Marketing in India", template: "%s | DFE Technology" },
  description: site.description,
  keywords: services.flatMap((s) => s.keywords).concat(["DFE Technology", "digital agency India", "web development company"]),
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "./" },
  openGraph: { type: "website", siteName: site.name, locale: "en_IN", url: "./", title: "DFE Technology | Websites, apps, games & digital marketing", description: site.description, images: [{ url: "og.png", width: 1200, height: 630, alt: "DFE Technology" }] },
  twitter: { card: "summary_large_image", title: "DFE Technology", description: site.description, images: ["og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  category: "technology",
};
export const viewport: Viewport = { themeColor: "#0B0614", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@500;600;700&display=swap" />
        <JsonLd data={orgSchema()} />
      </head>
      <body>
        <a href="#main" className="sr">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
