import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stationCode,stationFromInput,stationPosition,validateClassroom} from '../js/features/classroom.js';
import {borrowAttemptLimit,blindAttemptLimit} from '../js/features/team.js';
import {advanceBlindWrongGuess} from '../js/features/blind.js';
const config=JSON.parse(readFileSync(new URL('../assets/data/classroom.json',import.meta.url)));
const arts=JSON.parse(readFileSync(new URL('../assets/data/artworks.json',import.meta.url)));
assert.equal(validateClassroom(config,new Map(arts.map(a=>[a.id,a]))),config);
assert.equal(new Set(config.stations.map(s=>s.artworkId)).size,18);
assert.deepEqual(['A','B','C','D'].map(w=>config.stations.filter(s=>s.wall===w).length),[5,4,5,4]);
assert.equal(stationCode('be1'),'BE01');assert.equal(stationCode('18'),'BE18');
for(const invalid of ['0','19','BE99','-1','1.5','BE1xx',''])assert.equal(stationCode(invalid),null);
const base='https://iris0324.github.io/babear_deco3500/';
assert.equal(stationFromInput(base+'?station=BE18',base),'BE18');
assert.equal(stationFromInput('https://example.com/?station=BE01',base),null);
assert.equal(stationFromInput(base+'other/?station=BE01',base),null);
for(const s of config.stations)assert.ok(stationPosition(s).every(v=>v>0&&v<100));
for(let difficulty=1;difficulty<=5;difficulty++) {
 for(let people=1;people<=5;people++)assert.equal(borrowAttemptLimit(difficulty,people),difficulty+1-people);
 assert.equal(blindAttemptLimit(difficulty),difficulty+1);
 let session={attemptsUsed:0,cluesUnlocked:0};
 for(let wrong=1;wrong<=difficulty;wrong++) {
  session.attemptsUsed=wrong;
  const progress=advanceBlindWrongGuess(session,difficulty);session.cluesUnlocked=progress.cluesUnlocked;
  assert.equal(session.cluesUnlocked,wrong);assert.equal(progress.newlyUnlocked,true);
 }
 assert.equal(blindAttemptLimit(difficulty)-session.attemptsUsed,1,'Final clue leaves one formal attempt');
}
assert.throws(()=>validateClassroom({...config,stations:config.stations.slice(1)},new Map()));
console.log('PASS: 18 unique artworks, 5/4/5/4 wall layout, label parsing and origin checks, every Borrow/Blind difficulty and final-clue attempt');
