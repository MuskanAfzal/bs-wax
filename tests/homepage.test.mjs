import test from 'node:test';
import assert from 'node:assert/strict';
import {api} from '../server/api.mjs';
import {makeEnv} from '../scripts/test-env.mjs';
import {homepageDefaults} from '../lib/homepage.mjs';
const req=(path,method='GET',data,cookie)=>new Request('https://example.test'+path,{method,headers:{...(cookie?{cookie}:{}),'content-type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});

test('homepage defaults, edits, validation and retained gallery images',async()=>{
 const env=await makeEnv();
 try{
  const login=await api(req('/api/login','POST',{password:'test-admin-password'}),env);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  const content=await (await api(req('/api/content'),env)).json();
  assert.deepEqual(content.homepage,homepageDefaults);
  assert.equal((await api(req('/api/admin/media'),env)).status,401);
  const original=await (await api(req('/api/admin/media','GET',null,cookie),env)).json();
  assert.equal(original.images.length,3);
  await env.BUCKET.put('first.jpg',new Uint8Array([255,216,255]),{httpMetadata:{contentType:'image/jpeg'}});
  await env.BUCKET.put('second.jpg',new Uint8Array([255,216,255]),{httpMetadata:{contentType:'image/jpeg'}});
  const save=()=>api(req('/api/admin/content','PUT',content,cookie),env);
  content.homepage.heroHeading='Your next clean ride';content.homepage.afterImage='/media/first.jpg';
  assert.equal((await save()).status,200);
  assert.equal((await api(req('/media/first.jpg'),env)).status,200);
  content.homepage.afterImage='/media/second.jpg';assert.equal((await save()).status,200);
  assert.equal((await api(req('/media/first.jpg'),env)).status,404);
  assert.equal((await api(req('/media/first.jpg','GET',null,cookie),env)).status,200);
  const gallery=await (await api(req('/api/admin/media','GET',null,cookie),env)).json();
  assert.ok(gallery.images.some(image=>image.url==='/media/first.jpg'));
  content.homepage.afterImage='/media/first.jpg';assert.equal((await save()).status,200);
  assert.equal((await api(req('/media/first.jpg'),env)).status,200);
  assert.equal((await (await api(req('/api/content'),env)).json()).homepage.heroHeading,'Your next clean ride');
  content.homepage.afterImage='javascript:alert(1)';assert.equal((await save()).status,400);
  content.homepage.afterImage=homepageDefaults.afterImage;content.homepage.heroHeading='x'.repeat(2001);assert.equal((await save()).status,400);
  assert.equal((await api(req('/api/admin/media?offset=-1','GET',null,cookie),env)).status,400);
 }finally{await env.close()}
});

test('old saved content gains homepage defaults without losing business edits',async()=>{
 const env=await makeEnv();try{
  const content=await (await api(req('/api/content'),env)).json();delete content.homepage;content.settings.brand='Existing business';
  await env.DB.prepare('INSERT INTO content (id,json) VALUES (?,?)').bind('site',JSON.stringify(content)).run();
  const result=await (await api(req('/api/content'),env)).json();assert.equal(result.settings.brand,'Existing business');assert.deepEqual(result.homepage,homepageDefaults);
 }finally{await env.close()}
});
