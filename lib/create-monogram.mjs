import {aOutline,aCounter,markLayers} from './identity-geometry.mjs';
/** Two bevelled AA letterforms with genuine negative-space counters. */
export function createMonogram(T,color='#174fee') {
 const group=new T.Group();const pieces=[];
 const front=new T.MeshStandardMaterial({color,roughness:.27,metalness:.28});
 const rear=new T.MeshStandardMaterial({color,roughness:.36,metalness:.20});
 const side=new T.MeshStandardMaterial({color,roughness:.33,metalness:.32});
 function recolor(value){front.color.set(value);rear.color.set(value).multiplyScalar(.68);side.color.set(value).multiplyScalar(.82)}
 const shape=new T.Shape();aOutline.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
 const hole=new T.Path();aCounter.forEach(([x,y],i)=>i?hole.lineTo(x,y):hole.moveTo(x,y));hole.closePath();shape.holes.push(hole);
 const geometry=new T.ExtrudeGeometry(shape,{depth:.31,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:1});geometry.translate(0,0,-.155);
 for(const layer of markLayers){const mesh=new T.Mesh(geometry,[layer.name==='front'?front:rear,side]);mesh.position.set(layer.x,layer.y,layer.z);mesh.name=layer.name;mesh.userData.rest=mesh.position.clone();mesh.userData.split=layer.split;group.add(mesh);pieces.push(mesh)}
 recolor(color);
 return {group,pieces,setColor:recolor,dispose(){geometry.dispose();front.dispose();rear.dispose();side.dispose()}};
}
