import * as T from 'three';

export type DeskAssets = { chair:T.Object3D; keyboard:T.Object3D; computer:T.Object3D; arm:T.Object3D; light:T.Object3D };

/** Own all GPU resources; never recolor or dispose the shared loader cache. */
export function cloneAsset(source:T.Object3D) {
  const asset=source.clone(true), textures=new Map<T.Texture,T.Texture>();
  asset.traverse(object => {
    if (!(object instanceof T.Mesh)) return;
    object.geometry=object.geometry.clone();
    object.castShadow=object.receiveShadow=true;
    const clone=(original:T.Material) => {
      const material=original.clone();
      for(const [key,value] of Object.entries(material)) if(value instanceof T.Texture) {
        if(!textures.has(value)) { const texture=value.clone();texture.anisotropy=8;textures.set(value,texture); }
        Object.assign(material,{[key]:textures.get(value)});
      }
      return material;
    };
    object.material=Array.isArray(object.material)?object.material.map(clone):clone(object.material);
  });
  return asset;
}

function paint(asset:T.Object3D, fn:(m:T.MeshStandardMaterial,mesh:T.Mesh)=>void) {
  asset.traverse(o=>{if(o instanceof T.Mesh) for(const m of Array.isArray(o.material)?o.material:[o.material]) if(m instanceof T.MeshStandardMaterial) fn(m,o);});
}
function grounded(asset:T.Object3D,rotation:number,scale=1) {
  const group=new T.Group();group.add(asset);asset.rotation.y+=rotation;asset.scale.multiplyScalar(scale);asset.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(asset),center=bounds.getCenter(new T.Vector3());asset.position.sub(new T.Vector3(center.x,bounds.min.y,center.z));return group;
}
function disposeChildren(group:T.Object3D) {
  const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();
  group.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);}}});
  group.clear();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
}

export function installDeskAssets(root:T.Group,assets:DeskAssets) {
  const replace=(name:string,asset:T.Object3D)=>{const group=root.getObjectByName(name)!;disposeChildren(group);group.add(asset);};
  const chair=grounded(assets.chair,Math.PI/2,1.05);
  // Keep the original model's open, two-direction woven suspension material.
  const original=(root.getObjectByName('Suspended woven seat') as T.Mesh).material as T.MeshStandardMaterial;
  const weave=original.clone();weave.map=original.map!.clone();weave.alphaMap=original.alphaMap!.clone();
  chair.updateMatrixWorld(true);
  paint(chair,(m,mesh)=>{
    let node:T.Object3D|null=mesh;let fabric=false,pad=false;
    while(node){fabric ||= node.name.includes('FABRIC');pad ||= node.name.includes('ARMPAD');node=node.parent;}
    m.color.set(fabric?'#303437':pad?'#202427':'#363b3e');m.roughness=fabric?.95:pad?.85:.48;m.metalness=0;
    if(fabric){
      m.color.copy(weave.color);m.map=weave.map;m.alphaMap=weave.alphaMap;
      m.transparent=false;m.opacity=1;m.side=T.DoubleSide;m.alphaTest=.5;m.roughness=.93;
      const p=mesh.geometry.attributes.position,uv=new Float32Array(p.count*2),v=new T.Vector3();
      const bounds=new T.Box3().setFromObject(mesh),size=bounds.getSize(new T.Vector3()),back=size.y>.2;
      for(let i=0;i<p.count;i++){
        v.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);
        uv[i*2]=(v.x-bounds.min.x)/size.x;
        uv[i*2+1]=back?(v.y-bounds.min.y)/size.y:(v.z-bounds.min.z)/size.z;
      }
      mesh.geometry.setAttribute('uv',new T.BufferAttribute(uv,2));
    }
  });
  replace('Herman Miller Aeron • stylized',chair);
  const keyboard=grounded(assets.keyboard,-Math.PI/2);
  paint(keyboard,m=>{
    if(m.map) return; // Preserve the original key legends and printed details.
    const c=m.color;
    if(c.r>.2 || c.g>.2 || c.b>.2){m.color.set('#d9d3c3');m.metalness=.08;m.roughness=.58;}
    else {m.color.set('#373a3b');m.roughness=.8;}
    if(m.name==='Material13'){m.color.set('#e7ded0');m.emissive.set('#000000');}
  });
  replace('Mechanical keyboard',keyboard);
  // The imported rubber feet start at zero; the cutting mat surface is y=.7835.
  root.getObjectByName('Mechanical keyboard')!.position.y=.7835;
  const computer=grounded(assets.computer,0);
  paint(computer,m=>{
    if(m.name==='*' || (m.name==='SketchUp_Standard' && !m.map)){m.color.set('#cbd0d2');m.metalness=.25;m.roughness=.42;}
    if(m.name.includes('Wood')){m.roughness=.72;m.metalness=0;}
  });
  replace('Fractal Design Terra • silver',computer);
  root.getObjectByName('Fractal Design Terra • silver')!.position.y=.778;
  const arm=assets.arm;
  paint(arm,m=>{if(!m.name.includes('008')){m.color.set('#eeeae1');m.metalness=.12;m.roughness=.42;}else{m.color.set('#313539');m.roughness=.75;}});
  // Supplied pose: VESA plate faces +X. Rotate it toward the monitor and
  // extend its height while keeping the clamp on the rear tabletop edge.
  const armFrame=new T.Group();armFrame.name='Imported white Ergotron LX';armFrame.rotation.y=-Math.PI/2;armFrame.position.set(.192,.780,-.43);arm.scale.set(.5,1.51,1);armFrame.add(arm);
  for(const name of ['Monitor clamp','Monitor mast','Articulated monitor arm','Articulated monitor arm rounded end','Monitor pivot']) {
    for(const o of [...root.children])if(o.name===name){root.remove(o);if(o instanceof T.Mesh)o.geometry.dispose();}
  }
  root.add(armFrame);
  // Use the supplied stand and housing, sized to the user's Key Light Mini.
  const light=assets.light;light.updateMatrixWorld(true);
  light.traverse(o=>{if(!(o instanceof T.Mesh))return;const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);o.geometry.dispose();o.geometry=g;o.position.set(0,0,0);o.quaternion.identity();o.scale.set(1,1,1);});
  // Flatten the hierarchy after baking, so source offsets don't apply twice.
  const meshes:T.Mesh[]=[];light.traverse(o=>{if(o instanceof T.Mesh)meshes.push(o);});
  const flat=new T.Group();flat.name='Imported Elgato Mini';
  for(const o of meshes){flat.add(o);const p=o.geometry.attributes.position;
    for(let i=0;i<p.count;i++){let x=p.getX(i)-2.629,y=p.getY(i),z=p.getZ(i)+1.414;
      if(y>.719){x=(x-.034)*.42+.034;y=(y-.841)*.42+.82;z=(z+.009)*.42-.009;}else if(y>.07)y=.07+(y-.07)*1.08;
      p.setXYZ(i,x,y,z);
    }o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();
  }
  flat.rotation.y=Math.PI/2;
  paint(flat,(m,mesh)=>{const b=mesh.geometry.boundingBox!;if(m.name==='SketchUp_Standard' && b.min.y>.75){m.color.set('#f3f4e9');m.emissive.set('#b6e3d7');m.emissiveIntensity=.4;mesh.name='Diffuser';}else{m.color.set('#323639');m.roughness=.5;}});
  replace('Elgato Key Light Mini',flat);
  // Clamp straddles the rear edge (z=-.3895), with the post just outside it.
  root.getObjectByName('Elgato Key Light Mini')!.position.set(.46,.780,-.405);
}
