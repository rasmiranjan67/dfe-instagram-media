import Link from "next/link";
import { place, services, site, waLink } from "@/lib/site";
import { WaIcon } from "./Icons";
const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
export default function Footer() {
  return (
    <>
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <img src={`${bp}/logo-light.png`} alt="DFE Technology" width={108} height={40} />
              <p style={{ maxWidth: "36ch" }}>{site.description}</p>
            </div>
            <div><h4>Services</h4><ul>{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}/`}>{s.name}</Link></li>)}</ul></div>
            <div><h4>Company</h4><ul><li><Link href="/#process">How we work</Link></li><li><Link href="/#audit">Free website audit</Link></li><li><Link href="/#faq">FAQ</Link></li><li><Link href="/#contact">Contact</Link></li></ul></div>
            <div><h4>Contact</h4><ul>
              <li><a href={waLink("Hi DFE Technology!")} target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a href={site.instagram} target="_blank" rel="noopener">Instagram @dfe_technology</a></li>
              <li>{place()}</li>
            </ul></div>
          </div>
          <div className="base"><span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span><span>Websites · Apps · Games · Digital marketing</span></div>
        </div>
      </footer>
      <a className="fab" href={waLink("Hi DFE Technology! I'd like to talk about a project.")} target="_blank" rel="noopener" aria-label="Chat with DFE Technology on WhatsApp"><span className="dot" /> Chat with us</a>
    </>
  );
}
