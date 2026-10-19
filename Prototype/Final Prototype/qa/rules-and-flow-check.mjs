import {fileURLToPath} from 'node:url';import vm from 'node:vm';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));const handlers={},nodes=new Map(),store=new Map();
const node=()=>({innerHTML:'',hidden:false,textContent:'',value:'',style:{},dataset:{},focus(){},showModal(){},close(){},addEventListener(){},querySelector(){return node()},append(){},getBoundingClientRect(){return{left:0,top:0,width:400,height:300}}});
const document={querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},querySelectorAll:()=>[],addEventListener:(name,fn)=>handlers[name]=fn,createElement:()=>node()};
const context=vm.createContext({console,document,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},window:{scrollTo(){},confirm:()=>true},navigator:{},setTimeout:()=>1,clearTimeout(){},Date,URL,Image:class{},FormData:class{constructor(f){this.f=f}get(k){return this.f[k]??null}}});
vm.runInContext(readFileSync(root+'data.js','utf8'),context);vm.runInContext(readFileSync(root+'app.js','utf8'),context);
const run=c=>vm.runInContext(c,context);
assert.equal(run('all().length'),60);assert.equal(run('works().length'),12);assert.equal(run('new Set(all().map(a=>a.id)).size'),60);
for(const c of run('all()')){assert.equal(c.ratio,c.crop.w*c.crop.h);assert.equal(c.stars,c.ratio<.2?5:c.ratio<.4?4:c.ratio<.6?3:c.ratio<.8?2:1);assert.ok(c.crop.x+c.crop.w<=1);assert.ok(c.crop.y+c.crop.h<=1);}
assert.deepEqual([...new Set(run('all().map(c=>c.stars)'))].sort(),[1,2,3,4,5]);
for(const r of [0,.19999,.2,.39999,.4,.59999,.6,.79999,.8,1,1.1])assert.equal(run(`difficulty(${r})`),r<=0||r>1?0:r<.2?5:r<.4?4:r<.6?3:r<.8?2:1);
run("S.user={name:'Test visitor'};selectedId=all()[0].id;startGame('borrow',all()[0],['You']);S.game.comments[0]='A memory of summer';");
assert.equal(run('limit()'),5);run("S.lastCheckin='BE-001';persist()");assert.equal(run('S.game.attempts'),0);
assert.equal(run("submitGuess('BE-002')"),false);assert.equal(run('S.game.attempts'),1);assert.equal(run('S.game.cluesUnlocked'),0);
assert.equal(run("submitGuess('THE HARVESTERS')"),true);assert.equal(run('S.history[0].reward'),5);assert.equal(run("submitGuess('BE-001')"),false);assert.equal(run('S.game.attempts'),2);
run("startGame('borrow',all()[0],['You','Maya','Leo']);S.location='inside';");assert.equal(run('limit()'),3);
run("S.game.comments={0:'one',1:'two',2:'three'};actor=0");assert.equal(run('locationUnlocked()'),false);run("S.game.players=['You','Maya','Leo','Willow','Kai'];S.game.comments[4]='five';actor=4");assert.equal(run('locationUnlocked()'),true);run('actor=0');assert.equal(run('locationUnlocked()'),false);run('S.game.shared.push(4)');assert.equal(run('locationUnlocked()'),true);
run("startGame('blind',all()[0],['You','Partner'],'guesser')");assert.equal(run('limit()'),6);for(let i=0;i<5;i++)run("submitGuess('wrong answer')");assert.equal(run('left()'),1);assert.equal(run('S.game.cluesUnlocked'),5);assert.equal(run('S.game.finished'),false);run("submitGuess('wrong again')");assert.equal(run('S.game.finished'),true);assert.equal(run('S.game.success'),false);
run("startGame('blind',all()[0],['You','Partner'],'describer')");assert.equal(run("submitGuess('BE-001')"),false);assert.equal(run('S.game.attempts'),0);run("role='guesser';blindTag=all()[0].id;selectedVisitor='willow';selectedId=all()[0].id;mapArea=1;S.location='inside'");
const routes=['welcome','login','signup','reset','reset-sent','terms','home','menu','browse','detail','teams','lobby','comment','play','clues','game-chat','guess','wrong','blind-role','blind-tags','blind-match','blind-summary','blind-chat','location','location-state','chat','visitor','conversation','chat-team','map','area','catalogue','creator','profile','sources'];
for(const route of routes){if(route==='catalogue')run('selectedId=works()[0].id');run(`go('${route}')`);assert.ok(nodes.get('#view').innerHTML.length>50,route);assert.ok(!nodes.get('#view').innerHTML.includes('undefined'),route+' undefined text');}
run("S.game.role='guesser';go('blind-chat')");assert.ok(!nodes.get('#view').innerHTML.includes('alt="The Harvesters'));
run("S.game.cluesUnlocked=0;go('map')");assert.ok(nodes.get('#view').innerHTML.includes('Location clue locked.'));assert.ok(!nodes.get('#view').innerHTML.includes('The Harvesters'));
run("S.game.finished=true;S.game.success=false;go('result')");assert.ok(nodes.get('#view').innerHTML.includes('The Harvesters'));
run("S.game=null;selectedId=all()[0].id;S.draft={image:all()[0].image,title:all()[0].title,artist:all()[0].artist,artId:'LYE-TEST',date:'1889',comment:'A new memory',crop:{x:.1,y:.1,w:.3,h:.5},clues:['Feeling','Story','Colour','Relation','Area 3 — Lower left'],area:3};");
for(let i=1;i<=7;i++){run(`creatorStep=${i};creatorClue=0;go('creator')`);assert.ok(nodes.get('#view').innerHTML.length>50,'creator '+i)}
run('publishDraft()');assert.equal(run('S.published.length'),1);assert.equal(run('S.published[0].stars'),5);assert.equal(run('S.published[0].area'),3);assert.equal(run('S.draft'),null);
run("S.game=null;go('map')");assert.ok(nodes.get('#view').innerHTML.includes('Choose an area.'));
// Different details from the same work accept the same artwork answer, and keep separate reward identities.
run("S.history=[];startGame('borrow',all()[0],['You']);S.game.comments[0]='one';submitGuess('BE-001');startGame('borrow',all()[1],['You']);S.game.comments[0]='two';submitGuess('BE-001');");
assert.equal(run('S.history.length'),2);assert.equal(run('S.history[0].artId'),run('S.history[1].artId'));assert.notEqual(run('S.history[0].challengeId'),run('S.history[1].challengeId'));assert.equal(run('S.history[1].reward'),5);
console.log(`PASS: 12 artworks / 60 independent details, exact difficulty boundaries, Borrow and Blind submissions, private/shared area clue, role restrictions, ${routes.length} route renderings, 7 creator stages, local publication, per-detail rewards and persistent progress.`);
