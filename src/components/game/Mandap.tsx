import { useMemo } from "react";
import * as THREE from "three";

const wood = { color: "#6b3a1f", roughness: 0.7, metalness: 0.1 };
const gold = { color: "#d9a232", roughness: 0.28, metalness: 0.9 };
const marble = { color: "#f0e3cc", roughness: 0.35, metalness: 0.05 };

function Pillar({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.36, 0.85]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.32, 4.2, 18]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      {[1.1, 2.2, 3.3].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[0.31, 0.045, 10, 28]} />
          <meshStandardMaterial {...gold} />
        </mesh>
      ))}
      <mesh position={[0, 4.62, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.3, 0.42, 18]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}

function Canopy() {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 6.6, 0, Math.PI * 2, false);
    return new THREE.ShapeGeometry(shape, 48);
  }, []);
  return (
    <group position={[0, 5.1, 0]}>
      <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#8a1f2b" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[6.8, 1.8, 40, 1, true]} />
        <meshStandardMaterial color="#a3252f" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <coneGeometry args={[0.5, 0.9, 16]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {/* decorative fringe */}
      {Array.from({ length: 40 }, (_, i) => {
        const a = (i / 40) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 6.6, -0.18, Math.sin(a) * 6.6]}>
            <coneGeometry args={[0.09, 0.36, 8]} />
            <meshStandardMaterial color={i % 2 ? "#ffc53d" : "#ff7a1a"} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Mandap() {
  const pillars: [number, number][] = [
    [-4.6, -4.6],
    [4.6, -4.6],
    [-4.6, 4.6],
    [4.6, 4.6],
  ];

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#2a1a14" roughness={0.95} />
      </mesh>
      {/* mandap floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[7.2, 64]} />
        <meshStandardMaterial {...marble} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[6.5, 7.1, 64]} />
        <meshStandardMaterial color="#9c3b1a" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[6.1, 6.3, 64]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      {/* idol platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.75, 1.95, 0.4, 40]} />
        <meshStandardMaterial color="#b1372c" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.44, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.6, 1.72, 0.14, 40]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {/* lotus petals around base */}
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.75, 0.52, Math.sin(a) * 1.75]}
            rotation={[Math.PI / 2.4, 0, -a]}
          >
            <coneGeometry args={[0.2, 0.42, 8]} />
            <meshStandardMaterial color="#ffb0c4" roughness={0.7} />
          </mesh>
        );
      })}

      {pillars.map(([x, z]) => (
        <Pillar key={`${x}:${z}`} x={x} z={z} />
      ))}
      <Canopy />

      {/* back drape */}
      <mesh position={[0, 2.6, -5.2]} receiveShadow>
        <planeGeometry args={[10.2, 5.2]} />
        <meshStandardMaterial color="#6d1622" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-4 + i, 2.6, -5.14]}>
          <planeGeometry args={[0.14, 5.2]} />
          <meshStandardMaterial color="#c9a227" roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
