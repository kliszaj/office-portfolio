// Geometry-only regression: no renderer or browser required.
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildWorkstation } from '../lib/workspace/model.ts';
import { prepareScenes } from '../lib/workspace/scenes.ts';
const context = new Proxy({}, { get: (_, key) => key === 'createImageData'
  ? (w,h) => ({data:new Uint8ClampedArray(w*h*4)})
  : key === 'createLinearGradient' ? () => ({addColorStop(){}}) : () => {}, set:()=>true });
globalThis.document = { createElement:()=>({width:0,height:0,getContext:()=>context}) };
const root=buildWorkstation(new THREE.Group());
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
