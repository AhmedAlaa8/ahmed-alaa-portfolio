import test from 'node:test';
import assert from 'node:assert/strict';
import * as Three from 'three';
import {createServiceOrbit} from '../lib/create-service-orbit.mjs';

test('lower frame rates keep the orbit moving at the same speed',()=>{
 const normal=createServiceOrbit(Three),lite=createServiceOrbit(Three);
 try{
  for(let i=0;i<30;i++)normal.tick(i/30,true,1/30);
  for(let i=0;i<15;i++)lite.tick(i/15,true,1/15);
  normal.rings.forEach((ring,i)=>assert.ok(Math.abs(ring.rotation.z-lite.rings[i].rotation.z)<1e-8));
 }finally{normal.dispose();lite.dispose();}
});

test('both rings rotate while idle and stay still with motion disabled',()=>{
 const model=createServiceOrbit(Three);
 try{
  for(let i=0;i<120;i++)model.tick(i/30,true,1/30);
  const angles=model.rings.map(r=>r.rotation.z);
  assert.ok(angles[0]>.3);assert.ok(angles[1]<-.25);
  for(let i=0;i<120;i++)model.tick(4+i/30,false,1/30);
  assert.deepEqual(model.rings.map(r=>r.rotation.z),angles);
 }finally{model.dispose();}
});
test('selecting each service rotates its ring to bring that module forward',()=>{
 const model=createServiceOrbit(Three);
 try{
  for(let service=0;service<4;service++){
   model.setStage(service);
   for(let i=0;i<90;i++)model.tick(i/30,true,1/30);
   model.group.updateMatrixWorld(true);
   const position=model.nodes[service].getWorldPosition(new Three.Vector3());
   assert.ok(position.z>.70,`service ${service} should be toward the viewer: z=${position.z}`);
  }
 }finally{model.dispose();}
});
test('reduced-motion selection snaps to the chosen service without an ongoing rotation',()=>{
 const model=createServiceOrbit(Three);
 try{
  model.setStage(2);model.tick(0,false,0);model.group.updateMatrixWorld(true);
  assert.ok(model.nodes[2].getWorldPosition(new Three.Vector3()).z>.70);
  const angles=model.rings.map(r=>r.rotation.z);
  model.tick(10,false,.04);assert.deepEqual(model.rings.map(r=>r.rotation.z),angles);
 }finally{model.dispose();}
});

test('service inspection brings the chosen node to the front and enlarges it; closing restores the orbit',()=>{
 const model=createServiceOrbit(Three);
 try{
  model.setStage(0,true);
  for(let i=0;i<120;i++)model.tick(i/30,true,1/30);
  model.group.updateMatrixWorld(true);
  const position=model.nodes[0].getWorldPosition(new Three.Vector3());
  assert.ok(position.distanceTo(new Three.Vector3(0,.12,1.70))<.01);
  assert.ok(model.nodes[0].scale.x>1.80);
  const held=model.rings[0].rotation.z;
  for(let i=0;i<30;i++)model.tick(4+i/30,true,1/30);
  assert.equal(model.rings[0].rotation.z,held);
  model.setStage(1,true);
  for(let i=0;i<120;i++)model.tick(5+i/30,true,1/30);
  assert.ok(model.nodes[0].scale.x<1.01);
  model.setStage(1,false);
  for(let i=0;i<120;i++)model.tick(9+i/30,true,1/30);
  assert.ok(model.nodes[1].scale.x<1.07);
  const before=model.rings[0].rotation.z;
  model.tick(14,true,1/30);
  assert.notEqual(model.rings[0].rotation.z,before);
 }finally{model.dispose();}
});

test('reduced-motion inspection shows the enlarged service immediately',()=>{
 const model=createServiceOrbit(Three);
 try{
  model.setStage(3,true);model.tick(0,false,0);
  model.group.updateMatrixWorld(true);
  assert.ok(model.nodes[3].getWorldPosition(new Three.Vector3()).distanceTo(new Three.Vector3(0,.12,1.70))<.001);
  assert.equal(model.nodes[3].scale.x,2.60);
 }finally{model.dispose();}
});

test('inspection dims the surrounding model, and closing restores its materials',()=>{
 const model=createServiceOrbit(Three);
 try{
  const backdrop=model.group.children[0].children[0];
  const chosen=model.nodes[0].children[0];
  model.setStage(0,true);model.tick(0,false,0);
  assert.ok(backdrop.material.opacity<.11);
  assert.equal(chosen.material.opacity,1);
  assert.equal(model.panels[0].visible,true);
  model.setStage(0,false);model.tick(1,false,0);
  assert.equal(backdrop.material.opacity,1);
  assert.equal(backdrop.material.transparent,false);
  assert.equal(backdrop.material.depthWrite,true);
  assert.equal(model.panels[0].visible,false);
 }finally{model.dispose();}
});
