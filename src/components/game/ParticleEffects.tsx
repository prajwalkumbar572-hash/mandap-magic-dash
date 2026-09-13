import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const dummy = new THREE.Object3D();

/** Slow floating incense motes + celebratory falling petals. */
export function ParticleEffects({ celebrate }: { celebrate: boolean }) {
  const motes = useRef<THREE.InstancedMesh>(null);
  const petals = useRef<THREE.InstancedMesh>(null);

  const moteData = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        x: (Math.random() - 0.5) * 14,
        y: Math.random() * 6,
        z: (Math.random() - 0.5) * 14,
        s: 0.02 + Math.random() * 0.03,
        v: 0.1 + Math.random() * 0.25,
        p: Math.random() * Math.PI * 2,
      })),
    [],
  );

  const petalData = useMemo(
    () =>
      Array.from({ length: 120 }, () => ({
        x: (Math.random() - 0.5) * 12,
        y: Math.random() * 9,
        z: (Math.random() - 0.5) * 12,
        s: 0.05 + Math.random() * 0.06,
        v: 0.7 + Math.random() * 1.1,
        spin: Math.random() * 3,
        p: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = state.clock.elapsedTime;
    if (motes.current) {
      moteData.forEach((m, i) => {
        m.y += m.v * dt;
        if (m.y > 6.5) m.y = 0.2;
        dummy.position.set(m.x + Math.sin(t * 0.4 + m.p) * 0.4, m.y, m.z + Math.cos(t * 0.3 + m.p) * 0.4);
        dummy.scale.setScalar(m.s);
        dummy.updateMatrix();
        motes.current!.setMatrixAt(i, dummy.matrix);
      });
      motes.current.instanceMatrix.needsUpdate = true;
    }
    if (petals.current) {
      petals.current.visible = celebrate;
      if (celebrate) {
        petalData.forEach((m, i) => {
          m.y -= m.v * dt;
          if (m.y < 0) m.y = 9 + Math.random() * 2;
          dummy.position.set(m.x + Math.sin(t * 1.2 + m.p) * 0.6, m.y, m.z + Math.cos(t * 0.9 + m.p) * 0.6);
          dummy.rotation.set(t * m.spin, t * m.spin * 0.6, 0);
          dummy.scale.setScalar(m.s);
          dummy.updateMatrix();
          petals.current!.setMatrixAt(i, dummy.matrix);
        });
        petals.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <instancedMesh ref={motes} args={[undefined, undefined, 90]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#ffd9a0" transparent opacity={0.5} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={petals} args={[undefined, undefined, 120]} frustumCulled={false} visible={false}>
        <circleGeometry args={[1, 6]} />
        <meshBasicMaterial color="#ff9f68" transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
