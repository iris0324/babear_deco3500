/* Blind Eyes transport. Borrow Eyes continues to use its existing local state. */
const BlindOnline = (() => {
  const client = window.supabase?.createClient(
    'https://qeywblnvvzqatvnyrkaf.supabase.co',
    'sb_publishable_W7AZY14xuEvUwRgfChGBdQ_xXaEFDSV',
    {auth:{storage:sessionStorage,storageKey:'blindEyes.auth.v1',persistSession:true,detectSessionInUrl:false}}
  );
  const MATCH_KEY='blindEyes.match.v1';
  let topics=[], channel=null, timer=null, matching=false, refreshing=false, generation=0;
  let busy=false, userId=null, lastView='', syncChain=Promise.resolve();
  const rpc=async(name,args={})=>{
    if(!client)throw new Error('Supabase could not load. Check your connection and reload.');
    const {data,error}=await client.rpc(name,args);if(error)throw error;return data;
  };
  const fail=e=>{console.error('Blind Eyes:',e);toast(e.message||'Connection failed. Please try again.');};
  async function auth(){
    if(!client)throw new Error('Supabase could not load. Check your connection and reload.');
    let {data,error}=await client.auth.getSession();if(error)throw error;
    if(!data.session){({data,error}=await client.auth.signInAnonymously());if(error)throw error;}
    userId=data.session.user.id;return userId;
  }
  async function guest(){
    if(busy)return;busy=true;
    try{await leave();signIn();}catch(e){fail(e);}finally{busy=false;}
  }
  async function loadTopics(){await auth();topics=await rpc('be_topics');}
  function stop(){generation++;matching=false;clearInterval(timer);timer=null;lastView='';if(channel){client.removeChannel(channel);channel=null;}}
  async function leave(){
    stop();sessionStorage.removeItem(MATCH_KEY);await auth();await rpc('be_leave');
    if(S.game?.mode==='blind'){S.game=null;persist();}
  }
  async function exit(next='home'){
    if(busy)return;busy=true;
    try{await leave();go(next);}catch(e){fail(e);}finally{busy=false;}
  }
  async function chooseRole(value){
    if(busy)return;busy=true;
    try{await loadTopics();role=value;go('blind-tags');}catch(e){fail(e);}finally{busy=false;}
  }
  function topic(){return topics.find(t=>t.id===blindTag);}
  function record(g,a){
    if(!g.finished||S.history.some(h=>h.id===g.id))return;
    const rewarded=S.history.some(h=>h.challengeId===a.id&&h.reward>0);
    S.history.push({id:g.id,artId:a.artworkId,challengeId:a.id,detailTitle:a.comment,mode:'blind',success:g.success,
      attempts:g.attempts,reward:g.success&&!rewarded?a.stars:0,date:new Date().toISOString()});
  }
  function renderWithDraft(){
    const drafts=[...document.querySelectorAll('[name="message"],[name="answer"]')].map(el=>({name:el.name,value:el.value,focused:el===document.activeElement}));
    render();
    for(const d of drafts){const el=document.querySelector(`[name="${d.name}"]`);if(el){el.value=d.value;if(d.focused)el.focus({preventScroll:true});}}
  }
  function sync(roomId,epoch=generation,restoring=false){
    const run=async()=>{
      if(epoch!==generation)return;
      const state=await rpc('be_snapshot',{p_room:roomId});
      if(epoch!==generation)return;
      if(state.closed||state.status==='closed'){
        stop();if(S.game?.online&&S.game.id===roomId){S.game=null;persist();go('home');toast('Your partner left or the room expired. Please find a new partner.');}return;
      }
      if(restoring&&state.status==='finished'){await leave();go('home');return;}
      const {data:rows,error}=await client.from('be_messages').select('id,sender_id,body,created_at')
        .eq('room_id',roomId).order('id',{ascending:false}).limit(500);if(error)throw error;
      if(epoch!==generation)return;
      const previous=S.game?.online&&S.game.id===roomId?S.game:null;
      const g={id:state.id,mode:'blind',online:true,topicId:state.topic_id,role:state.role,
        attempts:state.attempts,attemptLimit:state.art.stars+1,finished:state.status==='finished',success:state.success,
        lastAnswer:state.last_answer,cluesUnlocked:Math.min(state.art.stars,state.attempts),
        players:['You','Anonymous Partner'],removed:[],comments:{},shared:[],art:state.art,
        messages:rows.reverse().map(m=>({name:m.sender_id===userId?'You':'Anonymous Partner',senderId:m.sender_id,text:m.body,
          mine:m.sender_id===userId,time:new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})})),
        friendRequested:previous?.friendRequested||false};
      blindTag=state.topic_id;role=state.role;actor=0;S.game=g;record(g,state.art);persist();
      const signature=JSON.stringify(g);
      if(signature!==lastView){lastView=signature;
        if(g.finished&&!previous?.finished&&route!=='blind-summary')go('result');
        else if(['blind-match','blind-chat','guess','wrong','clues','result','blind-summary'].includes(route))renderWithDraft();
      }
    };
    syncChain=syncChain.catch(()=>{}).then(run);return syncChain;
  }
  async function attach(roomId,restoring=false){
    stop();const epoch=generation;
    await sync(roomId,epoch,restoring);if(epoch!==generation||!S.game?.online)return;
    channel=client.channel('blind:'+roomId)
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'be_rooms',filter:'id=eq.'+roomId},()=>sync(roomId,epoch).catch(fail))
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'be_messages',filter:'room_id=eq.'+roomId},()=>sync(roomId,epoch).catch(fail))
      .subscribe(status=>{if(status==='SUBSCRIBED')sync(roomId,epoch).catch(fail);});
    // Reconciliation also catches changes missed during sleep/reconnect. The
    // snapshot heartbeat keeps the queue/room alive without unload mutations.
    timer=setInterval(()=>{if(document.visibilityState==='visible')sync(roomId,epoch).catch(fail);},15000);
    sessionStorage.removeItem(MATCH_KEY);
    go(restoring?'blind-chat':'blind-match');
  }
  async function tickMatch(epoch,restoring=false){
    if(!matching||epoch!==generation||refreshing)return;
    refreshing=true;
    try{
      const state=await rpc('be_match',{p_topic:blindTag,p_role:role});
      if(!matching||epoch!==generation)return;
      if(state.room_id){matching=false;clearInterval(timer);timer=null;refreshing=false;await attach(state.room_id,restoring);}
    }finally{refreshing=false;}
  }
  async function match(id){
    if(busy)return;busy=true;
    try{
      if(active()&&!mayReplaceGame())return;
      await leave();S.game=null;persist();blindTag=id;matching=true;sessionStorage.setItem(MATCH_KEY,JSON.stringify({topic:id,role}));go('blind-match');
      const epoch=generation;
      await tickMatch(epoch);
      if(matching&&epoch===generation)timer=setInterval(()=>tickMatch(epoch).catch(fail),2500);
    }catch(e){matching=false;fail(e);go('blind-tags');}finally{busy=false;}
  }
  async function send(text,form){
    if(!text.trim()||form.dataset.sending)return;
    form.dataset.sending='true';const room=S.game.id;
    const input=form.querySelector('[name="message"]');
    if(form.dataset.requestText!==text){delete form.dataset.request;form.dataset.requestText=text;}
    const request=form.dataset.request||(form.dataset.request=crypto.randomUUID());
    try{await rpc('be_send',{p_room:room,p_body:text,p_request:request});delete form.dataset.request;
      if(input)input.value='';const current=document.querySelector('[name="message"]');if(current?.value===text)current.value='';await sync(room);
    }catch(e){fail(e);}finally{delete form.dataset.sending;}
  }
  async function guessAnswer(answer,form){
    if(busy)return;busy=true;
    const room=S.game.id;
    if(form.dataset.requestText!==answer){delete form.dataset.request;form.dataset.requestText=answer;}
    const request=form.dataset.request||(form.dataset.request=crypto.randomUUID());
    try{await rpc('be_guess',{p_room:room,p_answer:answer,p_request:request});delete form.dataset.request;
      await sync(room);if(S.game?.id===room)go(S.game.finished?'result':'wrong');
    }catch(e){fail(e);}finally{busy=false;}
  }
  async function restore(){
    if(!S.game){
      let pending=null;try{pending=JSON.parse(sessionStorage.getItem(MATCH_KEY)||'null');}catch{}
      try{
        await loadTopics();
        if(pending&&topics.some(t=>t.id===pending.topic)){
          blindTag=pending.topic;role=pending.role;matching=true;go('blind-match');
          const epoch=generation;await tickMatch(epoch,true);
          if(matching&&epoch===generation)timer=setInterval(()=>tickMatch(epoch,true).catch(fail),2500);
        }else go('blind-tags');
      }catch(e){go('home');fail(e);}
      return;
    }
    if(S.game.mode!=='blind')return;
    if(!S.game.online){S.game=null;persist();go('home');return;}
    const room=S.game.id;
    try{await auth();await loadTopics();await attach(room,true);}
    catch(e){S.game=null;persist();go('home');fail(e);}
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState!=='visible')return;
    if(S.game?.online)sync(S.game.id).catch(fail);
    else if(matching)tickMatch(generation).catch(fail);
  });
  return {guest,chooseRole,match,exit,leave,send,guessAnswer,restore,topic,get topics(){return topics;},get matching(){return matching;}};
})();
