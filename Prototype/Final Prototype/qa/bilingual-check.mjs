// DOM fixture tests, without a browser or network access.
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const decode=s=>String(s).replace(/&(amp|lt|gt|quot|#39);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[x]));
let document;
class Element {
 constructor(tag='div',attrs={}){this.tagName=tag;this.attrs=attrs;this.children=[];this.style={};this.listeners={};this.selectionStart=null;this.selectionEnd=null;this.hidden=false;this._value=undefined;this.checked='checked' in attrs;}
 get dataset(){return Object.fromEntries(Object.entries(this.attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));}
 get id(){return this.attrs.id||''}get name(){return this.attrs.name||''}get type(){return this.attrs.type||(this.tagName==='select'?'select-one':this.tagName==='textarea'?'textarea':'text')}
 set type(v){this.attrs.type=v}
 get value(){if(this._value!==undefined)return this._value;if(this.tagName==='select'){const options=this.querySelectorAll('option');return (options.find(o=>o.hasAttribute('selected'))||options[0])?.value||''}return this.attrs.value??this.textContent;}
 set value(v){this._value=String(v)}
 set innerHTML(html){this._html=html;this.children=[];parse(html,this)}get innerHTML(){return this._html||''}
 get textContent(){return this.children.map(c=>c.nodeValue??c.textContent).join('')}
 set textContent(v){this.children=[{nodeValue:String(v),parentElement:this}]}
 getAttribute(k){return this.attrs[k]??null}hasAttribute(k){return k in this.attrs}setAttribute(k,v){this.attrs[k]=String(v)}
 matches(selector){return selector.split(',').some(part=>{const s=part.trim();if(s.startsWith('#'))return this.id===s.slice(1);if(s.startsWith('.'))return (this.attrs.class||'').split(' ').includes(s.slice(1));const attr=s.match(/^(\w+)?\[([^\]^=]+)(\^?=)?["']?([^"'\]]*)["']?\]$/);if(attr){const [,tag,k,op,val]=attr;return (!tag||this.tagName===tag)&&this.hasAttribute(k)&&(!op||(op==='^='?this.attrs[k].startsWith(val):this.attrs[k]===val))}return this.tagName===s;});}
 querySelectorAll(selector){const result=[];for(const child of this.children){if(!(child instanceof Element))continue;if(child.matches(selector))result.push(child);result.push(...child.querySelectorAll(selector));}return result}
 querySelector(s){return this.querySelectorAll(s)[0]||null}closest(s){return this.matches(s)?this:this.parentElement?.closest(s)||null}
 focus(){document.activeElement=this}setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b}addEventListener(k,f){this.listeners[k]=f}append(c){c.parentElement=this;this.children.push(c)}showModal(){this.open=true}
 getBoundingClientRect(){return {left:0,top:0,width:400,height:300}}
}
function parse(html,root){const stack=[root];const tokens=html.match(/<\/?[\w:-]+\b(?:[^>"']|"[^"]*"|'[^']*')*>|[^<]+|</g)||[];for(const token of tokens){if(token.startsWith('</')){const tag=token.match(/^<\/([^\s>]+)/)?.[1];const at=stack.findLastIndex(e=>e.tagName===tag);if(at>0)stack.length=at;continue}if(token.startsWith('<')&&token.length>1){const tag=token.match(/^<([^\s/>]+)/)[1],attrs={};const body=token.slice(tag.length+1,-1);for(const m of body.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))attrs[m[1]]=decode(m[2]??m[3]??m[4]??'');const el=new Element(tag,attrs);stack.at(-1).append(el);if(!['img','input','br','meta','link','hr','image','path','rect'].includes(tag)&&!token.endsWith('/>'))stack.push(el);}else stack.at(-1).children.push({nodeValue:decode(token),parentElement:stack.at(-1)});}}
const nodes=new Map(['masthead','view','navigation','toast','notice'].map(id=>[id,new Element('div',{id})]));nodes.get('notice').innerHTML='<h2 id="notice-title"></h2><p id="notice-copy"></p><button>Close</button>';
const handlers={},store=new Map();
document={documentElement:new Element('html'),activeElement:null,querySelector(s){if(s.startsWith('#')&&nodes.has(s.slice(1)))return nodes.get(s.slice(1));for(const n of nodes.values()){const r=n.querySelector(s);if(r)return r}return null},querySelectorAll(s){return [...nodes.values()].flatMap(n=>n.querySelectorAll(s))},addEventListener(k,f){handlers[k]=f},createElement:t=>new Element(t),createTreeWalker(n){const texts=[];const scan=e=>{for(const c of e.children)if(c instanceof Element)scan(c);else texts.push(c)};scan(n);let i=0;return {nextNode:()=>texts[i++]||null}}};
const context=vm.createContext({console,document,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},window:{scrollTo(){},confirm:()=>true},navigator:{},setTimeout:()=>1,clearTimeout(){},Date,URL,Image:class{},FormData:class{constructor(f){this.f=f}get(k){return this.f[k]??null}has(k){return k in this.f}}});
for(const file of ['data.js','i18n.js','app.js'])vm.runInContext(readFileSync(root+file,'utf8'),context);
const run=c=>vm.runInContext(c,context);const click=(action,value)=>handlers.click({target:{closest:s=>s==='[data-do]'?{dataset:{do:action,value}}:null}});
assert.equal(document.documentElement.getAttribute('lang'),'en');
assert.equal(document.querySelectorAll('[data-do="set-language"]').length,2);
click('set-language','zh');assert.equal(document.documentElement.getAttribute('lang'),'zh-CN');assert.ok(nodes.get('view').textContent.includes('欣赏艺术'));assert.ok(!nodes.get('view').textContent.includes('Some details'));
assert.equal(document.querySelectorAll('[data-do="set-language"]').find(x=>x.dataset.value==='zh').getAttribute('aria-pressed'),'true');
// Existing form contents, checkbox values and cursor survive switching.
run("go('signup')");let email=document.querySelector('[name="email"]'),password=document.querySelector('[name="password"]');email.value='sample@example.com';password.value='Sample password';password.type='text';email.selectionStart=3;email.selectionEnd=6;email.focus();click('set-language','en');assert.equal(document.querySelector('[name="email"]').value,'sample@example.com');assert.equal(document.querySelector('[name="password"]').value,'Sample password');assert.equal(document.querySelector('[name="password"]').type,'text');assert.equal(document.activeElement.selectionStart,3);
run("S.user={name:'Home'};S.location='inside';selectedId=all()[0].id;blindTag=all()[0].id;selectedVisitor='willow';mapArea=1;startGame('borrow',all()[0],['You','Maya']);S.game.comments={0:'personal',1:'other'};S.game.attempts=1");
const before=run('JSON.stringify(S.game)');click('set-language','zh');assert.equal(run('JSON.stringify(S.game)'),before);assert.ok(nodes.get('masthead').textContent.includes('借来的眼睛'));run("go('profile')");assert.ok(nodes.get('view').querySelectorAll('[data-user-content]').some(n=>n.textContent==='Home'));
// Whole page content: bundled names, 60 comments/reflections and 300 clues.
for(const c of run('window.CHALLENGES')){for(const value of [c.comment,c.reflection,...c.clues]){const translated=run('tr('+JSON.stringify(value)+')');assert.notEqual(translated,value);assert.ok(!/[A-Za-z]/.test(translated),value)}}
for(const a of run('window.ARTWORKS')){for(const key of ['title','description','artist','medium','imageRights'])assert.notEqual(run('tr('+JSON.stringify(a[key])+')'),a[key]);}
const routes=['home','menu','browse','detail','teams','lobby','comment','play','clues','game-chat','guess','wrong','blind-role','blind-tags','blind-match','blind-summary','blind-chat','location','location-state','chat','visitor','conversation','chat-team','map','area','creator','profile','sources','safety'];
const permitted=/\b(?:BE|Q|JPG|PNG|WebP|MB|GPS|Kai|Willow|Maya|Leo|Juno|Maple|Sage|River|Home|English)\b/g;
function untranslated(){const texts=[];for(const root of nodes.values()){const walk=document.createTreeWalker(root);let n;while(n=walk.nextNode()){if(n.parentElement.closest('[data-user-content],textarea,.language-switch'))continue;const clean=n.nodeValue.replace(/BE-\d+|Q\d+/g,'').replace(permitted,'');if(/[A-Za-z]{2,}/.test(clean))texts.push(n.nodeValue)}}return texts;}
let pages=0;
for(const language of ['zh','en']){run(`changeLanguage('${language}')`);for(const page of routes){run(`go('${page}')`);assert.ok(nodes.get('view').textContent.length>10,page);if(language==='zh')assert.deepEqual(untranslated(),[],page);pages++;}}
run("S.game=null;creatorStep=1;go('creator')");for(let step=1;step<=7;step++){run("S.draft={image:all()[0].image,title:'My title',artist:'Creator',artId:'LOCAL',comment:'My own comment',crop:{x:.1,y:.1,w:.3,h:.5},clues:['One','Two','Three','Four','Area 3 — Lower left'],area:3}");run(`creatorStep=${step};creatorClue=0;changeLanguage('zh');go('creator')`);assert.deepEqual(untranslated(),[],'creator '+step);pages++;}
run("reportTarget={name:'Kai',id:'kai',text:'Report'};go('report-form')");const reason=document.querySelector('[name="reason"]');reason.value='Harassment or bullying';const details=document.querySelector('[name="details"]');details.value='Home / 原始证据';const check=document.querySelector('[name="block"]');check.checked=true;click('set-language','en');assert.equal(document.querySelector('[name="reason"]').value,'Harassment or bullying');assert.equal(document.querySelector('[name="details"]').value,'Home / 原始证据');assert.equal(document.querySelector('[name="block"]').checked,true);click('set-language','zh');assert.equal(document.querySelectorAll('option').find(x=>x.textContent==='骚扰或欺凌').value,'Harassment or bullying');assert.equal(nodes.get('view').querySelector('[data-user-content]').textContent,'Report');
run("notice('Location permissions','Use your browser’s location permission prompt.')");assert.ok(nodes.get('notice').textContent.includes('定位权限'));click('set-language','en');assert.ok(nodes.get('notice').textContent.includes('Location permissions'));
run("toast('Draft saved in this browser.')");click('set-language','zh');assert.equal(nodes.get('toast').textContent,'草稿已保存在本浏览器。');click('set-language','en');assert.equal(nodes.get('toast').textContent,'Draft saved in this browser.');
run("S.language='zh';S.game=null;selectedId=works()[0].id");
for(const page of ['welcome','login','signup','reset','reset-sent','terms','catalogue','sources','creator-success']){run(`go('${page}')`);assert.deepEqual(untranslated(),[],page);pages++;}
for(const access of ['inside','outside','denied']){run(`selectedId=all()[0].id;S.location='${access}'`);for(const page of ['location-state','chat','conversation','teams']){run(`go('${page}')`);assert.deepEqual(untranslated(),[],`${access} ${page}`);pages++;}}
for(const who of ['guesser','describer']){run(`role='${who}';startGame('blind',all()[0],['You','Partner'],'${who}')`);for(const page of ['blind-match','blind-summary','blind-chat']){run(`go('${page}')`);assert.deepEqual(untranslated(),[],`${who} ${page}`);pages++;}}
run("S.game.finished=true;S.game.success=false;go('result')");assert.deepEqual(untranslated(),[],'failed result');pages++;
run("changeLanguage('en')");
assert.equal(JSON.parse(store.get('borrowedEyes.frontend.v3')).language,'en');
console.log(`PASS: ${pages} bilingual page states, all 60 challenge titles/reflections and 300 clues, all 12 artwork records, form/cursor/checkbox preservation, canonical report values, original user content, dialogs/toasts, language persistence and unchanged game state.`);
