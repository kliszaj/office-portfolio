"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildWorkstation, animateWorkstation } from "@/lib/workspace/model";
import { useThemeControls } from "@/lib/theme";
import { prepareScenes } from "@/lib/workspace/scenes";
import { batchStatic } from "@/lib/workspace/batch";

/** The workspace only: no scan, room shell, wall furniture or exercise equipment. */
export default function WorkspaceModel() {
  const { sceneHour } = useThemeControls();
  const reducedMotion = useRef(false);
  const { workspace, scenes } = useMemo(() => {
    const parent = new THREE.Group();
    const model = buildWorkstation(parent);
    // Preserve the deforming steam; batch opaque surfaces without changing detail.
    const scenes = prepareScenes(model);
    batchStatic(model, scenes.roots, { mergeDynamic: true });
    return { workspace: model, scenes };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedMotion.current = preference.matches; };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useFrame(({ clock }, delta) => {
    scenes.update(sceneHour, delta, reducedMotion.current);
    if (!reducedMotion.current) animateWorkstation(workspace, clock.elapsedTime);
  });

  useEffect(() => () => {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    workspace.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) textures.add(value);
        }
      }
    });
    scenes.dispose();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
  }, [workspace, scenes]);

  return <primitive object={workspace} dispose={null} />;
}
