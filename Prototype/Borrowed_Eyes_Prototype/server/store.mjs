import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,randomUUID} from 'node:crypto';
export function initialState(){return {schema:1,secret:randomBytes(32).toString('hex'),users:{},sessions:{},rooms:{},messages:[],reports:[],rewards:[],actions:[]};}
export class Store {
 constructor(file=null){this.file=file;this.data=file&&fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):initialState();if(this.data.schema!==1||!this.data.secret)throw Error('Unsupported or damaged database. Refusing to overwrite.');if(file){fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});this.lock=file+'.lock';try{this.fd=fs.openSync(this.lock,'wx',0o600);fs.writeFileSync(this.fd,String(process.pid));}catch{throw Error('Database is already locked. Stop the other server; after a crash confirm the saved PID is no longer running before removing the .lock file.');}try{this.persist();}catch(e){this.close();throw e}}}
 persist(){if(!this.file)return;const temp=this.file+'.'+randomUUID()+'.tmp';let fd;try{fd=fs.openSync(temp,'wx',0o600);fs.writeFileSync(fd,JSON.stringify(this.data));fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;fs.renameSync(temp,this.file);}finally{if(fd!==undefined)fs.closeSync(fd);if(fs.existsSync(temp))fs.unlinkSync(temp)}}
 transaction(fn){const before=structuredClone(this.data);try{const result=fn(this.data);this.persist();return result}catch(e){this.data=before;throw e}}
 close(){if(this.fd!==undefined){fs.closeSync(this.fd);this.fd=undefined;fs.unlinkSync(this.lock)}}
}
