/** A translucent glass volume with one continuous transaction path. */
export function createFlowSculpture(T,color='#174fee'){
 const group=new T.Group(),geometries=new Set(),materials=new Set();
 const keepG=g=>(geometries.add(g),g),keepM=m=>(materials.add(m),m);
 function mesh(geometry,material){const object=new T.Mesh(keepG(geometry),material);group.add(object);return object}
 const glass=keepM(new T.MeshPhysicalMaterial({color:'#bfdbff',transparent:true,opacity:.105,roughness:.12,metalness:.05,clearcoat:1,clearcoatRoughness:.12,side:T.DoubleSide,depthWrite:false}));
 const outline=new T.Shape();const w=1.35,h=1.2,r=.18;outline.moveTo(-w+r,-h);outline.lineTo(w-r,-h);outline.quadraticCurveTo(w,-h,w,-h+r);outline.lineTo(w,h-r);outline.quadraticCurveTo(w,h,w-r,h);outline.lineTo(-w+r,h);outline.quadraticCurveTo(-w,h,-w,h-r);outline.lineTo(-w,-h+r);outline.quadraticCurveTo(-w,-h,-w+r,-h);
 const slab=new T.ExtrudeGeometry(outline,{depth:.78,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,curveSegments:8,steps:1});slab.translate(0,0,-.39);const shell=mesh(slab,glass);shell.renderOrder=3;
 const edgeMaterial=keepM(new T.LineBasicMaterial({color:'#91a9cd',transparent:true,opacity:.27}));const edges=new T.LineSegments(keepG(new T.EdgesGeometry(slab,35)),edgeMaterial);group.add(edges);
 const route=new T.CatmullRomCurve3([new T.Vector3(-.92,.72,.12),new T.Vector3(-.40,.72,.12),new T.Vector3(.69,.70,-.06),new T.Vector3(.86,.43,-.10),new T.Vector3(.67,.06,-.06),new T.Vector3(-.61,-.05,.10),new T.Vector3(-.87,-.39,.14),new T.Vector3(-.63,-.75,.10),new T.Vector3(.22,-.76,-.02),new T.Vector3(.89,-.75,-.13)],false,'centripetal');
 const tubeMaterial=keepM(new T.MeshStandardMaterial({color,roughness:.25,metalness:.32}));mesh(new T.TubeGeometry(route,112,.049,10,false),tubeMaterial);
 const nodes=[];for(const t of [0,.5,1]){const m=keepM(new T.MeshStandardMaterial({color,roughness:.22,metalness:.35,emissive:color,emissiveIntensity:.12}));const n=mesh(new T.SphereGeometry(.105,16,12),m);n.position.copy(route.getPointAt(t));nodes.push(n)}
 const light=mesh(new T.SphereGeometry(.066,16,12),keepM(new T.MeshBasicMaterial({color:'#f4fbff'})));
 const halo=mesh(new T.SphereGeometry(.12,12,8),keepM(new T.MeshBasicMaterial({color,transparent:true,opacity:.18,depthWrite:false,blending:T.AdditiveBlending})));
 let active=0,progress=0,selectedAt=0;const anchors=[0,.5,1];
 function setStage(index){active=index;selectedAt=0;nodes.forEach((node,i)=>{node.material.emissiveIntensity=i===active?.8:.08})}
 function tick(time,moving){const target=anchors[active];progress=moving?T.MathUtils.lerp(progress,target,.095):target;const pulse=moving?(Math.sin(time*.0018)+1)/2:0;light.position.copy(route.getPointAt(T.MathUtils.clamp(progress,0,1)));halo.position.copy(light.position);halo.scale.setScalar(1+pulse*.23);if(moving&&Math.abs(progress-target)<.003){if(!selectedAt)selectedAt=time;const travel=.035*(1-Math.cos((time-selectedAt)*.0006));light.position.copy(route.getPointAt(T.MathUtils.clamp(target+(active===2?-travel:travel),0,1)));halo.position.copy(light.position)}}
 function setColor(value){tubeMaterial.color.set(value);nodes.forEach(node=>{node.material.color.set(value);node.material.emissive.set(value)});halo.material.color.set(value);glass.color.set(value).lerp(new T.Color('#ffffff'),.82);edgeMaterial.color.set(value).lerp(new T.Color('#ffffff'),.52)}
 setStage(0);tick(0,false);setColor(color);
 return {group,tick,setStage,setColor,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())}};
}
