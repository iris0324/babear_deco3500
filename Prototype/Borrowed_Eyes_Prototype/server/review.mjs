// Local staff utility. ADMIN_TOKEN must match the running server; no secret is stored here.
const [action,id,status,...note]=process.argv.slice(2);
if(!['list','resolve'].includes(action)){console.log('ADMIN_TOKEN=<server secret> node server/review.mjs list\nADMIN_TOKEN=<server secret> node server/review.mjs resolve <report-id> resolved|dismissed "review note"');process.exit(0)}
if(!process.env.ADMIN_TOKEN){console.error('Set ADMIN_TOKEN to the same value configured on the server.');process.exit(1)}
const base=process.env.BACKEND_URL||'http://127.0.0.1:8787';
if(action==='resolve'&&(!id||!['resolved','dismissed'].includes(status)||!note.length)){console.error('A report ID, valid status and review note are required.');process.exit(1)}
try{const response=await fetch(base+'/api/admin/reports'+(action==='resolve'?'/'+encodeURIComponent(id):''),{method:action==='resolve'?'POST':'GET',headers:{'X-Admin-Token':process.env.ADMIN_TOKEN,...(action==='resolve'?{'Content-Type':'application/json',Origin:new URL(base).origin}:{})},body:action==='resolve'?JSON.stringify({status,note:note.join(' ')}):undefined});const body=await response.json();if(!response.ok)throw Error(body.error);console.log(JSON.stringify(body,null,2))}catch(e){console.error(e.message);process.exitCode=1}
