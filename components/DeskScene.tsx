"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Html, useGLTF } from "@react-three/drei";
import { useTheme } from "@/lib/theme";
import { useViewMode } from "@/lib/view";
import DeskProps from "./DeskProps";
import MonitorContent from "./MonitorContent";
import * as THREE from "three";

// vintage_desk.glb has node transforms that place everything at world scale.
// Desk surface at Y ≈ 0.748, monitor at [-0.039, 0.748, 0.280].
// Monitor screen center: roughly X=0, Y≈0.94, Z≈0.42 (front face).
// Chair at Z ≈ 1.16 (in front of desk).

const HOME_CAMERA = new THREE.Vector3(2.0, 1.5, 2.5);
const HOME_TARGET = new THREE.Vector3(0, 0.5, 0.4);

// About camera zooms toward the monitor screen
const ABOUT_CAMERA = new THREE.Vector3(0, 0.94, 1.2);
const ABOUT_TARGET = new THREE.Vector3(0, 0.9, 0.35);

function CameraController() {
  const { camera } = useThree();
  const { viewMode } = useViewMode();
  const controlsRef = useRef<any>(null);

  const targetPos = useRef(new THREE.Vector3().copy(HOME_CAMERA));
  const targetLookAt = useRef(new THREE.Vector3().copy(HOME_TARGET));
  const currentLookAt = useRef(new THREE.Vector3().copy(HOME_TARGET));

  useFrame((_, delta) => {
    const isAbout = viewMode === "about";
    const goalPos = isAbout ? ABOUT_CAMERA : HOME_CAMERA;
    const goalTarget = isAbout ? ABOUT_TARGET : HOME_TARGET;

    targetPos.current.lerp(goalPos, delta * 2.5);
    targetLookAt.current.lerp(goalTarget, delta * 2.5);

    camera.position.lerp(targetPos.current, delta * 3);
    currentLookAt.current.lerp(targetLookAt.current, delta * 3);
    camera.lookAt(currentLookAt.current);

    if (controlsRef.current) {
      controlsRef.current.enabled = !isAbout;
      if (!isAbout) {
        controlsRef.current.target.copy(currentLookAt.current);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      target={[0, 0.5, 0.4]}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2.5}
      autoRotate
      autoRotateSpeed={0.5}
    />
  );
}

function MonitorScreen() {
  const theme = useTheme();
  const { viewMode } = useViewMode();

  if (viewMode !== "about") return null;

  return (
    <Html
      position={[0, 0.94, 0.43]}
      transform
      distanceFactor={0.5}
      style={{
        width: "420px",
        height: "246px",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: "420px",
          height: "246px",
          background: "transparent",
          color: theme.name === "night" ? "#E8E8F0" : "#1A1A2E",
          fontFamily: "var(--font-outfit), sans-serif",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            margin: 0,
            color: theme.accent,
          }}
        >
          About Me
        </h2>
        <p
          style={{
            fontSize: "10px",
            lineHeight: 1.65,
            margin: 0,
            opacity: 0.9,
          }}
        >
          Hi! I&apos;m Adrian Klisz — a designer and developer based in Stockholm, Sweden.
          I love building beautiful, interactive experiences at the intersection of design and code.
        </p>
        <p
          style={{
            fontSize: "10px",
            lineHeight: 1.65,
            margin: 0,
            opacity: 0.9,
          }}
        >
          When I&apos;m not pushing pixels or writing code, you&apos;ll find me exploring
          creative tools, experimenting with 3D, or brewing the perfect cup of coffee.
        </p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "4px",
          }}
        >
          {["GitHub", "LinkedIn", "Email"].map((label) => (
            <span
              key={label}
              style={{
                fontSize: "8px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "12px",
                background: theme.accent,
                color: "#FFFFFF",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </Html>
  );
}

// Clean material palette for overriding the GLB's baked textures
const PART_MATERIALS: Record<string, { color: string; roughness: number; metalness?: number }> = {
  // Desk
  Office_desk:      { color: "#C4956A", roughness: 0.6 },
  Drawers:          { color: "#3A3A3A", roughness: 0.4 },
  // Monitor & peripherals
  Computer_monitor: { color: "#C8C0B0", roughness: 0.4 },
  "Computer_monitor.001": { color: "#C8C0B0", roughness: 0.4 },
  Keyboard:         { color: "#D4CFC8", roughness: 0.5 },
  Mouse:            { color: "#D4CFC8", roughness: 0.5 },
  Mousepad:         { color: "#4A4A4A", roughness: 0.7 },
  // Speakers & case
  SpeakerL:         { color: "#3A3A3A", roughness: 0.5 },
  SpeakerR:         { color: "#3A3A3A", roughness: 0.5 },
  Computer_case:    { color: "#C8C0B0", roughness: 0.4 },
  // Chair
  "Cube.000":       { color: "#1A1A1A", roughness: 0.3 },
  // Phone
  Phone_stand:      { color: "#C8C0B0", roughness: 0.5 },
  Phonehandle:      { color: "#C8C0B0", roughness: 0.5 },
  // Desk items
  Paper:            { color: "#F5F0E8", roughness: 0.8 },
  Paper2:           { color: "#F5F0E8", roughness: 0.8 },
  Pen:              { color: "#2A2A2A", roughness: 0.3 },
  CD:               { color: "#E0E0E0", roughness: 0.2, metalness: 0.5 },
  CD_case:          { color: "#3A3A3A", roughness: 0.4 },
  Floppy_disk:      { color: "#2A2A2A", roughness: 0.5 },
  // Cables
  KeyboardCable:    { color: "#4A4A4A", roughness: 0.6 },
  Mouse_cord:       { color: "#4A4A4A", roughness: 0.6 },
  Speakers_cable:   { color: "#4A4A4A", roughness: 0.6 },
  Monitor_cable:    { color: "#4A4A4A", roughness: 0.6 },
};

function DeskModel() {
  const { scene } = useGLTF("/models/vintage_desk.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Find matching material override by walking up the node tree
        // Uses startsWith to handle Blender suffixes like ".001"
        let node: THREE.Object3D | null = mesh;
        while (node) {
          const match = Object.entries(PART_MATERIALS).find(([key]) =>
            node!.name === key || node!.name.startsWith(key + ".")
          );
          if (match) {
            const mat = match[1];
            mesh.material = new THREE.MeshStandardMaterial({
              color: mat.color,
              roughness: mat.roughness,
              metalness: mat.metalness ?? 0,
            });
            break;
          }
          node = node.parent;
        }

        // Fallback: replace any remaining textured materials with a clean default
        const currentMat = mesh.material as THREE.MeshStandardMaterial;
        if (currentMat?.map) {
          currentMat.map = null;
          currentMat.normalMap = null;
          currentMat.roughnessMap = null;
          currentMat.metalnessMap = null;
          currentMat.aoMap = null;
          currentMat.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={clonedScene} />;
}

function DeskScene3D() {
  const theme = useTheme();
  const { viewMode } = useViewMode();

  const screenOpacity = viewMode === "about" ? 1.0 : 0.15;
  const screenColor = viewMode === "about"
    ? (theme.name === "night" ? "#0D0D18" : "#F5F5F5")
    : theme.accent;

  return (
    <group>
      <DeskModel />
      <DeskProps />

      {/* Screen glow overlay on the CRT monitor */}
      <mesh position={[0, 0.94, 0.42]}>
        <planeGeometry args={[0.3, 0.25]} />
        <meshBasicMaterial color={screenColor} opacity={screenOpacity} transparent />
      </mesh>

      {/* Invisible shadow-catching floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0.5]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <shadowMaterial opacity={0.25} />
      </mesh>

    </group>
  );
}

useGLTF.preload("/models/vintage_desk.glb");

function SceneLighting() {
  const theme = useTheme();

  return (
    <>
      <ambientLight
        color={theme.ambientColor}
        intensity={theme.ambientIntensity}
      />
      <directionalLight
        color={theme.lightColor}
        intensity={theme.lightIntensity}
        position={theme.lightPosition}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <pointLight
        color={theme.accent}
        intensity={0.3}
        position={[0, 2, 3]}
      />
    </>
  );
}

function SceneContent() {
  const { viewMode } = useViewMode();

  const floatProps = viewMode === "about"
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 1.5, rotationIntensity: 0.1, floatIntensity: 0.3 };

  return (
    <Float {...floatProps}>
      <DeskScene3D />
      <MonitorContent />
      <MonitorScreen />
    </Float>
  );
}

function LoadingFallback() {
  const theme = useTheme();

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "400px" }}
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: theme.accent, borderTopColor: "transparent" }}
      />
    </div>
  );
}

function BackButton() {
  const theme = useTheme();
  const { viewMode, setViewMode } = useViewMode();

  if (viewMode !== "about") return null;

  return (
    <button
      onClick={() => setViewMode("home")}
      className="absolute top-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm shadow-sm transition-all hover:scale-105 active:scale-95"
      style={{
        backgroundColor: theme.name === "night" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.text}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

export default function DeskScene() {
  const theme = useTheme();
  const { viewMode } = useViewMode();
  const isAbout = viewMode === "about";

  return (
    <div
      className="relative w-full"
      style={{
        height: "clamp(600px, 85vh, 1100px)",
      }}
    >
      <div
        style={{
          position: isAbout ? "fixed" : "absolute",
          inset: isAbout ? 0 : undefined,
          top: isAbout ? 0 : 0,
          left: isAbout ? 0 : 0,
          width: isAbout ? "100vw" : "100%",
          height: isAbout ? "100vh" : "100%",
          zIndex: isAbout ? 40 : undefined,
          transition: "all 0.6s ease",
        }}
      >
        <BackButton />
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true }}
            camera={{
              position: [2.0, 1.5, 2.5],
              fov: 45,
              near: 0.1,
              far: 100,
            }}
            style={{ background: isAbout ? theme.background : "transparent" }}
          >
            <fog
              attach="fog"
              args={[theme.background, 6, 14]}
            />
            <SceneLighting />
            <SceneContent />
            <CameraController />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}
