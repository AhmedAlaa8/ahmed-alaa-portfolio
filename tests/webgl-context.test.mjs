import test from 'node:test';
import assert from 'node:assert/strict';
import {createWebGLContext} from '../lib/create-webgl-context.mjs';

test('reuses the supported WebGL2 context without a second allocation',()=>{
 const context={},requests=[];
 const result=createWebGLContext({getContext(type,attributes){requests.push({type,attributes});return context;}});
 assert.equal(result.context,context);
 assert.equal(result.lite,false);
 assert.deepEqual(requests,[{type:'webgl2',attributes:result.attributes}]);
 assert.equal(result.attributes.failIfMajorPerformanceCaveat,true);
});

test('retries rejected accelerated contexts with software-compatible attributes',()=>{
 const context={},requests=[];
 const result=createWebGLContext({getContext(type,attributes){requests.push(attributes);return attributes.failIfMajorPerformanceCaveat?null:context;}});
 assert.equal(result.context,context);
 assert.equal(result.lite,true);
 assert.equal(requests.length,2);
 assert.equal(result.attributes.antialias,false);
 assert.equal(result.attributes.failIfMajorPerformanceCaveat,false);
});

test('returns the unavailable result when WebGL2 fails or throws',()=>{
 for(const throws of [false,true]){
  let attempts=0;
  const result=createWebGLContext({getContext(){attempts++;if(throws)throw new Error('Context blocked');return null;}});
  assert.equal(result,null);
  assert.equal(attempts,2);
 }
});
