"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useCursor, Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { buildWorkstation, animateWorkstation } from "@/lib/workspace/model";
import { useThemeControls } from "@/lib/theme";
import { prepareScenes } from "@/lib/workspace/scenes";
import { useProjectTransition } from "@/lib/transition";
import { aboutProject } from "@/lib/projects";
import { cloneAsset, installDeskAssets } from "@/lib/workspace/imports";
import { batchStatic } from "@/lib/workspace/batch";

/** The workspace only: no scan, room shell, wall furniture or exercise equipment. */
export default function WorkspaceModel() {
  const { scene: mouseAsset } = useGLTF("/models/mx-master-3s.glb");
  const assets = useGLTF(["/models/aeron.glb", "/models/gmmk-pro.glb", "/models/terra.glb", "/models/ergotron-lx.glb", "/models/key-light.glb"]);
  const chairAsset=assets[0].scene, keyboardAsset=assets[1].scene, computerAsset=assets[2].scene, armAsset=assets[3].scene, lightAsset=assets[4].scene;
  const { sceneHour } = useThemeControls();
  const reducedMotion = useRef(false);
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(Boolean(hovered));
  const { startTransition } = useProjectTransition();
  const puffUntil = useRef(0);
  const actionFor = (object: THREE.Object3D): string | null => {
    let current: THREE.Object3D | null = object;
    while (current) {
      if (current.name === 'Ultrawide monitor') return 'Explore my work';
      if (current.name === 'Sony A6000 on monitor mount') return 'A little about me';
      if (current.name === 'Coffee mug') return 'A little coffee break';
      current = current.parent;
    }
    return null;
  };
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
    installDeskAssets(model,{chair:cloneAsset(chairAsset),keyboard:cloneAsset(keyboardAsset),computer:cloneAsset(computerAsset),arm:cloneAsset(armAsset),light:cloneAsset(lightAsset)});
    // Preserve the deforming steam; batch opaque surfaces without changing detail.
    const scenes = prepareScenes(model);
    batchStatic(model, [...scenes.roots, model.getObjectByName("Ultrawide monitor")!, model.getObjectByName("Sony A6000 on monitor mount")!], { mergeDynamic: true });
    return { workspace: model, scenes };
  }, [mouseAsset,chairAsset,keyboardAsset,computerAsset,armAsset,lightAsset]);

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
    const steam = workspace.getObjectByName('Coffee steam')!;
    const remaining = puffUntil.current - performance.now();
    if (remaining > 0) { steam.visible = true; steam.scale.setScalar(reducedMotion.current ? 1 : 1 + Math.sin(Math.min(1,remaining/2200)*Math.PI)*.45); }
    else steam.scale.setScalar(1);
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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const action = actionFor(event.object);
    if (!action) return;
    event.stopPropagation();
    if (action === 'Explore my work') document.getElementById('work')?.scrollIntoView({behavior: reducedMotion.current ? 'instant' : 'smooth', block:'start'});
    else if (action === 'A little about me') startTransition(aboutProject);
    else puffUntil.current = performance.now() + 2200;
    setHovered(null);
  };
  return <>
    <primitive object={workspace} dispose={null} onClick={handleClick}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => { const action = actionFor(event.object); if (action) event.stopPropagation(); setHovered(action); }}
      onPointerOut={() => setHovered(null)} />
    {hovered && <Html position={[0,1.74,.4]} center style={{pointerEvents:'none',whiteSpace:'nowrap'}}><span style={{background:'#17242de8',color:'#fff',padding:'9px 14px',borderRadius:30,fontSize:12}}>{hovered} ↗</span></Html>}
  </>;
}
