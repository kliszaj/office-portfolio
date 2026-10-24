// Geometry-only regression: no renderer or browser required.
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildWorkstation } from '../lib/workspace/model.ts';
import { readFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { installDeskAssets } from '../lib/workspace/imports.ts';
import { prepareScenes } from '../lib/workspace/scenes.ts';
const context = new Proxy({}, { get: (_, key) => key === 'createImageData'
  ? (w,h) => ({data:new Uint8ClampedArray(w*h*4)})
  : key === 'createLinearGradient' ? () => ({addColorStop(){}}) : () => {}, set:()=>true });
globalThis.document = { createElement:()=>({width:0,height:0,getContext:()=>context}) };
const root=buildWorkstation(new THREE.Group());
if(process.argv.includes('--imported')) {
  // Geometry-only loading: omit image payloads so this check needs no DOM image decoder.
  const load=async name=>{
    const bytes=await readFile(new URL(`../public/models/${name}.glb`,import.meta.url));
    const jsonLength=bytes.readUInt32LE(12),data=JSON.parse(bytes.subarray(20,20+jsonLength));
    for(const m of data.materials ?? []) {delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;}}
    delete data.images;delete data.textures;
    const binary=bytes.subarray(28+jsonLength);data.buffers=[{byteLength:binary.length,uri:`data:application/octet-stream;base64,${binary.toString('base64')}`}];
    return (await new GLTFLoader().parseAsync(JSON.stringify(data),'' )).scene;
  };
  globalThis.ProgressEvent=class {};
  const [chair,keyboard,computer,arm,light]=await Promise.all(['aeron','gmmk-pro','terra','ergotron-lx','key-light'].map(load));
  installDeskAssets(root,{chair,keyboard,computer,arm,light});
  root.updateMatrixWorld(true);
  const keyboardBounds=new THREE.Box3().setFromObject(root.getObjectByName('Mechanical keyboard'));
  assert(Math.abs(keyboardBounds.min.y-.7835)<1e-6,'Keyboard feet must touch the cutting mat');
  const pcBounds=new THREE.Box3().setFromObject(root.getObjectByName('Fractal Design Terra • silver'));
  assert(Math.abs(pcBounds.min.y-.778)<1e-6,'Terra feet must touch the desk');
  const spacebar=keyboard.localToWorld(new THREE.Vector3(.1182,.0254,-.1411));
  const functionRow=keyboard.localToWorld(new THREE.Vector3(.0182,.0373,-.1825));
  assert(spacebar.z>functionRow.z,'Spacebar must face the chair');
  const lamp=root.getObjectByName('Elgato Key Light Mini');
  const clampBounds=new THREE.Box3();
  lamp.traverse(o=>{if(o.isMesh && o.geometry.boundingBox?.max.y<.1)clampBounds.union(new THREE.Box3().setFromObject(o));});
  const deskRear=.4-.3895;
  assert(clampBounds.min.z<deskRear && clampBounds.max.z>deskRear,'Light clamp must straddle the desk edge');
  assert(clampBounds.min.y<.778 && clampBounds.max.y>.778,'Light clamp must meet the tabletop');
  let fabricCount=0;
  chair.traverse(o=>{if(o.isMesh && o.material.alphaMap){assert(o.material.alphaTest===.5);fabricCount++;}});
  assert(fabricCount>=2,'Both chair suspension surfaces must retain the original open weave');
  for(const name of ['Mechanical keyboard','Fractal Design Terra • silver','Herman Miller Aeron • stylized']) {
    const b=new THREE.Box3().setFromObject(root.getObjectByName(name));
    assert(Number.isFinite(b.min.x) && b.max.y>b.min.y,`Invalid imported bounds: ${name}`);
  }
}
prepareScenes(root);
const pivot=root.getObjectByName('Microphone swing pivot');
const computer=root.getObjectByName('Fractal Design Terra • silver');
root.updateMatrixWorld(true);
const obstacle=new THREE.Box3().setFromObject(computer).expandByScalar(.005);
let checked=0;
for(let i=0;i<=210;i++) {
  pivot.rotation.y=-1.05*i/210;root.updateMatrixWorld(true);
  pivot.traverse(object=>{
    if(!object.isMesh)return;
    const bounds=new THREE.Box3().setFromObject(object);
    assert(!bounds.intersectsBox(obstacle), `${object.name} hits Terra at swing sample ${i}`);
    checked++;
  });
}
console.log(`PASS: ${checked} mesh bounds checked across 211 arm poses with 5 mm clearance.`);
