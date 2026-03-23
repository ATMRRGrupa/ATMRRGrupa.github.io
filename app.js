const player = document.getElementById('player');
const episodes = document.getElementById('episodes');
const overlay = document.getElementById('player-overlay');
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
});