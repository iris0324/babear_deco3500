/* Borrowed Eyes | src/main.js | extracted from original app.js; classic scripts share global scope. */


if(tabSaved&&S.user){route=tabSaved.route||'home';if(route==='blind-match'||route==='blind-summary')route='blind-tags';}
// Fresh visits always start at Welcome, even when local preferences exist.
if(!tabSaved)route='welcome';
// Validate online membership before rendering a saved Blind Eyes game.
if(tabSaved&&(S.game?.mode==='blind'||(!S.game&&['blind-tags','blind-match','blind-summary'].includes(tabSaved.route)))){route='home';render();BlindOnline.restore();}
else render();
