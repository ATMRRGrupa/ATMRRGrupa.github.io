import Hls from "hls.js";

const STREAM_URL = "https://verde-excluding-suppose-nathan.trycloudflare.com/ATMRR/index.m3u8";

const video = document.getElementById("video");
const playBtn = document.getElementById("playBtn");
const overlay = document.getElementById("overlay");
const muteBtn = document.getElementById("muteBtn");
const qualityBtn = document.getElementById("qualityBtn");

// Setup HLS
function initHls(url){
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // native support (Safari, iOS)
    video.src = url;
  } else if (Hls.isSupported()) {
    const hls = new Hls({
      maxBufferLength: 30,
      backBufferLength: 15,
      enableWorker: true
    });
    hls.loadSource(url);
    hls.attachMedia(video);
    // update quality button when levels available
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const levels = hls.levels || [];
      if (levels.length > 1) {
        qualityBtn.textContent = "AUTO";
        qualityBtn.dataset.mode = "auto";
        qualityBtn.onclick = () => {
          if (qualityBtn.dataset.mode === "auto") {
            qualityBtn.dataset.mode = "manual";
            qualityBtn.textContent = `Q ${hls.levels.length}`;
            // set to highest by default manual
            hls.currentLevel = levels.length - 1;
          } else {
            qualityBtn.dataset.mode = "auto";
            qualityBtn.textContent = "AUTO";
            hls.currentLevel = -1;
          }
        };
      } else {
        qualityBtn.style.display = "none";
      }
    });
    // show overlay play button when paused
    video.addEventListener("pause", ()=> overlay.style.display = "");
    video.addEventListener("play", ()=> overlay.style.display = "none");
  } else {
    // fallback: show link
    overlay.style.display = "none";
    const note = document.createElement("div");
    note.style.padding = "12px";
    note.style.color = "#f55";
    note.textContent = "Twoja przeglądarka nie obsługuje HLS. Otwórz bezpośredni link.";
    document.querySelector(".video-container").appendChild(note);
  }
}

initHls(STREAM_URL);

// Play/pause controls
playBtn.addEventListener("click", async () => {
  try{
    if (video.paused) {
      await video.play();
      playBtn.textContent = "❚❚";
    } else {
      video.pause();
      playBtn.textContent = "▶";
    }
  }catch(e){
    console.warn("Play error", e);
  }
});

// overlay tap to play/pause
video.addEventListener("click", async () => {
  if (video.paused) {
    await video.play();
    playBtn.textContent = "❚❚";
  } else {
    video.pause();
    playBtn.textContent = "▶";
  }
});

// mute toggle
muteBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  muteBtn.textContent = video.muted ? "🔇" : "🔊";
});

// initial overlay state
overlay.style.display = "";
playBtn.textContent = "▶";

 // Accessibility: ensure controls are touch-sized
[playBtn, muteBtn, qualityBtn].forEach(el=>{
  el.style.touchAction = "manipulation";
});
