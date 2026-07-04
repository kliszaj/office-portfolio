"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, useGLTF } from "@react-three/drei";
import { useTheme } from "@/lib/theme";
import type { TimeOfDay } from "@/lib/time";
import { useWorkLayout } from "@/lib/workLayout";
import DeskProps from "./DeskProps";
import * as THREE from "three";

// vintage_desk.glb has node transforms that place everything at world scale.
// Desk surface at Y ≈ 0.748, monitor at [-0.039, 0.748, 0.280].
// Monitor screen center: roughly X=0, Y≈0.94, Z≈0.42 (front face).
// Chair at Z ≈ 1.16 (in front of desk).

const HOME_CAMERA = new THREE.Vector3(2.8, 2.0, 3.6);
const HOME_TARGET = new THREE.Vector3(0, 0.35, 0.4);

function CameraController() {
  const { camera } = useThree();
  const { cameraSettings, layout } = useWorkLayout();
  const cameraRef = useRef<THREE.Camera>(camera);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const deskCamera = useMemo(
    () =>
      new THREE.Vector3(
        cameraSettings.positionX,
        cameraSettings.positionY,
        cameraSettings.positionZ
      ),
    [
      cameraSettings.positionX,
      cameraSettings.positionY,
      cameraSettings.positionZ,
    ]
  );
  const deskTarget = useMemo(
    () =>
      new THREE.Vector3(
        cameraSettings.targetX,
        cameraSettings.targetY,
        cameraSettings.targetZ
      ),
    [
      cameraSettings.targetX,
      cameraSettings.targetY,
      cameraSettings.targetZ,
    ]
  );

  const targetPos = useRef(new THREE.Vector3().copy(HOME_CAMERA));
  const targetLookAt = useRef(new THREE.Vector3().copy(HOME_TARGET));
  const currentLookAt = useRef(new THREE.Vector3().copy(HOME_TARGET));

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useFrame((_, delta) => {
    const activeCamera = cameraRef.current;
    const isDeskLayout = layout === "desk";
    const goalPos = isDeskLayout ? deskCamera : HOME_CAMERA;
    const goalTarget = isDeskLayout ? deskTarget : HOME_TARGET;
    const goalFov = isDeskLayout ? cameraSettings.fov : 45;

    targetPos.current.lerp(goalPos, delta * 2.5);
    targetLookAt.current.lerp(goalTarget, delta * 2.5);

    if (
      activeCamera instanceof THREE.PerspectiveCamera &&
      Math.abs(activeCamera.fov - goalFov) > 0.01
    ) {
      activeCamera.fov = THREE.MathUtils.lerp(activeCamera.fov, goalFov, delta * 4);
      activeCamera.updateProjectionMatrix();
    }

    activeCamera.position.lerp(targetPos.current, delta * 3);
    currentLookAt.current.lerp(targetLookAt.current, delta * 3);
    activeCamera.lookAt(currentLookAt.current);

    if (controlsRef.current) {
      controlsRef.current.enabled = true;
      controlsRef.current.target.copy(currentLookAt.current);
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

const DAY_SHADOW_OPACITY = 0.25;
// Evening<->night and morning<->night are crossfades: the light stays put and
// values blend over a fixed duration, instead of the light sweeping to a new
// position. Every other transition eases exponentially (a moving sweep).
const CROSSFADE_SECONDS = 0.45;
const SWEEP_DAMP = 0.06;
// Shadow-source swaps (sun <-> night light) fade over ~450ms so the handoff is
// crisp and the outgoing shadow doesn't visibly slide while the sun repositions.
const SHADOW_FADE_DAMP = 0.0015;

// Night key-light positions for the two directional shadow modes.
// Grounded: nearly overhead → a tight shadow tucked under the desk.
// Moonlight: high and angled → a normal parallel shadow, like a dim cool sun.
const GROUNDED_KEY_POS = new THREE.Vector3(0.6, 6, 1.2);
const MOONLIGHT_KEY_POS = new THREE.Vector3(3.5, 6.5, 2.6);

function isNightCrossfade(from: TimeOfDay, to: TimeOfDay) {
  const involves = (name: TimeOfDay) => from === name || to === name;
  return involves("night") && (involves("evening") || involves("morning"));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function DeskScene3D() {
  const theme = useTheme();
  const { nightSettings } = useWorkLayout();
  const shadowRef = useRef<THREE.ShadowMaterial>(null);
  const floorRef = useRef<THREE.MeshStandardMaterial>(null);
  const lastNameRef = useRef(theme.name);
  const crossfadeRef = useRef({ active: false, t: 0, from: DAY_SHADOW_OPACITY });

  useFrame((_, delta) => {
    const isNight = theme.name === "night";
    const mat = shadowRef.current;
    if (mat) {
      // Shadow-catcher opacity: daytime shows the sun shadow against the light
      // background; at night it shows the monitor's shadow over the lit floor.
      const target = isNight
        ? nightSettings.shadowStrength / 100
        : DAY_SHADOW_OPACITY;

      if (theme.name !== lastNameRef.current) {
        const from = lastNameRef.current;
        lastNameRef.current = theme.name;
        const cf = crossfadeRef.current;
        if (isNightCrossfade(from, theme.name)) {
          cf.active = true;
          cf.t = 0;
          cf.from = mat.opacity;
        } else {
          cf.active = false;
        }
      }

      const cf = crossfadeRef.current;
      if (cf.active) {
        cf.t = Math.min(1, cf.t + delta / CROSSFADE_SECONDS);
        mat.opacity = THREE.MathUtils.lerp(cf.from, target, easeInOut(cf.t));
        if (cf.t >= 1) cf.active = false;
      } else {
        const k = 1 - Math.pow(SWEEP_DAMP, delta);
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, k);
      }
    }

    // Night floor: a dim ground that the monitor glow lights into a pool so the
    // cast shadow reads. Invisible by day, so daytime keeps the floating look.
    const floor = floorRef.current;
    if (floor) {
      const k = 1 - Math.pow(SWEEP_DAMP, delta);
      floor.opacity = THREE.MathUtils.lerp(
        floor.opacity,
        isNight ? nightSettings.floorBrightness / 100 : 0,
        k
      );
      floor.color.set(nightSettings.floorColor);
    }
  });

  return (
    <group>
      <DeskModel />
      <DeskProps />

      {/* Night floor — lit into a pool by the monitor glow; fades in only at
          night so daytime scenes keep their floating look. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.011, 0.5]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          ref={floorRef}
          color="#14141f"
          roughness={0.92}
          metalness={0}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Invisible shadow-catching floor (shows the cast shadow over whatever
          is behind it — the light background by day, the night floor at night) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0.5]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial ref={shadowRef} opacity={DAY_SHADOW_OPACITY} transparent />
      </mesh>

    </group>
  );
}

useGLTF.preload("/models/vintage_desk.glb");

function SceneLighting() {
  const theme = useTheme();
  const { nightSettings } = useWorkLayout();
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const nightKeyRef = useRef<THREE.DirectionalLight>(null);
  // Captured once so the declarative props don't re-apply (and snap) on theme
  // changes — the actual values are eased imperatively in useFrame below.
  const [initialTheme] = useState(theme);

  const targetPosition = useMemo(
    () => new THREE.Vector3(...theme.lightPosition),
    [theme.lightPosition]
  );
  const targetLightColor = useMemo(
    () => new THREE.Color(theme.lightColor),
    [theme.lightColor]
  );
  const targetAmbientColor = useMemo(
    () => new THREE.Color(theme.ambientColor),
    [theme.ambientColor]
  );
  const lastNameRef = useRef(theme.name);
  const crossfadeRef = useRef({
    active: false,
    t: 0,
    fromColor: new THREE.Color(),
    fromIntensity: 0,
    fromAmbientColor: new THREE.Color(),
    fromAmbientIntensity: 0,
  });

  useFrame((_, delta) => {
    const dir = dirRef.current;
    const ambient = ambientRef.current;
    const isNight = theme.name === "night";
    const k = 1 - Math.pow(SWEEP_DAMP, delta);
    const fade = 1 - Math.pow(SHADOW_FADE_DAMP, delta);

    // The sun's shadow fades out at night; its POSITION always eases to the
    // current time-of-day target, so each daytime scene has the same,
    // deterministic light/shadow position regardless of transition history.
    if (dir) {
      dir.shadow.intensity = THREE.MathUtils.lerp(
        dir.shadow.intensity,
        isNight ? 0 : 1,
        fade
      );
      dir.position.lerp(targetPosition, k);
    }

    // Night key light — casts the shadow for the "grounded" and "moonlight"
    // modes (the "monitor" mode uses the monitor point light instead).
    const key = nightKeyRef.current;
    if (key) {
      const mode = nightSettings.shadowMode;
      const keyCasts = isNight && mode !== "monitor";
      key.shadow.intensity = THREE.MathUtils.lerp(
        key.shadow.intensity,
        keyCasts ? 1 : 0,
        fade
      );
      key.position.lerp(
        mode === "moonlight" ? MOONLIGHT_KEY_POS : GROUNDED_KEY_POS,
        k
      );
      const keyIntensity = !isNight
        ? 0
        : mode === "moonlight"
          ? 0.6
          : mode === "grounded"
            ? 0.3
            : 0;
      key.intensity = THREE.MathUtils.lerp(key.intensity, keyIntensity, k);
    }

    // Start a timed colour crossfade on the night boundaries.
    if (theme.name !== lastNameRef.current) {
      const from = lastNameRef.current;
      lastNameRef.current = theme.name;
      const cf = crossfadeRef.current;
      if (isNightCrossfade(from, theme.name) && dir && ambient) {
        cf.active = true;
        cf.t = 0;
        cf.fromColor.copy(dir.color);
        cf.fromIntensity = dir.intensity;
        cf.fromAmbientColor.copy(ambient.color);
        cf.fromAmbientIntensity = ambient.intensity;
      } else {
        cf.active = false;
      }
    }

    const cf = crossfadeRef.current;
    if (cf.active && dir && ambient) {
      cf.t = Math.min(1, cf.t + delta / CROSSFADE_SECONDS);
      const e = easeInOut(cf.t);
      dir.color.copy(cf.fromColor).lerp(targetLightColor, e);
      dir.intensity = THREE.MathUtils.lerp(
        cf.fromIntensity,
        theme.lightIntensity,
        e
      );
      ambient.color.copy(cf.fromAmbientColor).lerp(targetAmbientColor, e);
      ambient.intensity = THREE.MathUtils.lerp(
        cf.fromAmbientIntensity,
        theme.ambientIntensity,
        e
      );
      if (cf.t >= 1) cf.active = false;
    } else {
      if (dir) {
        dir.color.lerp(targetLightColor, k);
        dir.intensity = THREE.MathUtils.lerp(
          dir.intensity,
          theme.lightIntensity,
          k
        );
      }
      if (ambient) {
        ambient.color.lerp(targetAmbientColor, k);
        ambient.intensity = THREE.MathUtils.lerp(
          ambient.intensity,
          theme.ambientIntensity,
          k
        );
      }
    }
  });

  return (
    <>
      <ambientLight
        ref={ambientRef}
        color={initialTheme.ambientColor}
        intensity={initialTheme.ambientIntensity}
      />
      <directionalLight
        ref={dirRef}
        color={initialTheme.lightColor}
        intensity={initialTheme.lightIntensity}
        position={initialTheme.lightPosition}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* Night key light (grounded / moonlight shadow modes) */}
      <directionalLight
        ref={nightKeyRef}
        color="#9fb0e0"
        intensity={0}
        position={GROUNDED_KEY_POS}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-far={22}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <pointLight
        color={theme.accent}
        intensity={0.3}
        position={[0, 2, 3]}
      />
    </>
  );
}

// Screen glow: the monitor emits cool light that spills onto the desk and
// props, ramping up at night so the scene reads as lit by the screen.
function MonitorGlow() {
  const theme = useTheme();
  const { nightSettings } = useWorkLayout();
  const lightRef = useRef<THREE.PointLight>(null);
  const screenRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(SWEEP_DAMP, delta);
    const isNight = theme.name === "night";
    const light = lightRef.current;
    if (light) {
      light.intensity = THREE.MathUtils.lerp(
        light.intensity,
        isNight ? nightSettings.monitorGlow : 0,
        k
      );
      light.distance = nightSettings.glowReach;
      light.color.set(nightSettings.glowColor);
      // The monitor casts the shadow only in "monitor" mode.
      light.shadow.intensity = THREE.MathUtils.lerp(
        light.shadow.intensity,
        isNight && nightSettings.shadowMode === "monitor" ? 1 : 0,
        k
      );
    }
    if (screenRef.current) {
      screenRef.current.opacity = THREE.MathUtils.lerp(
        screenRef.current.opacity,
        isNight ? nightSettings.screenBrightness / 100 : 0.12,
        k
      );
      screenRef.current.color.set(nightSettings.glowColor);
    }
  });

  return (
    <group>
      {/* Glowing screen surface on the monitor front face */}
      <mesh position={[0, 0.94, 0.421]}>
        <planeGeometry args={[0.3, 0.24]} />
        <meshBasicMaterial
          ref={screenRef}
          color="#a9ccff"
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>
      {/* Cool light spilling from the screen toward the desk, props & floor */}
      <pointLight
        ref={lightRef}
        position={[0, 0.86, 0.66]}
        distance={3.2}
        decay={1.7}
        color="#aacdff"
        intensity={0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.002}
        shadow-camera-near={0.05}
        shadow-camera-far={14}
      />
    </group>
  );
}

function SceneContent() {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <DeskScene3D />
      <MonitorGlow />
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

function SceneUnavailable({ message }: { message: string }) {
  const theme = useTheme();

  return (
    <div
      className="flex h-full min-h-[520px] items-center justify-center px-6 text-center"
      style={{ color: theme.text }}
    >
      <div
        className="max-w-md rounded-lg border px-5 py-4 shadow-sm"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: "6px" }}>3D scene unavailable</p>
        <p style={{ fontSize: "14px", lineHeight: 1.5, opacity: 0.78 }}>{message}</p>
      </div>
    </div>
  );
}

class SceneErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("3D scene failed to render:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <SceneUnavailable
          message={`${this.state.error.message || "The browser could not render the scene."} Check that WebGL and hardware acceleration are enabled.`}
        />
      );
    }

    return this.props.children;
  }
}

function useHasWebGL() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

      setHasWebGL(Boolean(gl));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return hasWebGL;
}

export default function DeskScene() {
  const theme = useTheme();
  const { cameraSettings, layout } = useWorkLayout();
  const isDeskLayout = layout === "desk";
  const hasWebGL = useHasWebGL();

  return (
    <div
      className="relative w-full"
      style={{
        height: isDeskLayout ? `${cameraSettings.sceneHeight}vh` : "95vh",
        minHeight: isDeskLayout ? `${cameraSettings.minHeight}px` : "700px",
        transition: "height 0.6s ease, min-height 0.6s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {hasWebGL === false ? (
          <SceneUnavailable message="This browser is not exposing WebGL. Enable hardware acceleration, update your graphics driver, or try another browser." />
        ) : (
          <SceneErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true }}
                camera={{
                  position: [2.8, 2.0, 3.6],
                  fov: 45,
                  near: 0.1,
                  far: 100,
                }}
                style={{ background: "transparent" }}
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
          </SceneErrorBoundary>
        )}
      </div>
    </div>
  );
}
