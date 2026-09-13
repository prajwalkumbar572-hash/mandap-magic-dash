import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Swap-in point for a real GLB murti:
 *   1. Drop the file at `public/models/ganesha.glb`
 *   2. Set MODEL_URL below to "/models/ganesha.glb"
 * The procedural idol is used whenever MODEL_URL is empty.
 */
const MODEL_URL = "";

const clay = { color: "#d98c5f", roughness: 0.55, metalness: 0.05 };
const gold = { color: "#e8b13c", roughness: 0.22, metalness: 0.95 };
const cloth = { color: "#b0242c", roughness: 0.65, metalness: 0.08 };

function Trunk() {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.36, 0.52),
      new THREE.Vector3(0.02, 2.02, 0.72),
      new THREE.Vector3(-0.04, 1.7, 0.72),
      new THREE.Vector3(-0.22, 1.5, 0.5),
      new THREE.Vector3(-0.34, 1.46, 0.26),
      new THREE.Vector3(-0.2, 1.56, 0.14),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.15, 12, false);
  }, []);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial {...clay} />
    </mesh>
  );
}

function Arm({ side, upper }: { side: 1 | -1; upper: boolean }) {
  const y = upper ? 1.78 : 1.45;
  const outward = upper ? 0.95 : 0.8;
  const tilt = upper ? -0.8 : -0.2;
  return (
    <group position={[side * 0.55, y, upper ? -0.05 : 0.2]} rotation={[0, 0, side * tilt]}>
      <mesh castShadow position={[side * outward * 0.5, -0.1, 0]} rotation={[0, 0, side * 0.5]}>
        <capsuleGeometry args={[0.15, 0.75, 6, 14]} />
        <meshStandardMaterial {...clay} />
      </mesh>
      <mesh castShadow position={[side * outward, -0.42, 0.06]}>
        <sphereGeometry args={[0.16, 20, 16]} />
        <meshStandardMaterial {...clay} />
      </mesh>
      {/* armlet */}
      <mesh position={[side * 0.3, -0.02, 0]} rotation={[0, 0, Math.PI / 2 + side * 0.5]}>
        <torusGeometry args={[0.17, 0.035, 10, 24]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}

function Garland({ y, radius, color }: { y: number; radius: number; color: string }) {
  const beads = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => {
        const a = (i / 34) * Math.PI * 2;
        return [Math.cos(a) * radius, y - Math.abs(Math.sin(a)) * 0.12, Math.sin(a) * radius * 0.62] as const;
      }),
    [y, radius],
  );
  return (
    <group>
      {beads.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <sphereGeometry args={[0.075, 10, 8]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#ffd24a" : color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function Ganesha({ blessed }: { blessed: boolean }) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = 0.62 + Math.sin(t * 0.8) * 0.012;
    }
    if (halo.current) {
      const target = blessed ? 2.6 : 0.85;
      halo.current.emissiveIntensity +=
        (target + Math.sin(t * 1.6) * 0.15 - halo.current.emissiveIntensity) * Math.min(1, delta * 2);
    }
  });

  if (MODEL_URL) {
    // Intentionally unreachable until a GLB is supplied; see note above.
    return null;
  }

  return (
    <group ref={group} position={[0, 0.62, 0]}>
      {/* halo */}
      <group position={[0, 2.3, -0.95]}>
        <mesh>
          <circleGeometry args={[1.35, 48]} />
          <meshStandardMaterial
            ref={halo}
            color="#ffb347"
            emissive="#ffab2e"
            emissiveIntensity={0.9}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[1.42, 0.05, 12, 64]} />
          <meshStandardMaterial {...gold} emissive="#ff9d1e" emissiveIntensity={blessed ? 1.4 : 0.5} />
        </mesh>
      </group>

      {/* crossed legs */}
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[s * 0.52, 0.24, 0.22]} rotation={[0, s * 0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.46, 24, 18]} />
          <meshStandardMaterial {...cloth} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0.42]} castShadow>
        <sphereGeometry args={[0.42, 24, 18]} />
        <meshStandardMaterial {...cloth} />
      </mesh>

      {/* dhoti */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <coneGeometry args={[1.0, 0.75, 28]} />
        <meshStandardMaterial {...cloth} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <torusGeometry args={[0.84, 0.05, 10, 40]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      {/* belly + chest */}
      <mesh position={[0, 1.12, 0.06]} scale={[1, 0.88, 0.92]} castShadow>
        <sphereGeometry args={[0.88, 32, 24]} />
        <meshStandardMaterial {...clay} />
      </mesh>
      <mesh position={[0, 1.72, 0]} scale={[1.05, 0.85, 0.9]} castShadow>
        <sphereGeometry args={[0.6, 28, 22]} />
        <meshStandardMaterial {...clay} />
      </mesh>

      {/* sacred thread */}
      <mesh position={[0.05, 1.42, 0.2]} rotation={[0.2, 0, 0.65]}>
        <torusGeometry args={[0.62, 0.022, 8, 40]} />
        <meshStandardMaterial color="#f5efdc" roughness={0.8} />
      </mesh>

      <Arm side={1} upper />
      <Arm side={-1} upper />
      <Arm side={1} upper={false} />
      <Arm side={-1} upper={false} />

      {/* head */}
      <mesh position={[0, 2.42, 0.02]} scale={[1, 0.98, 1]} castShadow>
        <sphereGeometry args={[0.64, 32, 26]} />
        <meshStandardMaterial {...clay} />
      </mesh>
      <Trunk />

      {/* ears */}
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[s * 0.66, 2.4, -0.04]} rotation={[0, s * 0.35, s * 0.12]} scale={[0.22, 1, 0.85]} castShadow>
          <sphereGeometry args={[0.52, 24, 20]} />
          <meshStandardMaterial {...clay} />
        </mesh>
      ))}

      {/* tusks */}
      <mesh position={[0.24, 2.1, 0.48]} rotation={[0.5, 0, 0.25]}>
        <coneGeometry args={[0.07, 0.34, 12]} />
        <meshStandardMaterial color="#fdf6e6" roughness={0.4} />
      </mesh>
      <mesh position={[-0.26, 2.16, 0.46]} rotation={[1.5, 0, -0.3]}>
        <coneGeometry args={[0.06, 0.2, 12]} />
        <meshStandardMaterial color="#fdf6e6" roughness={0.4} />
      </mesh>

      {/* eyes */}
      {([-1, 1] as const).map((s) => (
        <group key={s} position={[s * 0.24, 2.56, 0.52]}>
          <mesh scale={[1, 0.6, 0.5]}>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshStandardMaterial color="#fdf7ec" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <sphereGeometry args={[0.042, 12, 10]} />
            <meshStandardMaterial color="#2a1710" roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* tilak */}
      <mesh position={[0, 2.76, 0.52]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.05, 0.16, 10]} />
        <meshStandardMaterial color="#c2262f" roughness={0.5} />
      </mesh>

      {/* crown */}
      <group position={[0, 2.95, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.58, 0.22, 28]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow>
          <coneGeometry args={[0.42, 0.6, 24]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.09, 16, 12]} />
          <meshStandardMaterial color="#ffe08a" emissive="#ffb648" emissiveIntensity={blessed ? 1.6 : 0.6} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      <Garland y={1.95} radius={0.72} color="#ff7a1a" />
      <Garland y={1.66} radius={0.88} color="#ffd24a" />
    </group>
  );
}
