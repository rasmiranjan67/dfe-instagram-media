"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const C1 = new THREE.Color("#8A3DFF");
const C2 = new THREE.Color("#E21CB8");
const C3 = new THREE.Color("#FF2D55");
const gradAt = (t: number) =>
  t < 0.5 ? C1.clone().lerp(C2, t * 2) : C2.clone().lerp(C3, (t - 0.5) * 2);

/* The DFE swoosh: a ribbon tube with the logo gradient along its length */
function Swoosh({ radius = 0.12, offset = 0, speed = 1 }: { radius?: number; offset?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * 3.1, Math.sin(t * 2) * 0.55 + Math.sin(t) * 0.4, Math.sin(t) * 1.9));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const g = new THREE.TubeGeometry(curve, 600, radius, 24, true);
    const colors: number[] = [];
    const segs = 600, rad = 25;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const c = gradAt(t < 0.5 ? t * 2 : 2 - t * 2);
      for (let j = 0; j < rad; j++) colors.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors.slice(0, g.attributes.position.count * 3), 3));
    return g;
  }, [radius]);
  useFrame((s) => {
    const t = s.clock.elapsedTime * speed;
    ref.current.rotation.y = t * 0.18 + offset;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.12 + offset * 0.2;
  });
  return (
    <mesh ref={ref} geometry={geo} rotation={[0.35, offset, -0.25]}>
      <meshPhysicalMaterial vertexColors roughness={0.18} metalness={0.25} clearcoat={1} clearcoatRoughness={0.1} emissive="#3a0b5c" emissiveIntensity={0.35} />
    </mesh>
  );
}

/* Floating glass objects: browser window, phone, gamepad, growth chart */
function Floater({ pos, rot = 0, children, phase = 0 }: { pos: [number, number, number]; rot?: number; children: React.ReactNode; phase?: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime + phase;
    ref.current.position.y = pos[1] + Math.sin(t * 0.9) * 0.14;
    ref.current.rotation.y = rot + Math.sin(t * 0.5) * 0.25;
    ref.current.rotation.x = Math.sin(t * 0.7) * 0.08;
  });
  return <group ref={ref} position={pos}>{children}</group>;
}

const glass = { roughness: 0.08, metalness: 0.1, transmission: 0.6, thickness: 0.6, clearcoat: 1, transparent: true, opacity: 0.92 } as const;

