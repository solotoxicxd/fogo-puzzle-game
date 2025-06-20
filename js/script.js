
let soundEnabled = true;
let lastPlayTime = 0;
const slideSound = new Audio("assets/audio/slide.mp3");
slideSound.volume = 0.6;

function playSound(sound, debounce = 200) {
  if (!soundEnabled) return;
  const now = Date.now();
  if (now - lastPlayTime < debounce) return;
  lastPlayTime = now;
  sound.currentTime = 0;
  sound.play();
}

document.getElementById("sound-toggle").addEventListener("change", (e) => {
  soundEnabled = e.target.checked;
  localStorage.setItem("fogoSound", soundEnabled);
});

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("fogoSound");
  if (saved === "false") {
    document.getElementById("sound-toggle").checked = false;
    soundEnabled = false;
  }
});

let board;
document.getElementById("start-btn").addEventListener("click", () => {
  board = new Board(3);
});

document.getElementById("shuffle-btn").addEventListener("click", () => {
  playSound(slideSound);
  board.start();
});

document.getElementById("solve-btn").addEventListener("click", () => {
  playSound(slideSound);
  // Implement Solver logic here if needed
});
