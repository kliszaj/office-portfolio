"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildWorkstation, animateWorkstation } from "@/lib/workspace/model";
import { useThemeControls } from "@/lib/theme";
import { prepareScenes } from "@/lib/workspace/scenes";
import { batchStatic } from "@/lib/workspace/batch";

/** The workspace only: no scan, room shell, wall furniture or exercise equipment. */
export default function WorkspaceModel() {
  const { scene: mouseAsset } = useGLTF("/models/mx-master-3s.glb");
  const { sceneHour } = useThemeControls();
  const reducedMotion = useRef(false);
  const { workspace, scenes } = useMemo(() => {
    const parent = new THREE.Group();
    // Own the cloned GPU resources so cleanup never disposes the loader cache.
    const mouse = mouseAsset.clone(true);
    const materials = new Map<THREE.Material, THREE.Material>();
    const textures = new Map<THREE.Texture, THREE.Texture>();
    mouse.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry = object.geometry.clone();
      object.castShadow = object.receiveShadow = true;
      const cloneMaterial = (source: THREE.Material) => {
        if (materials.has(source)) return materials.get(source)!;
        const material = source.clone();
        for (const [key, value] of Object.entries(material)) {
          if (!(value instanceof THREE.Texture)) continue;
          if (!textures.has(value)) { const copy = value.clone(); copy.anisotropy = 8; textures.set(value, copy); }
          Object.assign(material, { [key]: textures.get(value) });
        }
        materials.set(source, material);
        return material;
      };
      object.material = Array.isArray(object.material) ? object.material.map(cloneMaterial) : cloneMaterial(object.material);
    });
    mouse.userData.noMerge = true;
    const model = buildWorkstation(parent, mouse);
    // Preserve the deforming steam; batch opaque surfaces without changing detail.
    const scenes = prepareScenes(model);
    batchStatic(model, scenes.roots, { mergeDynamic: true });
    return { workspace: model, scenes };
  }, [mouseAsset]);

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
