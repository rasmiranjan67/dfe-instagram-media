"use client";
import dynamic from "next/dynamic";
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });
export default function HeroCanvas() {
  return (
    <>
      <div className="hero-fallback" aria-hidden />
      <div className="hero-canvas"><Hero3D /></div>
    </>
  );
}
