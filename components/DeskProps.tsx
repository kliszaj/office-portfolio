"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "@/lib/theme";
import * as THREE from "three";

/* ─── Coffee Mug ─── morning, afternoon, evening ─── */

const MUG_POS: [number, number, number] = [0.25, 0.748, 0.50];

function CoffeeMug({ liquidLevel }: { liquidLevel: "full" | "half" | "empty" }) {
  const mugHeight = 0.045;
  const mugRadius = 0.022;

  return (
    <group position={MUG_POS}>
      {/* Mug body */}
      <mesh castShadow position={[0, mugHeight / 2, 0]}>
        <cylinderGeometry args={[mugRadius + 0.003, mugRadius, mugHeight, 16]} />
        <meshStandardMaterial color="#F0EAE0" roughness={0.5} />
      </mesh>

      {/* Mug interior (dark inside) */}
      <mesh position={[0, mugHeight - 0.002, 0]}>
        <cylinderGeometry args={[mugRadius, mugRadius - 0.002, 0.004, 16]} />
        <meshStandardMaterial color="#3A2A1A" roughness={0.8} />
      </mesh>

      {/* Handle */}
      <mesh castShadow position={[mugRadius + 0.008, mugHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.012, 0.003, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#F0EAE0" roughness={0.5} />
      </mesh>

      {/* Liquid */}
      {liquidLevel !== "empty" && (
        <mesh position={[0, liquidLevel === "full" ? mugHeight - 0.008 : mugHeight * 0.4, 0]}>
          <cylinderGeometry args={[mugRadius - 0.002, mugRadius - 0.003, 0.003, 16]} />
          <meshStandardMaterial color="#5C3A1E" roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

/* ─── Steam Particles ─── morning only ─── */

function SteamParticles() {
  const count = 6;
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const state = useRef(
    Array.from({ length: count }, (_, i) => ({
      y: (i / count) * 0.06,
      x: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
      opacity: 1 - i / count,
      speed: 0.008 + Math.random() * 0.006,
    }))
  );

  useFrame((_, delta) => {
    state.current.forEach((p, i) => {
      p.y += p.speed * delta * 3;
      p.opacity -= delta * 0.8;

      if (p.y > 0.06 || p.opacity <= 0) {
        p.y = 0;
        p.x = (Math.random() - 0.5) * 0.01;
        p.z = (Math.random() - 0.5) * 0.01;
        p.opacity = 0.6;
      }

      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.set(
          MUG_POS[0] + p.x,
          MUG_POS[1] + 0.05 + p.y,
          MUG_POS[2] + p.z
        );
        (mesh.material as THREE.MeshStandardMaterial).opacity = p.opacity;
      }
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.003, 6, 6]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.5} roughness={1} />
        </mesh>
      ))}
    </>
  );
}

/* ─── Coffee Stain ─── afternoon, evening ─── */

function CoffeeStain() {
  return (
    <mesh
      position={[0.27, 0.749, 0.52]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[0.02, 24]} />
      <meshStandardMaterial
        color="#6B4226"
        transparent
        opacity={0.2}
        roughness={0.9}
      />
    </mesh>
  );
}

/* ─── Game Controller ─── evening only ─── */

function GameController() {
  return (
    <group position={[0.15, 0.755, 0.65]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.045, 0.012, 0.03]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.4} />
      </mesh>

      {/* Left grip */}
      <mesh castShadow position={[-0.02, -0.004, 0.01]}>
        <boxGeometry args={[0.012, 0.016, 0.015]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.4} />
      </mesh>

      {/* Right grip */}
      <mesh castShadow position={[0.02, -0.004, 0.01]}>
        <boxGeometry args={[0.012, 0.016, 0.015]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.4} />
      </mesh>

      {/* Left stick */}
      <mesh position={[-0.012, 0.008, -0.003]}>
        <sphereGeometry args={[0.004, 8, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
      </mesh>

      {/* Right stick */}
      <mesh position={[0.012, 0.008, 0.005]}>
        <sphereGeometry args={[0.004, 8, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
      </mesh>

      {/* D-pad (cross shape) */}
      <mesh position={[-0.012, 0.007, 0.005]}>
        <boxGeometry args={[0.008, 0.002, 0.002]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
      </mesh>
      <mesh position={[-0.012, 0.007, 0.005]}>
        <boxGeometry args={[0.002, 0.002, 0.008]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
      </mesh>

      {/* Face buttons (4 small circles) */}
      {[
        [0.015, 0.007, -0.005],
        [0.009, 0.007, -0.005],
        [0.012, 0.007, -0.002],
        [0.012, 0.007, -0.008],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.002, 6, 6]} />
          <meshStandardMaterial
            color={["#4A90D9", "#E06C75", "#5EA87E", "#D4B06A"][i]}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Cable from controller toward PC */}
      <mesh
        castShadow
        position={[0, 0, -0.06]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.002, 0.002, 0.09, 6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Desk Lamp ─── night only ─── */

function DeskLamp() {
  const theme = useTheme();

  return (
    <group position={[-0.30, 0.748, 0.35]}>
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.03, 0.035, 0.008, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Lower arm */}
      <mesh castShadow position={[0, 0.05, -0.01]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.09, 6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Joint */}
      <mesh position={[0, 0.09, -0.02]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Upper arm */}
      <mesh castShadow position={[0.01, 0.12, -0.01]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.003, 0.003, 0.07, 6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Shade (cone, open end down) */}
      <mesh castShadow position={[0.02, 0.15, -0.005]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.035, 0.025, 16, 1, true]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Warm light inside shade */}
      <pointLight
        color="#FFE4B5"
        intensity={0.8}
        distance={1.5}
        decay={2}
        position={[0.02, 0.14, -0.005]}
        castShadow
      />

      {/* Subtle bulb glow */}
      <mesh position={[0.02, 0.14, -0.005]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshBasicMaterial color="#FFFAE0" />
      </mesh>
    </group>
  );
}

/* ─── Main Export ─── */

export default function DeskProps() {
  const theme = useTheme();
  const timeOfDay = theme.name;

  return (
    <group>
      {/* Coffee mug — morning (full+steam), afternoon (half), evening (empty) */}
      {timeOfDay === "morning" && (
        <>
          <CoffeeMug liquidLevel="full" />
          <SteamParticles />
        </>
      )}
      {timeOfDay === "afternoon" && (
        <>
          <CoffeeMug liquidLevel="half" />
          <CoffeeStain />
        </>
      )}
      {timeOfDay === "evening" && (
        <>
          <CoffeeMug liquidLevel="empty" />
          <CoffeeStain />
          <GameController />
        </>
      )}

      {/* Desk lamp — night only */}
      {timeOfDay === "night" && <DeskLamp />}
    </group>
  );
}