function Browser() {
  return (
    <group scale={0.9}>
      <mesh><boxGeometry args={[1.9, 1.25, 0.08]} /><meshPhysicalMaterial color="#1d1033" {...glass} /></mesh>
      <mesh position={[0, 0.53, 0.05]}><boxGeometry args={[1.9, 0.18, 0.02]} /><meshStandardMaterial color="#8A3DFF" emissive="#8A3DFF" emissiveIntensity={0.6} /></mesh>
      {[-0.78, -0.66, -0.54].map((x, i) => (
        <mesh key={i} position={[x, 0.53, 0.07]}><circleGeometry args={[0.035, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
      ))}
      <mesh position={[-0.35, 0.15, 0.05]}><boxGeometry args={[0.95, 0.14, 0.02]} /><meshStandardMaterial color="#F4EEFF" emissive="#F4EEFF" emissiveIntensity={0.3} /></mesh>
      <mesh position={[-0.5, -0.05, 0.05]}><boxGeometry args={[0.65, 0.08, 0.02]} /><meshStandardMaterial color="#B3A6CC" /></mesh>
      <mesh position={[-0.48, -0.3, 0.05]}><boxGeometry args={[0.6, 0.18, 0.02]} /><meshStandardMaterial color="#E21CB8" emissive="#E21CB8" emissiveIntensity={0.7} /></mesh>
      <mesh position={[0.5, -0.15, 0.05]}><boxGeometry args={[0.6, 0.6, 0.02]} /><meshStandardMaterial color="#FF2D55" emissive="#FF2D55" emissiveIntensity={0.35} /></mesh>
    </group>
  );
}
function Phone() {
  return (
    <group scale={0.85}>
      <mesh><boxGeometry args={[0.7, 1.4, 0.08]} /><meshPhysicalMaterial color="#160b28" {...glass} /></mesh>
      <mesh position={[0, 0, 0.05]}><planeGeometry args={[0.6, 1.24]} /><meshStandardMaterial color="#2a0f4a" emissive="#5b16a8" emissiveIntensity={0.45} /></mesh>
      {[0.35, 0.1, -0.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0.06]}><boxGeometry args={[0.48, 0.16, 0.01]} /><meshStandardMaterial color={i === 0 ? "#E21CB8" : "#F4EEFF"} emissive={i === 0 ? "#E21CB8" : "#B3A6CC"} emissiveIntensity={0.4} /></mesh>
      ))}
      <mesh position={[0, -0.45, 0.06]}><circleGeometry args={[0.09, 24]} /><meshStandardMaterial color="#FF2D55" emissive="#FF2D55" emissiveIntensity={0.8} /></mesh>
    </group>
  );
}
function Gamepad() {
  return (
    <group scale={0.75}>
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.38, 0.9, 12, 24]} /><meshPhysicalMaterial color="#8A3DFF" roughness={0.25} clearcoat={1} metalness={0.2} emissive="#3b0f80" emissiveIntensity={0.4} /></mesh>
      <mesh position={[-0.42, 0.02, 0.36]}><boxGeometry args={[0.3, 0.09, 0.05]} /><meshStandardMaterial color="#fff" /></mesh>
      <mesh position={[-0.42, 0.02, 0.36]}><boxGeometry args={[0.09, 0.3, 0.05]} /><meshStandardMaterial color="#fff" /></mesh>
      <mesh position={[0.38, 0.1, 0.34]}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color="#FF2D55" emissive="#FF2D55" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0.52, -0.04, 0.34]}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color="#E21CB8" emissive="#E21CB8" emissiveIntensity={0.6} /></mesh>
    </group>
  );
}
function Growth() {
  const hs = [0.35, 0.6, 0.5, 0.9, 1.25];
  return (
    <group scale={0.8}>
      {hs.map((h, i) => (
        <mesh key={i} position={[i * 0.26 - 0.52, h / 2 - 0.5, 0]}>
          <boxGeometry args={[0.18, h, 0.18]} />
          <meshPhysicalMaterial color={gradAt(i / 4)} emissive={gradAt(i / 4)} emissiveIntensity={0.35} roughness={0.2} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

function Stars() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 900, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 18;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20 - 6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame((s) => { ref.current.rotation.y = s.clock.elapsedTime * 0.01; });
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.03} color="#cdbaff" transparent opacity={0.7} /></points>;
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  const { size } = useThree();
  const mobile = size.width < 760;
  useFrame((s) => {
    ref.current.rotation.y += ((s.pointer.x * 0.25) - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x += ((-s.pointer.y * 0.12) - ref.current.rotation.x) * 0.04;
  });
  return (
    <group ref={ref} position={mobile ? [0, 1.7, 0] : [size.width < 1200 ? 3.0 : 3.5, 0.1, 0]} scale={mobile ? 0.6 : size.width < 1200 ? 0.8 : 0.95}>
      {children}
    </group>
  );
}

export default function Hero3D() {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduce ? "demand" : "always"}
      aria-hidden
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <pointLight position={[-5, -2, 4]} intensity={30} color="#E21CB8" />
      <pointLight position={[5, 3, -2]} intensity={25} color="#8A3DFF" />
      <Stars />
      <Rig>
        <Swoosh />
        <Swoosh radius={0.035} offset={0.6} speed={1.3} />
        <Floater pos={[-0.6, 0.95, 1.1]} rot={0.35} phase={0}><Browser /></Floater>
        <Floater pos={[1.6, -0.55, 0.8]} rot={-0.4} phase={1.4}><Phone /></Floater>
        <Floater pos={[-1.55, -1.1, 0.4]} rot={0.3} phase={2.6}><Gamepad /></Floater>
        <Floater pos={[1.35, 1.35, -0.6]} rot={-0.3} phase={3.8}><Growth /></Floater>
        <mesh position={[0, 0, -0.4]}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.9} thickness={1.2} ior={1.4} clearcoat={1} />
        </mesh>
      </Rig>
    </Canvas>
  );
}
