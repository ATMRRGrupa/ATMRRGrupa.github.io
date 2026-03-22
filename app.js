const player = document.getElementById('player');
const episodes = document.getElementById('episodes');
const overlay = document.getElementById('player-overlay');
const playBtn = document.getElementById('play-episode');
const fullscreenBtn = document.getElementById('fullscreen');
const description = document.getElementById('description');

let current = player.src || 'player.html';

// Episode click handler
episodes.addEventListener('click', (e)=>{
  const li = e.target.closest('li[data-src]');
  if(!li) return;
  const src = li.dataset.src;
  // Update iframe src
  player.src = src;
  current = src;
  // Update description (simple demo text)
  const title = e.target.innerText || 'EPG';
  description.textContent = title + ' — krótki opis odcinka pojawi się tutaj.';
  // show a quick highlight
  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'none';
  setTimeout(()=>{ overlay.style.opacity = ''; }, 400);
});

// Play button (simply focuses iframe so its own play controls can be used)
playBtn.addEventListener('click', ()=>{
  // try to postMessage a play command (player.html can implement it)
  try{ player.contentWindow.postMessage({type:'play'}, '*'); }catch{}
  // focus iframe
  player.focus();
});

// Fullscreen toggle
fullscreenBtn.addEventListener('click', async ()=>{
  const el = player;
  if(!document.fullscreenElement){
    if(el.requestFullscreen) await el.requestFullscreen();
    else if(el.webkitEnterFullscreen) el.webkitEnterFullscreen();
  } else {
    if(document.exitFullscreen) await document.exitFullscreen();
  }
});



// Allow player.html to notify parent to hide overlay when it starts
window.addEventListener('message', (ev)=>{
  if(ev?.data?.type === 'playing'){
    overlay.style.display = 'none';
  }
  if(ev?.data?.type === 'paused'){
    overlay.style.display = '';
  }
});

// Small accessibility: keyboard shortcuts
window.addEventListener('keydown', (e)=>{
  if(e.key === 'f') fullscreenBtn.click();
  if(e.key === ' '){ e.preventDefault(); playBtn.click(); }
});