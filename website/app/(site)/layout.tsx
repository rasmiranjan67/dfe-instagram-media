import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Tracking from "@/components/Tracking";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr">Skip to content</a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <Tracking />
    </>
  );
}
