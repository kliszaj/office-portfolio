import * as T from 'three';

export type WorkspaceScene = 'design' | 'meeting' | 'coding' | 'video' | 'sleep';
export function sceneForHour(hour: number): WorkspaceScene {
  if (hour < 6) return 'sleep';
  if (hour < 11) return 'design';
  if (hour < 13) return 'meeting';
  if (hour < 18) return 'coding';
  return 'video';
}

/** Illustrated app layouts, drawn locally rather than loading third-party embeds. */
function screenTexture(scene: WorkspaceScene) {
  const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 600;
  const c = canvas.getContext('2d')!;
  const rect = (x:number,y:number,w:number,h:number,color:string,r=0) => {c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
  const text = (t:string,x:number,y:number,size=20,color='#dce6ef') => {c.font=`500 ${size}px system-ui`;c.fillStyle=color;c.fillText(t,x,y);};
  const circle = (x:number,y:number,r:number,color:string) => {c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();};
  rect(0,0,1536,600,'#111922');
  if (scene === 'sleep') {rect(0,0,1536,600,'#080f15');}
  if (scene === 'design') {
    rect(0,0,1536,48,'#242529'); text('Figma   /   Portfolio explorations',24,31);rect(1390,9,115,30,'#7967ec',7);text('Share',1420,31,17);
    rect(0,48,220,552,'#f8f8fa');rect(220,48,1080,552,'#dedee5');rect(1300,48,236,552,'#f8f8fa');
    text('Layers',22,86,20,'#242735');['Page 01','◇  Desktop','    Header','    Selected work','    About me','◇  Mobile'].forEach((s,i)=>text(s,22,140+i*43,17,'#686b7a'));
    text('Design   Prototype',1320,85,17,'#242735');['Frame','W  1440    H  960','Layout','Fill   #F5EEDD','Corner radius  24','Export  +'].forEach((s,i)=>text(s,1320,140+i*58,16,'#686b7a'));
    rect(280,107,620,414,'#f8f0de',3);text('ADRIAN / DESIGNER',312,145,17,'#3c443c');text('Thoughtful things,',312,215,39,'#253e35');text('made for people.',312,261,39,'#253e35');rect(313,288,132,29,'#284c3c',15);text('Explore work ↗',327,308,14);
    ['#bc76a0','#8dafa0','#d9b77f'].forEach((color,i)=>{rect(313+i*182,348,163,130,color,9);circle(394+i*182,406,37,'#f5e8cf');});
    rect(948,107,245,414,'#f8f0de',18);text('Hello, I’m Adrian.',969,155,20,'#253e35');rect(968,181,205,190,'#8dafa0',9);circle(1070,272,65,'#f5e8cf');rect(968,393,205,96,'#bc76a0',9);
    c.strokeStyle='#8875ff';c.lineWidth=3;c.strokeRect(278,105,624,418);[[278,105],[902,105],[278,523],[902,523]].forEach(([x,y])=>rect(x-5,y-5,10,10,'#fff'));text('Desktop / exploration 04',280,91,15,'#6552ba');
  }
  if (scene === 'meeting') {
    text('Google Meet',28,37,23);text('Design catch-up',610,37,21);circle(1485,28,7,'#74d6a1');
    const colors=['#3b5962','#79675f','#64567d','#486d63','#625d7a','#3c6676'];
    ['Maya','Alex','Sam','Lou','Chris','You'].forEach((name,i)=>{const x=24+(i%3)*501,y=65+Math.floor(i/3)*221;rect(x,y,486,205,colors[i],13);circle(x+243,y+77,37,['#e1b39a','#b7866b','#eac5a2'][i%3]);c.fillStyle=['#c3a3de','#d5c78d','#97c9c2'][i%3];c.beginPath();c.ellipse(x+243,y+183,80,65,0,Math.PI,Math.PI*2);c.fill();rect(x+14,y+165,91,27,'#26333e',6);text(name,x+24,y+184,16);if(i===5){c.strokeStyle='#8db2ff';c.lineWidth=3;c.strokeRect(x+2,y+2,482,201);}});
    text('11:00  •  Daily design sync',28,563,18);[620,685,750,815].forEach(x=>circle(x,553,23,'#35414e'));text('🎙',608,560,20);text('▣',675,560,20);text('CC',738,559,15);text('⋯',805,560,20);rect(865,530,81,46,'#e36b70',23);text('⌁',891,560,28);
  }
  if (scene === 'video') {
    rect(0,0,1536,57,'#18191d');rect(23,17,34,23,'#ff4349',6);text('▶',33,34,15,'#fff');text('YouTube',67,37,24,'#fff');rect(450,12,600,35,'#292b30',18);text('Search',475,36,17,'#9299a3');
    const grad=c.createLinearGradient(0,80,0,440);grad.addColorStop(0,'#284c6a');grad.addColorStop(.65,'#df987f');grad.addColorStop(1,'#edc997');c.fillStyle=grad;c.fillRect(25,78,1055,425);
    circle(743,239,70,'#ffe6ac');
    ['#3c6270','#2b4a5a','#193746'].forEach((color,i)=>{c.fillStyle=color;c.beginPath();c.moveTo(25,503);for(let x=25;x<=1080;x+=35)c.lineTo(x,350+i*45+Math.sin(x*.009+i*2)*45);c.lineTo(1080,503);c.fill();});
    text('SLOW EVENINGS',75,156,38,'#fff3d6');text('A little room to breathe.',78,194,20,'#fff3d6');rect(43,480,1014,3,'#ffffff55');rect(43,480,410,3,'#ff5359');text('Ⅱ   12:48 / 48:00',47,463,16);text('A quiet evening in the mountains • design & unwind',26,542,25);text('STILL STUDIO     128K views',26,580,17,'#9ba7b6');
    ['A desk worth coming home to','Making things, slowly','Late night studio radio'].forEach((s,i)=>{rect(1110,78+i*157,170,110,['#667a89','#a88379','#685e88'][i],9);circle(1195,132+i*157,29,'#ead9ac');text(s.split(' ').slice(0,3).join(' '),1297,105+i*157,16);text(s.split(' ').slice(3).join(' '),1297,129+i*157,16);text('Studio journal',1297,161+i*157,13,'#8c98a9');});
  }
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;return texture;
}

export function prepareScenes(root:T.Group) {
  const coffee=root.getObjectByName('Coffee mug')!;
  const chair=root.getObjectByName('Herman Miller Aeron • stylized')!;
  const screen=root.getObjectByName('Illustrated editor display') as T.Mesh<T.PlaneGeometry,T.MeshBasicMaterial>;
  const diffuser=root.getObjectByName('Diffuser') as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;
  // Preserve moving parts as separate batching roots; keep the screen material editable.
  screen.userData.noMerge=true;diffuser.userData.noMerge=true;
  const textures:Record<WorkspaceScene,T.Texture>={design:screenTexture('design'),meeting:screenTexture('meeting'),coding:screen.material.map!,video:screenTexture('video'),sleep:screenTexture('sleep')};
  const overlay=new T.Mesh(screen.geometry,new T.MeshBasicMaterial({map:screen.material.map,transparent:true,opacity:0,depthWrite:false,toneMapped:false}));overlay.position.z=.0005;screen.add(overlay);
  const ring=new T.Mesh(new T.RingGeometry(.038,.042,64),new T.MeshBasicMaterial({color:'#85572e',transparent:true,opacity:.3,side:T.DoubleSide,depthWrite:false}));ring.userData.noMerge=true;ring.name='Morning coffee ring';ring.rotation.x=-Math.PI/2;ring.position.set(.52,.7805,.20);root.add(ring);
  const glass=new T.Group();glass.name='Afternoon water glass';glass.position.set(.49,.782,.02);root.add(glass);
  const shell=new T.Mesh(new T.CylinderGeometry(.032,.027,.112,40,1,true),new T.MeshPhysicalMaterial({color:'#d2f4ee',transparent:true,opacity:.28,roughness:.12,side:T.DoubleSide}));shell.position.y=.056;glass.add(shell);
  const water=new T.Mesh(new T.CylinderGeometry(.029,.025,.072,40),new T.MeshPhysicalMaterial({color:'#9fd3d9',transparent:true,opacity:.45,roughness:.16}));water.position.y=.037;glass.add(water);
  const lip=new T.Mesh(new T.TorusGeometry(.032,.0014,8,40),new T.MeshStandardMaterial({color:'#d7f5ef',transparent:true,opacity:.7}));lip.rotation.x=Math.PI/2;lip.position.y=.112;glass.add(lip);
  const key=new T.PointLight('#fff1d6',0,2,2);key.position.set(.46,1.60,-.20);root.add(key);
  const backlight=new T.PointLight('#eab58b',0,1.8,2);backlight.position.set(.095,1.10,-.29);root.add(backlight);
  const spill=new T.PointLight('#adcfff',0,1.8,2);spill.position.set(.095,1.12,.06);root.add(spill);
  const led=new T.Mesh(new T.SphereGeometry(.003,12,8),new T.MeshBasicMaterial({color:'#ff675e'}));led.userData.noMerge=true;led.position.set(.14,1.52,-.181);root.add(led);
  let active:WorkspaceScene='coding',fade=1;
  return {
    roots:[coffee,chair,glass],
    update(hour:number,delta:number,reduced:boolean) {
      const next=sceneForHour(hour),k=reduced?1:1-Math.exp(-delta*5);
      if(next!==active){overlay.material.map=screen.material.map;screen.material.map=textures[next];overlay.material.opacity=1;fade=0;active=next;}
      fade=reduced?1:Math.min(1,fade+delta*1.5);overlay.material.opacity=1-fade;
      const meeting=next==='meeting',sleep=next==='sleep',video=next==='video';
      coffee.visible=next==='design'||meeting;
      coffee.position.x=T.MathUtils.lerp(coffee.position.x,meeting?.55:.52,k);
      coffee.position.z=T.MathUtils.lerp(coffee.position.z,meeting?.12:.20,k);
      root.getObjectByName('Coffee steam')!.visible=next==='design';
      ring.visible=next==='coding'||video;glass.visible=next==='coding';
      chair.position.z=T.MathUtils.lerp(chair.position.z,sleep?.39:video?.59:.51,k);
      chair.rotation.y=T.MathUtils.lerp(chair.rotation.y,sleep?0:video?-.24:-.11,k);
      diffuser.material.emissiveIntensity=T.MathUtils.lerp(diffuser.material.emissiveIntensity,meeting?2.5:.02,k);
      key.intensity=T.MathUtils.lerp(key.intensity,meeting?.8:0,k);led.visible=meeting;
      backlight.intensity=T.MathUtils.lerp(backlight.intensity,video?1.1:0,k);
      spill.intensity=T.MathUtils.lerp(spill.intensity,video?.35:sleep?0:.05,k);
    },
    dispose(){Object.values(textures).forEach(texture=>texture.dispose());}
  };
}
