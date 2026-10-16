import test from 'node:test';
import assert from 'node:assert/strict';
import {workflowDemos,resolveWorkflow} from '../data/workflow-demos.mjs';

test('all three bilingual workflows provide matching step and explanation contracts',()=>{
 for(const locale of ['en','ar']){
  assert.deepEqual(workflowDemos[locale].examples.map(e=>e.id),['payments','investment','shipping']);
  for(const flow of workflowDemos[locale].examples){assert.equal(flow.nodes.length,3);assert.equal(flow.steps.length,4);assert.equal(flow.details.length,flow.steps.length);assert.ok(flow.details.every(Boolean));}
 }
 assert.equal(resolveWorkflow('ar','shipping').id,'shipping');
 assert.equal(resolveWorkflow('missing','unknown').id,'payments');
});
