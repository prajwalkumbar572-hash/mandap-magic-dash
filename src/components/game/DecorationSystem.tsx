import { useCallback, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ARCH_Y, DECORATION_MAP, FLOOR_INNER, FLOOR_OUTER } from "@/game/config";
import { isValidSpot, useGame } from "@/game/store";
import { sfx } from "@/game/audio";
import { DecorationMesh, PlacedDecoration } from "./DecorationMeshes";

function Ghost({
  kind,
  pos,
  valid,
}: {
  kind: keyof typeof DECORATION_MAP;
  pos: THREE.Vector3;
  valid: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (!g.current) return;
    g.current.position.lerp(pos, Math.min(1, dt * 18));
    const pulse = 1 + Math.sin(s.clock.elapsedTime * 6) * 0.04;
    g.current.scale.setScalar(pulse);
  });
  return (
    <group ref={g} position={pos}>
      <group>
        <DecorationMesh kind={kind} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.42, 0.58, 32]} />
        <meshBasicMaterial
          color={valid ? "#7bf59a" : "#ff6a4d"}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={valid ? "#8effb0" : "#ff7a5a"} intensity={1.4} distance={2.5} />
    </group>
  );
}

export function DecorationSystem() {
  const placements = useGame((s) => s.placements);
  const selected = useGame((s) => s.selected);
  const phase = useGame((s) => s.phase);
  const soundOn = useGame((s) => s.soundOn);
  const tryPlace = useGame((s) => s.tryPlace);

  const [ghost, setGhost] = useState<{ pos: THREE.Vector3; valid: boolean } | null>(null);

  const resolve = useCallback(
    (point: THREE.Vector3) => {
      if (!selected) return null;
      const def = DECORATION_MAP[selected];
      let x = point.x;
      let z = point.z;
      const y = def.zone === "arch" ? ARCH_Y : 0.04;
      if (def.zone === "arch") {
        const r = Math.hypot(x, z) || 0.001;
        const clamped = THREE.MathUtils.clamp(r, 3.2, 5.6);
        x = (x / r) * clamped;
        z = (z / r) * clamped;
      } else {
        const r = Math.hypot(x, z);
        if (r > FLOOR_OUTER) {
          x = (x / r) * FLOOR_OUTER;
          z = (z / r) * FLOOR_OUTER;
        }
      }
      const valid = isValidSpot(placements, selected, x, z) && Math.hypot(x, z) >= (def.zone === "floor" ? FLOOR_INNER : 0);
      return { pos: new THREE.Vector3(x, y, z), valid };
    },
    [placements, selected],
  );

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!selected || phase !== "playing") return;
    const next = resolve(e.point);
    if (next) setGhost(next);
  };

  const onUp = (e: ThreeEvent<PointerEvent>) => {
    if (!selected || phase !== "playing") return;
    const next = resolve(e.point);
    if (!next) return;
    const ok = tryPlace(selected, next.pos.x, next.pos.z, next.pos.y);
    if (soundOn) (ok ? sfx.place : sfx.invalid)();
    setGhost(null);
  };

  const planeY = selected && DECORATION_MAP[selected].zone === "arch" ? ARCH_Y : 0.02;

  return (
    <group>
      {/* raycast catcher */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, planeY, 0]}
        visible={false}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={() => setGhost(null)}
      >
        <circleGeometry args={[14, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* valid-zone hint while an item is selected */}
      {selected && phase === "playing" && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, DECORATION_MAP[selected].zone === "arch" ? ARCH_Y - 0.02 : 0.04, 0]}>
          <ringGeometry
            args={
              DECORATION_MAP[selected].zone === "arch"
                ? [3.2, 5.6, 64]
                : [FLOOR_INNER, FLOOR_OUTER, 64]
            }
          />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      )}

      {placements.map((p) => (
        <PlacedDecoration key={p.id} p={p} />
      ))}

      {ghost && selected && phase === "playing" && (
        <Ghost kind={selected} pos={ghost.pos} valid={ghost.valid} />
      )}
    </group>
  );
}
