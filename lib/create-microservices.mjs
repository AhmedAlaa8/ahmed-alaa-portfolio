/** Illustrative service network. It does not depict a proprietary production system. */
export function createMicroservices(T,color='#174fee'){
 const group=new T.Group(),geometries=new Set(),materials=new Set(),textures=[];const geo=g=>(geometries.add(g),g),mat=m=>(materials.add(m),m);
 const primary=mat(new T.MeshStandardMaterial({color,roughness:.32,metalness:.22}));
 const neutral=mat(new T.MeshStandardMaterial({color:'#c8d4e6',roughness:.36,metalness:.3}));
 const routeMaterial=mat(new T.MeshStandardMaterial({color,roughness:.5,metalness:.25,transparent:true,opacity:.42}));
 const positions=[new T.Vector3(-1.12,.79,.12),new T.Vector3(1.05,.79,-.13),new T.Vector3(1.16,-.81,.08),new T.Vector3(-1.07,-.79,-.12)];
 function tile(size,depth,material,pos){const s=new T.Shape(),r=.10,h=size/2;s.moveTo(-h+r,-h);s.lineTo(h-r,-h);s.quadraticCurveTo(h,-h,h,-h+r);s.lineTo(h,h-r);s.quadraticCurveTo(h,h,h-r,h);s.lineTo(-h+r,h);s.quadraticCurveTo(-h,h,-h,h-r);s.lineTo(-h,-h+r);s.quadraticCurveTo(-h,-h,-h+r,-h);const g=geo(new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.026,bevelThickness:.026,bevelSegments:2,curveSegments:5}));g.translate(0,0,-depth/2);const m=new T.Mesh(g,material);m.position.copy(pos);group.add(m);return m}
 function label(text,parent,size,z){const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');x.clearRect(0,0,256,128);x.fillStyle=parent.material===primary?'#ffffff':'#243953';x.font='500 30px sans-serif';x.textAlign='center';x.fillText(text,128,83);x.globalAlpha=.65;for(let i=0;i<3;i++)x.fillRect(96+i*24,25,14,14);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;textures.push(tex);const m=mat(new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));const plane=new T.Mesh(geo(new T.PlaneGeometry(size,size/2)),m);plane.position.z=z;parent.add(plane)}
 const gateway=tile(.86,.32,primary,new T.Vector3(0,0,.30));label('API',gateway,.66,.188);
 const names=['AUTH','ORDERS','PAYMENTS','EVENTS'];const nodes=positions.map((p,i)=>{const n=tile(.67,.24,neutral,p);label(names[i],n,.60,.151);return n});
 const paths=positions.map((p,i)=>{const start=new T.Vector3(p.x*.18,p.y*.18,.26);const curve=new T.CatmullRomCurve3([start,new T.Vector3(p.x*.45,p.y*.17,.04),new T.Vector3(p.x*.74,p.y*.66,-.04),p.clone()],false,'centripetal');group.add(new T.Mesh(geo(new T.TubeGeometry(curve,28,.017,6,false)),routeMaterial));return curve});
 const packetMaterial=mat(new T.MeshBasicMaterial({color}));const packet=new T.Mesh(geo(new T.SphereGeometry(.053,12,8)),packetMaterial);group.add(packet);
 const halo=new T.Mesh(geo(new T.SphereGeometry(.086,12,8)),mat(new T.MeshBasicMaterial({color,transparent:true,opacity:.18,depthWrite:false,blending:T.AdditiveBlending})));group.add(halo);
 let selected=1,epoch=null;const bases=nodes.map(n=>n.position.clone());
 function setStage(i){selected=i;epoch=null}
 function tick(time,moving){if(epoch===null)epoch=time;nodes.forEach((n,i)=>{n.position.copy(bases[i]);n.rotation.z=moving?Math.sin(time*.0005+i)*.018:0;n.scale.setScalar(i===selected?1.045:1)});const phase=moving?((time-epoch)*.00022)%1:.64;packet.position.copy(paths[selected].getPointAt(phase));halo.position.copy(packet.position);gateway.rotation.z=moving?Math.sin(time*.00045)*.025:0}
 function setColor(value){primary.color.set(value);routeMaterial.color.set(value);packetMaterial.color.set(value);halo.material.color.set(value)}
 tick(0,false);return{group,tick,setStage,setColor,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose())}};
}
