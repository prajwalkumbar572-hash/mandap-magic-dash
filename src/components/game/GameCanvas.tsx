import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Mandap } from "./Mandap";
import { Ganesha } from "./Ganesha";
import { DecorationSystem } from "./DecorationSystem";
import { ParticleEffects } from "./ParticleEffects";
import { useGame } from "@/game/store";

function GameLoop() {
  const tick = useGame((s) => s.tick);
  useFrame((_, raw) => {
    tick(Math.min(raw, 0.1));
  });
  return null;
}

function SceneContent() {
  const phase = useGame((s) => s.phase);
  const blessing = useGame((s) => s.score.blessing);
  const celebrate = phase === "result" || (phase === "playing" && blessing >= 85);

  return (
    <>
      <color attach="background" args={["#1c0f0a"]} />
      <fog attach="fog" args={["#1c0f0a", 18, 42]} />

      <ambientLight intensity={0.35} color="#ffd9b0" />
      <directionalLight
        position={[6, 12, 8]}
        intensity={1.6}
        color="#ffe3c0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 4.4, 0]} intensity={20} color="#ffb35c" distance={12} decay={2} />
      <spotLight
        position={[0, 7.5, 5]}
        angle={0.5}
        penumbra={0.6}
        intensity={60}
        color="#ffcf9a"
        target-position={[0, 1.6, 0]}
        castShadow
      />

      <Environment resolution={64}>
        <Lightformer intensity={1.6} color="#ffca7a" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer intensity={0.8} color="#c1442e" position={[-5, 2, -1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer intensity={0.8} color="#e8a33d" position={[5, 2, -1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>

      <Mandap />
      <Ganesha blessed={blessing >= 70 || phase === "result"} />
      <DecorationSystem />
      <ParticleEffects celebrate={celebrate} />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={16} blur={2.4} far={5} color="#1a0500" />

      <GameLoop />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.72} />
      </EffectComposer>

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={6}
        maxDistance={15}
        minPolarAngle={0.55}
        maxPolarAngle={1.35}
        target={[0, 1.8, 0]}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

export function GameCanvas() {
  return (
    <div className="fixed inset-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 5.2, 11.5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
