import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DecorationKind } from "@/game/config";
import type { Placement } from "@/game/scoring";

function Flame({ y = 0.16 }: { y?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      const k = 1 + Math.sin(t * 9) * 0.12 + Math.sin(t * 21) * 0.05;
      ref.current.scale.set(1, k, 1);
    }
  });
  return (
    <group position={[0, y, 0]}>
      <mesh ref={ref}>
        <coneGeometry args={[0.05, 0.16, 10]} />
        <meshStandardMaterial color="#ffd27a" emissive="#ff9b1f" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <pointLight color="#ff9a2e" intensity={2.2} distance={2.6} decay={2} position={[0, 0.1, 0]} />
    </group>
  );
}

function FlowerCluster({ color = "#ff8a1e" }: { color?: string }) {
  const pts: [number, number, number][] = [
    [0, 0.1, 0],
    [0.16, 0.07, 0.1],
    [-0.14, 0.07, 0.12],
    [0.05, 0.08, -0.17],
    [-0.06, 0.16, -0.02],
  ];
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <dodecahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial color={i % 2 ? color : "#ffc107"} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function Diya() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.18, 18, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#b5651d" metalness={0.85} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 18]} />
        <meshStandardMaterial color="#e8c07d" metalness={0.7} roughness={0.35} />
      </mesh>
      <Flame y={0.1} />
    </group>
  );
}

function Modak() {
  return (
    <group>
      <mesh castShadow position={[0, 0.12, 0]}>
        <coneGeometry args={[0.14, 0.26, 12]} />
        <meshStandardMaterial color="#f7e6bd" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#8a5a2b" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Rangoli() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
      <mesh>
        <circleGeometry args={[0.95, 40]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.25} />
      </mesh>
      {[
        ["#ff5c39", 0.85],
        ["#ffc93c", 0.62],
        ["#5fbf7e", 0.4],
        ["#f25ba0", 0.2],
      ].map(([c, r], i) => (
        <mesh key={i} position={[0, 0, 0.002 * (i + 1)]}>
          <ringGeometry args={[(r as number) - 0.12, r as number, 32]} />
          <meshStandardMaterial color={c as string} roughness={0.8} />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0.01]}>
            <circleGeometry args={[0.08, 12]} />
            <meshStandardMaterial color={i % 2 ? "#ffd93d" : "#ff7043"} />
          </mesh>
        );
      })}
    </group>
  );
}

function Petals() {
  const pts = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    const r = 0.15 + (i % 3) * 0.12;
    return [Math.cos(a) * r, 0.015, Math.sin(a) * r] as [number, number, number];
  });
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p} rotation={[-Math.PI / 2, 0, i]}>
          <circleGeometry args={[0.075, 8]} />
          <meshStandardMaterial color={i % 2 ? "#ff6f61" : "#ffb74d"} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Utsav() {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 0.7, 12]} />
        <meshStandardMaterial color="#c9962b" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.76, 0]} castShadow>
        <sphereGeometry args={[0.22, 18, 14]} />
        <meshStandardMaterial color="#ffd76a" emissive="#ff9a2e" emissiveIntensity={1.2} metalness={0.6} roughness={0.3} />
      </mesh>
      <pointLight color="#ffb14d" intensity={3} distance={4} decay={2} position={[0, 0.8, 0]} />
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.08, 18]} />
        <meshStandardMaterial color="#8d2f22" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Toran() {
  return (
    <group>
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.05]} />
        <meshStandardMaterial color="#2f6b34" roughness={0.8} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <group key={i} position={[-0.65 + i * 0.16, -0.18 - (i % 2) * 0.08, 0]}>
          <mesh rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.07, 0.3, 6]} />
            <meshStandardMaterial color={i % 2 ? "#2e7d32" : "#ff8f00"} roughness={0.75} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Lights() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.elapsedTime;
    g.current.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && "emissiveIntensity" in m) m.emissiveIntensity = 1 + Math.sin(t * 3 + i) * 0.9;
    });
  });
  const colors: string[] = ["#ffd54f", "#ff7043", "#4fc3f7", "#81c784", "#ce93d8"];
  return (
    <group ref={g}>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-0.72 + i * 0.16, -Math.sin((i / 9) * Math.PI) * 0.22, 0]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial
            color={colors[i % colors.length] ?? "#ffd54f"}
            emissive={colors[i % colors.length] ?? "#ffd54f"}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function GarlandHang() {
  return (
    <group>
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[0, -i * 0.12, 0]} castShadow>
          <sphereGeometry args={[0.085, 10, 8]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#ffd54f" : "#ff7a1a"} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, -1.78, 0]}>
        <coneGeometry args={[0.09, 0.26, 8]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function DecorationMesh({ kind }: { kind: DecorationKind }) {
  switch (kind) {
    case "flowers":
      return <FlowerCluster />;
    case "diya":
      return <Diya />;
    case "modak":
      return <Modak />;
    case "rangoli":
      return <Rangoli />;
    case "petals":
      return <Petals />;
    case "utsav":
      return <Utsav />;
    case "toran":
      return <Toran />;
    case "lights":
      return <Lights />;
    case "garland":
      return <GarlandHang />;
    default:
      return null;
  }
}

/** Animated drop-in wrapper for a placed decoration. */
export function PlacedDecoration({ p }: { p: Placement }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const age = (performance.now() - p.bornAt) / 1000;
    const k = Math.min(1, age / 0.45);
    const ease = 1 - Math.pow(1 - k, 3);
    const overshoot = Math.sin(k * Math.PI) * 0.12;
    g.current.position.y = p.y + (1 - ease) * 1.2;
    const s = p.scale * (ease + overshoot);
    g.current.scale.setScalar(Math.max(0.001, s));
  });
  return (
    <group ref={g} position={[p.x, p.y, p.z]} rotation={[0, p.rotation, 0]}>
      <DecorationMesh kind={p.kind} />
    </group>
  );
}
