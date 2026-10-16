import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as Subset from '../lib/three-subset.mjs';
import {createServiceOrbit} from '../lib/create-service-orbit.mjs';

// The browser receives only the subset, so a class missing from it is a runtime TypeError there.
test('every three.js API the sculpture code uses is exported by the subset',()=>{
 const used=new Set();
 for(const file of ['components/studio/sculpture.jsx','lib/create-service-orbit.mjs','lib/create-service-labels.mjs'])
  for(const [,name] of readFileSync(new URL(`../${file}`,import.meta.url),'utf8').matchAll(/\bT\.([A-Za-z_]\w*)/g))used.add(name);
 assert.ok(used.size>20,`expected the sculpture's API list, found ${used.size}`);
 const missing=[...used].filter(name=>!(name in Subset));
 assert.deepEqual(missing,[]);
});
test('the orbit model builds from the subset alone',()=>{
 const model=createServiceOrbit(Subset);
 try{model.tick(0,false,0);assert.equal(model.nodes.length,4);}finally{model.dispose();}
});
