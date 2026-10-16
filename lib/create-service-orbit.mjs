/** Approved Service Orbit sculpture: illustrative, not a production architecture diagram. */
export function createServiceOrbit(T,accent='#2456db'){
 const group=new T.Group(),geometries=new Set(),materials=new Set(),textures=new Set();
 const geo=g=>(geometries.add(g),g),mat=m=>(materials.add(m),m);
 const blue=mat(new T.MeshStandardMaterial({color:accent,metalness:.28,roughness:.25}));
 const ivory=mat(new T.MeshStandardMaterial({color:'#f0ebe1',metalness:.10,roughness:.29}));
 const metal=mat(new T.MeshStandardMaterial({color:'#bbc4ce',metalness:.92,roughness:.24}));
 const seam=mat(new T.MeshStandardMaterial({color:'#3b4658',metalness:.60,roughness:.38}));
 const ports=mat(new T.MeshStandardMaterial({color:'#8995a7',metalness:.65,roughness:.26}));
 const packetMat=mat(new T.MeshStandardMaterial({color:accent,metalness:.38,roughness:.14,emissive:accent,emissiveIntensity:.10}));
 function rounded(w,h,d,r,material){
  const s=new T.Shape(),x=w/2-r,y=h/2-r;
  s.moveTo(-x,-h/2);s.lineTo(x,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-y);s.lineTo(w/2,y);s.quadraticCurveTo(w/2,h/2,x,h/2);s.lineTo(-x,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,y);s.lineTo(-w/2,-y);s.quadraticCurveTo(-w/2,-h/2,-x,-h/2);
  const bevel=Math.min(.055,d*.17);
  const g=geo(new T.ExtrudeGeometry(s,{depth:d-2*bevel,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3,curveSegments:5,steps:1}));g.translate(0,0,-(d-2*bevel)/2);
  return new T.Mesh(g,material);
 }
 const hub=new T.Group();group.add(hub);
 const chassis=rounded(1.08,1.08,1.08,.20,metal);hub.add(chassis);
 const face=rounded(.99,.99,.07,.16,blue),side=face.clone(),back=face.clone(),top=face.clone();
 face.position.z=.562;back.position.z=-.562;back.rotation.y=Math.PI;side.rotation.y=Math.PI/2;side.position.x=.562;top.rotation.x=-Math.PI/2;top.position.y=.562;
 hub.add(face,side,back,top);
 const routeRadius=1.86;
 const rings=[new T.Group(),new T.Group()];
 const tilts=rings.map((ring,i)=>{const tilt=new T.Group();tilt.rotation.set(i===0?-.63:.74,0,i===0?.42:-.44);tilt.add(ring);group.add(tilt);return tilt;});
 const paths=[new T.Curve(),new T.Curve()];
 paths.forEach((p,i)=>{p.getPoint=function(t,target=new T.Vector3()){
   const a=t*Math.PI*2,v=new T.Vector3(Math.cos(a)*routeRadius,Math.sin(a)*routeRadius*.73,0);
   return target.copy(v);
  };rings[i].add(new T.Mesh(geo(new T.TubeGeometry(p,96,.024,8,true)),metal));});
 const placements=[[0,.12],[0,.62],[1,.31],[1,.81]];
 const nodes=placements.map(([path,at],i)=>{
   const node=new T.Group(),pos=paths[path].getPoint(at);node.position.copy(pos);
   const body=rounded(.61,.48,.42,.13,ivory);node.add(body);
   const band=rounded(.62,.49,.027,.135,metal);band.position.z=-.08;node.add(band);
   const stripe=rounded(.041,.32,.023,.013,blue);stripe.position.set(-.24,0,.226);node.add(stripe);
   const indicator=new T.Mesh(geo(new T.SphereGeometry(.025,10,6)),ports);indicator.position.set(.19,.12,.233);node.add(indicator);
   for(let n=0;n<6;n++){const port=new T.Mesh(geo(new T.SphereGeometry(.012,8,5)),seam);port.scale.z=.4;port.position.set(-.06+(n%3)*.075,-.04-Math.floor(n/3)*.070,.231);node.add(port);}
   // Short inner cables visually connect orbit and hub; illustrative architecture only.
   const from=pos.clone().multiplyScalar(.87),to=pos.clone().multiplyScalar(.30);
   const mid=from.clone().lerp(to,.5);mid.z-=.12;
   const curve=new T.QuadraticBezierCurve3(from,mid,to);
   rings[path].add(new T.Mesh(geo(new T.TubeGeometry(curve,16,.012,6,false)),metal));
   node.rotation.set(-.10,i%2?.16:-.12,i%2?-.11:.12);rings[path].add(node);
   node.userData.service=i;body.userData.service=i;return node;
 });
 const packet=new T.Mesh(geo(new T.SphereGeometry(.082,20,12)),packetMat);group.add(packet);
 // Independent materials let the backdrop fade while the inspected service stays solid.
 const fadeMeshes=[],colorMaterials=[];
 group.traverse(mesh=>{if(!mesh.isMesh)return;const original=mesh.material;mesh.material=mat(original.clone());if(original===blue||original===packetMat)colorMaterials.push(mesh.material);let owner=mesh.parent;while(owner&&owner.userData.service===undefined)owner=owner.parent;fadeMeshes.push({mesh,service:owner?.userData.service});});
 const panels=nodes.map(node=>{
   const material=mat(new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false}));
   const panel=new T.Mesh(geo(new T.PlaneGeometry(.53,.38)),material);panel.position.z=.265;panel.visible=false;node.add(panel);return panel;
 });
 let selected=1,phase=.62,focused=false,backdropFocus=0;
 const bases=nodes.map(n=>n.position.clone()),rotations=nodes.map(n=>n.quaternion.clone()),focusAmounts=[0,0,0,0];
 const focusPoint=new T.Vector3(0,.12,1.70),cameraPoint=new T.Vector3(2.25,1.45,7.65),up=new T.Vector3(0,1,0);
 const facing=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(cameraPoint,focusPoint,up));
 const localPoint=new T.Vector3(),worldFacing=new T.Quaternion(),parentRotation=new T.Quaternion();
 const targets=[null,null];
 const tau=Math.PI*2;
 function setStage(i,focus=false){
   selected=Math.max(0,Math.min(3,i));phase=placements[selected][1];
   focused=focus;
   const [ring,at]=placements[selected];
   // Bring the selected module to the foreground of its tilted orbit.
   const front=ring===0?-Math.PI/2:Math.PI/2;
   const desired=front-at*tau;
   const current=rings[ring].rotation.z;
   const shortest=Math.atan2(Math.sin(desired-current),Math.cos(desired-current));
   targets[ring]=current+shortest;
 }
 function tick(seconds,moving,delta=0){
   const dt=Math.min(Math.max(delta,0),.06);
   rings.forEach((ring,i)=>{
     if(targets[i]!==null){
       const gap=targets[i]-ring.rotation.z;
       if(!moving||Math.abs(gap)<.003){ring.rotation.z=targets[i];targets[i]=null;}
       else ring.rotation.z+=gap*(1-Math.exp(-dt*5));
     }else if(moving&&!(focused&&i===placements[selected][0])){ring.rotation.z+=dt*(i===0?.09:-.075);}
     ring.rotation.z=Math.atan2(Math.sin(ring.rotation.z),Math.cos(ring.rotation.z));
     if(targets[i]!==null)targets[i]=ring.rotation.z+Math.atan2(Math.sin(targets[i]-ring.rotation.z),Math.cos(targets[i]-ring.rotation.z));
   });
   if(moving)phase=(phase+dt*.070)%1;
   const path=placements[selected][0];
   if(packet.parent!==rings[path])rings[path].add(packet);
   packet.position.copy(paths[path].getPoint(phase));
   group.updateMatrixWorld(true);
   nodes.forEach((node,i)=>{
     const target=focused&&i===selected?1:0;
     const easing=moving?1-Math.exp(-dt*5):1;
     focusAmounts[i]+=(target-focusAmounts[i])*easing;
     const amount=focusAmounts[i];
     localPoint.copy(focusPoint);group.localToWorld(localPoint);node.parent.worldToLocal(localPoint);
     node.position.copy(bases[i]).lerp(localPoint,amount);
     node.parent.getWorldQuaternion(parentRotation);worldFacing.copy(parentRotation).invert().multiply(group.quaternion).multiply(facing);
     node.quaternion.copy(rotations[i]).slerp(worldFacing,amount);
     node.scale.setScalar(1+amount*1.60+(i===selected&&!focused?.055:0));
     panels[i].visible=amount>.001;panels[i].material.opacity=amount;
   });
   backdropFocus+=((focused?1:0)-backdropFocus)*(moving?1-Math.exp(-dt*5):1);
   fadeMeshes.forEach(({mesh,service})=>{
     const foreground=service===selected&&focused?1:0;
     const opacity=1-backdropFocus*.90*(1-foreground);
     const transparent=opacity<.999;
     if(mesh.material.transparent!==transparent){mesh.material.transparent=transparent;mesh.material.depthWrite=!transparent;mesh.material.needsUpdate=true;}
     mesh.material.opacity=transparent?opacity:1;
   });
 }
 function setColor(color){blue.color.set(color);packetMat.color.set(color);packetMat.emissive.set(color);colorMaterials.forEach(material=>{material.color.set(color);if(material.emissive)material.emissive.set(material===packet.material?color:'#000000');});}
 function setLabels(values){
   textures.forEach(texture=>texture.dispose());textures.clear();
   panels.forEach((panel,i)=>{panel.material.map=values[i]||null;if(values[i])textures.add(values[i]);panel.material.needsUpdate=true;});
 }
 tick(0,false);
 return {group,nodes,rings,panels,tick,setStage,setColor,setLabels,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}

