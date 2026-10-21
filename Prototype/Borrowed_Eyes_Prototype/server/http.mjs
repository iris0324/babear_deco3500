import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {timingSafeEqual} from 'node:crypto';
import {ApiError} from './service.mjs';
const equal=(a,b)=>{const x=Buffer.from(a||''),y=Buffer.from(b||'');return x.length===y.length&&timingSafeEqual(x,y)};
export function cookieToken(header=''){return header.split(';').map(x=>x.trim()).find(x=>x.startsWith('be_session='))?.slice(11)||null}
// Separate transport-independent dispatch permits real endpoint tests without sockets.
export function dispatch(service,{method='GET',pathname,token,body={},adminToken,expectedAdminToken}){
 if(pathname==='/api/health'&&method==='GET')return {ok:true};
 if(pathname==='/api/auth/register'&&method==='POST')return service.register(body);
 if(pathname==='/api/auth/login'&&method==='POST')return service.login(body);
 if(pathname==='/api/auth/reset'&&method==='POST')return service.reset(body);
 if(pathname==='/api/session'&&method==='POST')return service.session(body.name);
 if(pathname.startsWith('/api/admin/')){if(!expectedAdminToken||!equal(adminToken,expectedAdminToken))throw new ApiError(403,'ADMIN_ACCESS_DENIED');if(pathname==='/api/admin/reports'&&method==='GET')return {reports:service.db.reports};const m=pathname.match(/^\/api\/admin\/reports\/([a-f0-9-]+)$/);if(m&&method==='POST')return service.resolveReport(m[1],body);throw new ApiError(404,'NOT_FOUND')}
 const u=service.user(token);
 if(pathname==='/api/session'&&method==='DELETE'){service.logout(token);return {loggedOut:true}}
 if(pathname==='/api/bootstrap'&&method==='GET')return service.bootstrap(u);
 if(pathname==='/api/location'&&method==='POST')return service.classroomLocation(u,body);
 if(pathname==='/api/notebook'&&method==='POST')return service.notebook(u,body);
 if(pathname==='/api/friends'&&method==='POST')return service.friend(u,body);
 if(pathname==='/api/published'&&method==='POST')return service.publish(u,body);
 if(pathname==='/api/checkin'&&method==='POST')return service.checkin(u,body);
 if(pathname==='/api/rooms'&&method==='POST')return service.createRoom(u,body);
 if(pathname==='/api/match'&&method==='POST')return service.match(u,body);
 if(pathname==='/api/preferences'&&method==='POST')return service.preference(u,body);
 if(pathname==='/api/reports'&&method==='POST')return service.report(u,body);
 const room=pathname.match(/^\/api\/rooms\/([a-f0-9-]+)(?:\/(start|join|comment|share|guess|messages|remove|leave|accept|proposal))?$/);
 if(room){const [,id,action]=room;if(!action&&method==='GET')return service.roomView(service.room(id),u);if(method!=='POST')throw new ApiError(405,'METHOD_NOT_ALLOWED');const args=[u,id];if(action==='accept')return service.accept(...args);if(action==='proposal')return service.proposal(...args,body);if(action==='start')return service.start(...args);if(action==='join')return service.join(...args);if(action==='comment')return service.comment(...args,body);if(action==='share')return service.share(...args);if(action==='guess')return service.guess(...args,body);if(action==='messages')return service.sendRoom(...args,body);if(action==='remove')return service.remove(...args,body.targetId);if(action==='leave')return service.leave(...args)}
 const chat=pathname.match(/^\/api\/chat\/(public|[a-f0-9-]+)$/);if(chat){if(method==='GET')return service.chat(u,chat[1]);if(method==='POST')return service.sendChat(u,chat[1],body)}
 throw new ApiError(404,'NOT_FOUND');
}
export function createServer(service,frontendRoot,{secureCookie=false,adminToken='',allowedHosts=[]}={}){
 const events=new Set(),buckets=new Map();
 const send=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value))};
 const notify=()=>{for(const res of events)res.write('event: refresh\ndata: {}\n\n')};service.listeners.add(notify);
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  try{
   const host=req.headers.host||'';if(allowedHosts.length&&!allowedHosts.includes(host))throw new ApiError(403,'HOST_NOT_ALLOWED');
   if(!['GET','HEAD','POST','DELETE'].includes(req.method))throw new ApiError(405,'METHOD_NOT_ALLOWED');
   const url=new URL(req.url,'http://'+host);const token=cookieToken(req.headers.cookie),method=req.method;
   if(!['GET','HEAD'].includes(method)){
    const origin=req.headers.origin;const scheme=secureCookie?'https:':'http:';
    if(origin!==scheme+'//'+host)throw new ApiError(403,'ORIGIN_NOT_ALLOWED');
    if(!String(req.headers['content-type']||'').startsWith('application/json'))throw new ApiError(415,'JSON_REQUIRED');
   }
   const limit=['/api/session','/api/auth/register','/api/auth/login','/api/auth/reset'].includes(url.pathname)&&method==='POST'?15:600;let identity=req.socket.remoteAddress||'local';if(limit!==15&&token){try{identity=service.user(token).id}catch{}}const key=identity+':'+(limit===15?'session':'requests');const now=Date.now();let bucket=buckets.get(key);if(!bucket||now>bucket.until){bucket={count:0,until:now+60000};buckets.set(key,bucket)}if(++bucket.count>limit)throw new ApiError(429,'RATE_LIMITED');if(buckets.size>10000)for(const [k,b]of buckets)if(now>b.until)buckets.delete(k);
   let body={};if(!['GET','HEAD'].includes(method)){let bytes=0;const chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>(['/api/published','/api/notebook'].includes(url.pathname)?16*1024*1024:16384))throw new ApiError(413,'BODY_TOO_LARGE');chunks.push(chunk)}try{body=JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}')}catch{throw new ApiError(400,'INVALID_JSON')}if(!body||typeof body!=='object'||Array.isArray(body))throw new ApiError(400,'INVALID_JSON')}
   if(url.pathname==='/api/events'&&method==='GET'){
    const eventUser=service.user(token);if([...events].filter(r=>r.eventUserId===eventUser.id).length>=3)throw new ApiError(429,'TOO_MANY_STREAMS');if(events.size>=100)throw new ApiError(503,'TOO_MANY_CONNECTIONS');res.writeHead(200,{'Content-Type':'text/event-stream','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write('event: connected\ndata: {}\n\n');res.eventUserId=eventUser.id;events.add(res);const heartbeat=setInterval(()=>{try{service.user(token);res.write(': heartbeat\n\n')}catch{res.end()}},20000);const expiry=setTimeout(()=>res.end(),120000);req.on('close',()=>{events.delete(res);clearInterval(heartbeat);clearTimeout(expiry)});return;
   }
   let file;
   const fragment=url.pathname.match(/^\/api\/challenges\/(c-[a-f0-9]{24})\/fragment$/),artwork=url.pathname.match(/^\/api\/rooms\/([a-f0-9-]+)\/artwork$/);
   if(fragment&&['GET','HEAD'].includes(method)){service.user(token);file=service.fragmentFile(fragment[1])}
   else if(artwork&&['GET','HEAD'].includes(method))file=service.artworkFile(service.user(token),artwork[1]);
   else if(/^\/api\/uploads\/u-[a-f0-9]{32}\.jpg$/.test(url.pathname)&&['GET','HEAD'].includes(method)){const u=service.user(token);if(service.canReadCatalogArtwork&&!service.canReadCatalogArtwork(u,url.pathname))throw new ApiError(403,'ARTWORK_NOT_VISIBLE');file=path.join(service.uploadRoot,path.basename(url.pathname))}
   else if(url.pathname.startsWith('/api/')){
    const result=dispatch(service,{method,pathname:url.pathname,token,body,adminToken:req.headers['x-admin-token'],expectedAdminToken:adminToken});
    if(['/api/session','/api/auth/register','/api/auth/login'].includes(url.pathname)&&method==='POST'){res.setHeader('Set-Cookie',`be_session=${result.token}; HttpOnly; SameSite=Strict; Path=/${result.persistent===false?'':'; Max-Age=1209600'}${secureCookie?'; Secure':''}`);delete result.token;delete result.persistent}
    if(url.pathname==='/api/session'&&method==='DELETE')res.setHeader('Set-Cookie','be_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'+(secureCookie?'; Secure':''));
    return send(res,200,result);
   }else{
    if(!['GET','HEAD'].includes(method))throw new ApiError(405,'METHOD_NOT_ALLOWED');
    const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);const relative=pathname.slice(1);
    // The approved public catalog is retained; private database/server files and dotfiles are never served.
    if(!['index.html','app.js','data.js','i18n.js','style.css','backend-bridge.js'].includes(relative)&&!/^assets\/ui\/[a-z0-9-]+\.jpg$/.test(relative)&&!/^assets\/artworks\/BE-\d{3}\.jpg$/.test(relative))throw new ApiError(404,'NOT_FOUND');
    if(relative.startsWith('assets/artworks/')){const u=service.user(token);if(service.canReadCatalogArtwork&&!service.canReadCatalogArtwork(u,relative))throw new ApiError(403,'ARTWORK_NOT_VISIBLE');file=path.join(service.privateRoot,'artworks',path.basename(relative))}else file=path.join(frontendRoot,relative);
    if(relative==='index.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(method==='HEAD'?'':fs.readFileSync(file,'utf8').replace('</body>','<script src="backend-bridge.js"></script></body>'));return}
   }
   if(!fs.existsSync(file))throw new ApiError(404,'NOT_FOUND');const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg'}[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':mime});if(method==='HEAD')res.end();else fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
  }catch(e){if(res.headersSent){res.end();return}if(!(e instanceof ApiError))console.error('Request failed:',e.message);send(res,e.status||500,{error:e.code||'SERVER_ERROR'})}
 });
 server.requestTimeout=15000;server.headersTimeout=10000;server.on('close',()=>{service.listeners.delete(notify);for(const res of events)res.end()});return server;
}
