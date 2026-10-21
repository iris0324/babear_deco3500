import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {Store} from '../server/store.mjs';
import {LegacyService as Service} from '../server/legacy-service.mjs';
import {createServer} from '../server/http.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('real HTTP transport: cookies, CSRF, static isolation, live chat, SSE, image authorization and logout',async t=>{
 const service=new Service(new Store(),root+'private');const server=createServer(service,root+'frontend',{adminToken:'test-admin-only'});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 t.after(()=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve)}));
 const base='http://127.0.0.1:'+server.address().port;
 async function call(path,{cookie,body,method=body===undefined?'GET':'POST',origin=base,headers={}}={}){const response=await fetch(base+path,{method,headers:{...(cookie?{Cookie:cookie}:{}),...(body===undefined?{}:{'Content-Type':'application/json',Origin:origin}),...headers},body:body===undefined?undefined:JSON.stringify(body)});const data=(response.headers.get('content-type')||'').includes('application/json')?await response.json():await response.text();return {response,data}}
 const health=await call('/api/health');assert.equal(health.response.status,200);
 const missing=await call('/api/bootstrap');assert.equal(missing.response.status,401);
 const csrf=await call('/api/session',{body:{name:'A'},origin:'https://untrusted.example'});assert.equal(csrf.response.status,403);
 const login=await call('/api/session',{body:{name:'Alice'}});const cookie=login.response.headers.get('set-cookie').split(';')[0];assert.ok(login.response.headers.get('set-cookie').includes('HttpOnly'));assert.ok(login.response.headers.get('set-cookie').includes('SameSite=Strict'));assert.equal(login.data.token,undefined);
 const second=await call('/api/session',{body:{name:'Bob'}});const other=second.response.headers.get('set-cookie').split(';')[0];
 const boot=await call('/api/bootstrap',{cookie});assert.equal(boot.data.user.name,'Alice');assert.equal(boot.data.challenges.length,60);
 for(const path of ['/data/database.json','/private/artworks.json','/artworks.json','/.env','/server/service.mjs','/../private/challenges.json']){const out=await call(path,{cookie});assert.equal(out.response.status,404,path)}
 const index=await call('/');assert.ok(index.data.includes('app.js'));assert.ok(index.data.includes('data.js'));assert.ok(index.data.includes('backend-bridge.js'));assert.ok(!index.data.includes('online.js'));assert.ok(index.response.headers.get('content-security-policy').includes("default-src 'self'"));
 const fragment=await fetch(base+boot.data.challenges[0].fragment,{headers:{Cookie:cookie}});assert.equal(fragment.status,200);assert.equal(fragment.headers.get('content-type'),'image/jpeg');assert.equal((await fragment.arrayBuffer()).byteLength>0,true);
 for(const c of [cookie,other])await call('/api/checkin',{cookie:c,body:{code:'CLASSROOM-DEMO',area:1}});
 const controller=new AbortController();const events=await fetch(base+'/api/events',{headers:{Cookie:other},signal:controller.signal});assert.equal(events.headers.get('content-type'),'text/event-stream');const reader=events.body.getReader();const first=await reader.read();assert.ok(new TextDecoder().decode(first.value).includes('connected'));
 await call('/api/chat/public',{cookie,body:{text:'Hello from real HTTP',requestId:'http-message'}});let received='';for(let i=0;i<3&&!received.includes('refresh');i++){const chunk=await reader.read();received+=new TextDecoder().decode(chunk.value)}assert.ok(received.includes('refresh'));controller.abort();
 const messages=await call('/api/chat/public',{cookie:other});assert.equal(messages.data.messages[0].text,'Hello from real HTTP');
 const c=boot.data.challenges[0];const waiting=await call('/api/match',{cookie,body:{challengeId:c.id,role:'guesser'}});const matched=await call('/api/match',{cookie:other,body:{challengeId:c.id,role:'describer'}});assert.equal(matched.data.id,waiting.data.id);
 assert.equal(matched.data.status,'matched');await call(`/api/rooms/${waiting.data.id}/accept`,{cookie,body:{}});await call(`/api/rooms/${waiting.data.id}/accept`,{cookie:other,body:{}});
 const forbidden=await call(`/api/rooms/${waiting.data.id}/artwork`,{cookie});assert.equal(forbidden.response.status,403);assert.equal((await call('/assets/artworks/BE-001.jpg',{cookie})).response.status,403);
 const allowed=await fetch(base+`/api/rooms/${waiting.data.id}/artwork`,{headers:{Cookie:other}});assert.equal(allowed.status,200);await allowed.arrayBuffer();
 const deniedAdmin=await call('/api/admin/reports',{cookie});assert.equal(deniedAdmin.response.status,403);assert.equal((await call('/api/admin/reports',{headers:{'X-Admin-Token':'test-admin-only'}})).response.status,200);
 await call('/api/session',{cookie,method:'DELETE',body:{}});assert.equal((await call('/api/bootstrap',{cookie})).response.status,401);assert.equal((await call('/api/rooms/'+waiting.data.id,{cookie:other})).data.status,'ended');
});
