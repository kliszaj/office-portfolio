// Geometry-only regression: no renderer or browser required.
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildWorkstation } from '../lib/workspace/model.ts';
import { readFile } from 'node:fs/promises';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
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
    const manifest=JSON.parse(await readFile(new URL("../lib/workspace/model-assets.json",import.meta.url),"utf8"));
    const bytes=await readFile(new URL(`../public${manifest[name]}`,import.meta.url));
    const jsonLength=bytes.readUInt32LE(12),data=JSON.parse(bytes.subarray(20,20+jsonLength));
    for(const m of data.materials ?? []) {delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;}}
    delete data.images;delete data.textures;
    const binary=bytes.subarray(28+jsonLength);data.buffers[0]={byteLength:binary.length,uri:`data:application/octet-stream;base64,${binary.toString('base64')}`};
    return (await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(JSON.stringify(data),'' )).scene;
  };
  globalThis.ProgressEvent=class {};
  const [chair,keyboard,computer,arm,light]=await Promise.all(['aeron','gmmk-pro','terra','ergotron-lx','key-light'].map(load));
  installDeskAssets(root,{chair,keyboard,computer,arm,light});
  root.updateMatrixWorld(true);
  const keyboardRoot=root.getObjectByName('Mechanical keyboard');
  const keyboardBounds=new THREE.Box3().setFromObject(keyboardRoot);
  assert(keyboardBounds.min.y<=.7835 && keyboardBounds.max.y>.7835,'Keyboard must meet the mat while leaving its keys above it');
  assert(!keyboardRoot.getObjectByName('Keyboard rubber contact foot'),'No separately lowered replacement feet');
  const pcBounds=new THREE.Box3().setFromObject(root.getObjectByName('Fractal Design Terra • silver'));
  assert(Math.abs(pcBounds.min.y-.778)<1e-6,'Terra feet must touch the desk');
  const spacebar=keyboard.localToWorld(new THREE.Vector3(.1182,.0254,-.1411));
  const functionRow=keyboard.localToWorld(new THREE.Vector3(.0182,.0373,-.1825));
  assert(spacebar.z>functionRow.z,'Spacebar must face the chair');
  const upperPad=new THREE.Box3().setFromObject(root.getObjectByName('Light clamp upper contact pad'));
  const lowerPad=new THREE.Box3().setFromObject(root.getObjectByName('Light clamp underside pressure pad'));
  assert(Math.abs(upperPad.min.y-.778)<1e-6,'Light upper pad must rest on desktop');
  assert(Math.abs(lowerPad.max.y-.734)<1e-6,'Light screw pad must contact plywood underside');
  const spine=new THREE.Box3().setFromObject(root.getObjectByName('Light clamp rear spine'));
  assert(spine.max.z<.4-.3895,'Clamp spine must clear the rear edge');
  for(const name of ['Controller shell','Earbud case']){
    const b=new THREE.Box3().setFromObject(root.getObjectByName(name));
    assert(Math.abs(b.min.y-.778)<1e-6,`${name} must sit on desktop`);
  }
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
