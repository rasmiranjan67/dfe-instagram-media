import Link from "next/link";
export default function NotFound() {
  return <section className="sp-hero"><div className="wrap"><h1>This page doesn&apos;t exist.</h1><p className="lede" style={{ margin: "20px 0 32px" }}>The link may be old. Head back home to see what DFE Technology builds.</p><Link className="btn btn-primary" href="/">Go to the home page</Link></div></section>;
}
