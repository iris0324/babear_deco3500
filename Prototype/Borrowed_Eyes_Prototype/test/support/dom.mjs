export function createDOM(){
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
document={documentElement:new Element('html'),activeElement:null,querySelector(s){if(s.startsWith('#')&&nodes.has(s.slice(1)))return nodes.get(s.slice(1));for(const n of nodes.values()){const r=n.querySelector(s);if(r)return r}return null},querySelectorAll(s){return [...nodes.values()].flatMap(n=>n.querySelectorAll(s))},addEventListener(k,f,capture=false){(handlers[k]??=[]).push({fn:f,capture})},createElement:t=>new Element(t),createTreeWalker(n){const texts=[];const scan=e=>{for(const c of e.children)if(c instanceof Element)scan(c);else texts.push(c)};scan(n);let i=0;return {nextNode:()=>texts[i++]||null}}};

Object.defineProperty(Element.prototype,'dataset',{get(){const el=this;const attr=k=>'data-'+String(k).replace(/[A-Z]/g,c=>'-'+c.toLowerCase());return new Proxy({},{get:(_,k)=>el.attrs[attr(k)],set:(_,k,v)=>{el.attrs[attr(k)]=String(v);return true}})}});
const simpleMatches=Element.prototype.matches;
Element.prototype.matches=function(selector){return selector.split(',').some(sel=>{const parts=sel.trim().replace(/\s*>\s*/g,' > ').split(/\s+/);let index=parts.length-1;if(!simpleMatches.call(this,parts[index--]))return false;let parent=this.parentElement;while(index>=0){if(parts[index]==='>'){index--;if(!parent||!simpleMatches.call(parent,parts[index--]))return false;parent=parent.parentElement;}else{while(parent&&!simpleMatches.call(parent,parts[index]))parent=parent.parentElement;if(!parent)return false;parent=parent.parentElement;index--;}}return true})};
Element.prototype.append=function(...items){for(const child of items){if(child.parentElement){const old=child.parentElement.children.indexOf(child);if(old>=0)child.parentElement.children.splice(old,1)}child.parentElement=this;this.children.push(child)}};
Element.prototype.cloneNode=function(deep){const el=new Element(this.tagName,{...this.attrs});if(deep)for(const child of this.children)el.append(child instanceof Element?child.cloneNode(true):{nodeValue:child.nodeValue});return el};
Element.prototype.replaceChildren=function(...items){this.children=[];this.append(...items)};
Element.prototype.replaceWith=function(other){const p=this.parentElement;if(!p)return;const i=p.children.indexOf(this);p.children[i]=other;other.parentElement=p;this.parentElement=null};
Element.prototype.remove=function(){const p=this.parentElement;if(p)p.children=p.children.filter(c=>c!==this);this.parentElement=null};
Element.prototype.contains=function(el){return el===this||this.children.some(c=>c instanceof Element&&c.contains(el))};
Object.defineProperty(Element.prototype,'firstElementChild',{get(){return this.children.find(c=>c instanceof Element)||null}});
Object.defineProperty(Element.prototype,'previousElementSibling',{get(){if(!this.parentElement)return null;const c=this.parentElement.children.filter(c=>c instanceof Element);return c[c.indexOf(this)-1]||null}});
Object.defineProperty(Element.prototype,'content',{get(){return this}});
return {document,nodes,handlers,store,Element};

}
