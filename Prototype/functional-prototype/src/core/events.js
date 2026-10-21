/* Borrowed Eyes | src/core/events.js | extracted from original app.js; classic scripts share global scope. */
document.addEventListener('click',event=>{const nav=event.target.closest('[data-go]');if(nav){if(nav.dataset.go==='creator'&&S.draft)creatorStep=S.draft.step||1;go(nav.dataset.go);return;}const el=event.target.closest('[data-do]');if(!el)return;const action=el.dataset.do,v=el.dataset.value;
 if(action==='navigate'){if(v==='creator'&&S.draft)creatorStep=S.draft.step||1;go(v)}
 if(action==='guest')signIn();
 if(action==='about')notice('A front-end museum prototype','Accounts, matching, visitors and chat partners are demonstrations on this device. Game rules, crop creation, comments, clues and browser saves work locally. The twelve source artworks and interface images are included in this local version.');
 if(action==='terms')notice('Prototype terms & privacy','This is an educational local prototype. Use sample sign-in details. Passwords are never saved or transmitted. Uploaded images, messages and progress remain in this browser. No public account, identity service or messaging backend is connected.');
 if(action==='show-password'){const input=el.parentElement.querySelector('input');input.type=input.type==='password'?'text':'password';el.textContent=tr(input.type==='password'?'Show':'Hide')}
 if(action==='logout'){S.user=null;S.location='unknown';persist();go('welcome')}
 if(action==='filter'){filter=v;detailPage=0;go('browse')}
 if(action==='difficulty-filter'){difficultyFilter=Number(v);detailPage=0;go('browse')}
 if(action==='detail-page'){detailPage=Number(v);go('browse')}
 if(action==='difficulty-help')notice('Smaller crop. Higher difficulty.','Crop percentage = (crop width × crop height) ÷ (full image width × full image height) × 100%. The image surface excludes any photographed frame. 1★: 80–100%; 2★: 60–<80%; 3★: 40–<60%; 4★: 20–<40%; 5★: >0–<20%. Zero area is invalid. High-star cards focus on tiny corners and ordinary surfaces; low-star cards deliberately show much more context.');
 if(action==='select-art'){selectedId=v;go('detail')}
 if(action==='begin-solo'){if(!mayReplaceGame())return;startGame('borrow',find(v),['You'])}
 if(action==='team-choice'){selectedId=v;teamTab='join';go('teams')}
 if(action==='team-tab'){teamTab=v;go('teams')}
 if(action==='join-team'){const a=find(selectedId);if(a.stars<2){toast('Choose a task with at least two stars to form a team.');return}teamSize=Math.min(a.stars,Number(v)+2);teamNames=['You','Maya','Leo','Willow','Kai'];S.teamName=['Art Explorers','Canvas Friends','Museum Wanderers'][Number(v)];go('lobby')}
 if(action==='team-reminder'){S.pendingTeamId=v;go('team-reminder');}
 if(action==='accept-team-reminder'){const id=S.pendingTeamId;if(!id)return;S.teamReminderFor=id;if(!mayReplaceGame())return;startGame('borrow',find(id),teamNames.slice(0,teamSize));}
 if(action==='ask-help'){const g=S.game;if(!g||g.mode!=='borrow'||g.players.length!==1||g.finished)return;const a=art(),remaining=Math.max(0,a.stars-Object.keys(g.comments).length);S.helpDraft={challengeId:g.challengeId,text:`I'm stuck on this one. Still need ${remaining} ${remaining===1?'clue':'clues'} — anyone wanna help?`,title:a.comment};S.helpReturn=true;chatTarget='public';go('conversation');}
 if(action==='send-help'){if(!S.helpDraft)return;S.messages.push({room:'public',name:'You',text:S.helpDraft.text,helpRequest:{challengeId:S.helpDraft.challengeId,title:S.helpDraft.title},mine:true,time:'Just now'});S.helpDraft=null;persist();render();}
 if(action==='cancel-help'){S.helpDraft=null;render();}
 if(action==='back-to-game'){S.helpDraft=null;S.helpReturn=false;go('play');}
 if(action==='begin-team'){if(S.location!=='inside'){locationIntent='lobby';go('location');return}if(!mayReplaceGame())return;startGame('borrow',find(v),teamNames.slice(0,teamSize))}
 if(action==='share-clue'){const i=Number(v),g=S.game;if(!g.comments[i]||g.shared.includes(i))return;g.shared.push(i);const c=suffixClues(art())[i];g.messages.push({name:g.players[i],text:`My clue (Q${c.q}): ${c.text}`,clue:{q:c.q,text:c.text},challengeId:g.challengeId,mine:i===0});persist();go('game-chat')}
 if(action==='choose-role'){role=v;go('blind-tags')}
 if(action==='blind-tag'){blindTag=v;go('blind-match')}
 if(action==='start-blind'){if(!mayReplaceGame())return;startGame('blind',find(blindTag),['You','Anonymous Partner'],role)}
 if(action==='blind-add-friend'){const g=S.game;if(!g||g.mode!=='blind'||!g.finished)return;if(g.friendRequested){toast('Friend request is already pending in this prototype.');return}if(!confirm('Save a sample friend request for this partner? No real request will be sent.'))return;g.friendRequested=true;persist();render();toast('Friend request saved locally.');}
 if(action==='blind-new-partner'){if(!S.game||S.game.mode!=='blind'||!S.game.finished)return;if(!confirm('Find a new partner? Your completed round will remain in local history where available.'))return;go('blind-tags')}
 if(action==='blind-leave-game'){if(!S.game||S.game.mode!=='blind')return;if(!confirm('Leave this game and return to the main menu?'))return;go('home')}
 if(action==='switch-role'){S.game.role=S.game.role==='guesser'?'describer':'guesser';persist();go('blind-chat')}
 if(action==='request-location')requestLocation();
 if(action==='location-choice')setLocation(v);
 if(action==='location-help')notice('Location permissions','Use the site controls beside the address bar in your browser to change location permission. Browsers do not let this page open the system location settings directly. You can also use the explicit classroom demo states.');
 if(action==='chat-location'){locationIntent='chat';go('location')}
 if(action==='visitor-filter'){filter=v;go('chat')}
 if(action==='visitor'){selectedVisitor=v;go('visitor')}
 if(action==='open-chat'){if(S.blocked.includes(v)){toast('Unblock this visitor before messaging.');return}chatTarget=v;go('conversation')}
 if(action==='invite-visitor'){if(S.blocked.includes(v))return;chatTarget=v;if(S.location!=='inside'){locationIntent='chat-team';go('location')}else go('chat-team')}
 if(action==='friend'){if(!S.friends.includes(v))S.friends.push(v);persist();toast('Sample visitor added to your local notebook.');render()}
 if(action==='report'){reportTarget={name:visitors.find(x=>x.id===v)?.name||v,text:'Profile report',id:v};reportReturn=route;go('report-form')}
 if(action==='report-message'){reportTarget=JSON.parse(decodeURIComponent(v));reportReturn=route;go('report-form')}
 if(action==='language')changeLanguage(S.language==='en'?'zh':'en');
 if(action==='set-language')changeLanguage(v);
 if(action==='mute'){if(!S.muted.includes(v))S.muted.push(v);persist();render()}
 if(action==='unmute'){S.muted=S.muted.filter(x=>x!==v);persist();render()}
 if(action==='unblock'){S.blocked=S.blocked.filter(x=>x!==v);persist();render()}
 if(action==='remove-member'){const g=S.game,i=Number(v);if(actor!==0||!g||g.mode!=='borrow'||i===0||!g.players[i]||g.removed?.includes(i))return;if(!confirm(tr('Remove this member from team chat? Attempts and clue ownership stay unchanged.')))return;(g.removed??=[]).push(i);S.moderation.push({name:g.players[i],action:'Removed from team chat',date:new Date().toISOString()});persist();render()}
 if(action==='leave-team'){if(!S.game||!confirm(tr('Leave this conversation and end this local round without a reward?')))return;S.game.finished=true;S.game.success=false;S.game.left=true;persist();go('home')}
 if(action==='block'){if(!window.confirm(tr('Hide this sample visitor in this browser?')))return;if(!S.blocked.includes(v))S.blocked.push(v);persist();go('chat')}
 if(action==='leave-gallery'){S.location='outside';go('conversation')}
 if(action==='map-area'){if(active())return;mapArea=Number(v);go('area')}
 if(action==='catalogue'){if(active())return;selectedId=v;go('catalogue')}
 if(action==='select-area'){const d=draft();d.area=Number(v);d.clues[4]=`Area ${v} — ${areas[Number(v)-1]}`;persist();go('creator')}
 if(action==='creator-sample'){const a=find(v),d=draft();Object.assign(d,{image:a.image,title:a.title,artist:a.artist,date:a.date,artId:a.id,artworkId:a.id,crop:null,imageWidth:a.imageWidth,imageHeight:a.imageHeight,imageBounds:a.imageBounds,source:a.source});persist();go('creator')}
 if(action==='creator-next')creatorNext();
 if(action==='creator-prev'){if(creatorStep===6&&creatorClue>0)creatorClue--;else creatorStep=Math.max(1,creatorStep-1);draft().step=creatorStep;go('creator')}
 if(action==='crop-preset'){const side=Math.sqrt(Number(v));draft().crop={x:(1-side)/2,y:(1-side)/2,w:side,h:side};persist();go('creator')}
 if(action==='save-draft'){draft().step=creatorStep;persist();toast('Draft saved in this browser.');}
 if(action==='creator-clue-next'){if(!draft().area){toast('Choose a gallery area first.');return}creatorStep=7;draft().step=7;persist();go('creator')}
 if(action==='publish')publishDraft();
 if(action==='new-draft'){S.draft=null;creatorStep=1;creatorClue=0;persist();go('creator')}
});
document.addEventListener('submit',event=>{const form=event.target;if(!form.dataset.form)return;event.preventDefault();const data=new FormData(form),type=form.dataset.form;
 if(type==='report'){if(!reportTarget||!data.get('reason'))return;S.reports.push({...reportTarget,reason:String(data.get('reason')),details:String(data.get('details')||'').trim(),date:new Date().toISOString()});if(data.has('block')&&!S.blocked.includes(reportTarget.id))S.blocked.push(reportTarget.id);if(!persist()){S.reports.pop();return}reportTarget=null;go('safety');return}
 if(type==='auth'){const signup=form.dataset.signup==='true',password=String(data.get('password')||'');if(password.length<8){form.querySelector('.form-error').textContent=tr('Use at least eight characters for this sample password.');return}if(signup&&password!==data.get('confirm')){form.querySelector('.form-error').textContent=tr('The passwords do not match.');return}signIn(signup?String(data.get('name')):String(data.get('email')).split('@')[0]);form.reset();}
 if(type==='reset')go('reset-sent');
 if(type==='team-create'){teamSize=Number(data.get('size'));if(teamSize<2||teamSize>find(selectedId).stars)return;teamNames=['You','Maya','Leo','Willow','Kai'];S.teamName=String(data.get('name')).trim();go('lobby')}
 if(type==='comment'){const g=S.game;if(g.finished||g.comments[actor])return;g.comments[actor]=String(data.get('comment')).trim();if(!g.comments[actor])return;persist();go('clues')}
 if(type==='guess'){const g=S.game;if(g.mode!=='blind'&&g.players.some((_,i)=>!g.comments[i])){form.querySelector('.form-error').textContent=tr('Each player must write one personal comment before a formal answer.');return}if(g.mode!=='blind'&&g.players.length>1&&S.location!=='inside'){form.querySelector('.form-error').textContent=tr('Recheck gallery access before a team submission.');return}submitGuess(String(data.get('answer')).trim())}
 if(type==='game-message'){const g=S.game;if(g.left||g.removed?.includes(actor)){toast('This member cannot post to this conversation.');return}if(g.mode!=='blind'&&g.players.length>1&&S.location!=='inside'){toast('Recheck gallery access before posting to the on-site team.');return;}const text=String(data.get('message')).trim();if(!text)return;g.messages.push({name:g.mode==='blind'?(g.role==='describer'?'You · Describer':'You · Guesser'):g.players[actor],text,mine:true});persist();render()}
 if(type==='gallery-message'){if(S.blocked.includes(chatTarget)){toast('Unblock this visitor before messaging.');return}if(S.location!=='inside'){toast('Gallery access has expired. This conversation is read-only.');return}const text=String(data.get('message')).trim();if(!text)return;S.messages.push({room:chatTarget,name:S.user.name,text,mine:true});persist();render()}
 if(type==='chat-team'){if(S.location!=='inside'||S.blocked.includes(String(data.get('visitor')))||!visitors.some(v=>v.id===data.get('visitor')))return;selectedId=String(data.get('art'));const a=find(selectedId),who=visitors.find(v=>v.id===data.get('visitor'));teamSize=2;teamNames=['You',who?.name||'Willow'];S.teamName='Shared Perspectives';S.messages.push({room:chatTarget,name:S.user.name,text:`Local team invite: “${a.comment}”. Meet in Area ${data.get('area')}.`,invite:{challengeId:a.id,comment:a.comment,area:String(data.get('area'))},mine:true});persist();go('lobby')}
 if(type==='checkin'){const input=norm(data.get('code')),a=works().find(a=>norm(a.id)===input);if(!a){toast('Use a label from BE-001 to BE-012, or an ID from a locally published work.');return}S.lastCheckin=a.id;persist();toast(`Checked in at ${a.id}. No attempt used.`);render()}
 if(type==='creator-info'){if(!saveCreatorInfo(form))return;creatorStep=3;draft().step=3;persist();go('creator')}
 if(type==='creator-comment'){draft().comment=String(data.get('comment')).trim();creatorStep=6;creatorClue=0;draft().step=6;persist();go('creator')}
 if(type==='creator-clue'){const q=5-draftStars()+creatorClue;draft().clues[q]=String(data.get('clue')).trim();creatorClue++;persist();go('creator')}
});
document.addEventListener('change',async event=>{if(event.target.id==='actor-select'){actor=Number(event.target.value);render()}if(event.target.id==='artwork-file'){const file=event.target.files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){toast('Choose a JPG, PNG or WebP image smaller than 10 MB.');return}try{const image=new Image(),uri=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=uri});const scale=Math.min(1,5000/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);draft().artworkId=null;draft().artId='';draft().title='';draft().artist='';draft().imageBounds=null;draft().image=canvas.toDataURL('image/jpeg',.94);draft().imageWidth=canvas.width;draft().imageHeight=canvas.height;draft().crop=null;persist();render()}catch{toast('This image could not be opened. Try another file.')}}});
document.addEventListener('error',event=>{if(event.target.matches?.('[data-art-image]')){const figure=event.target.closest('figure');const caption=figure?.querySelector('figcaption');if(caption)caption.hidden=false;}},true);
document.addEventListener('input',event=>{if(route!=='creator')return;const input=event.target,d=draft();if(creatorStep===2&&['title','artist','artId','date'].includes(input.name))d[input.name]=input.value;if(creatorStep===5&&input.name==='comment')d.comment=input.value;if(creatorStep===6&&input.name==='clue')d.clues[5-draftStars()+creatorClue]=input.value;});
