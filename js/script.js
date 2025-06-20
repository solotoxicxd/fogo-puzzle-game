let soundEnabled = true;
let lastPlayTime = 0;

// 🔊 Load audio files
const slideSound = new Audio("assets/audio/slide.mp3");
const clickSound = new Audio("assets/audio/click.mp3");
slideSound.volume = 0.6;
clickSound.volume = 0.6;

// 🔁 Debounced sound playback
function playSound(sound, debounce = 200) {
  if (!soundEnabled) return;
  const now = Date.now();
  if (now - lastPlayTime < debounce) return;
  lastPlayTime = now;
  sound.currentTime = 0;
  sound.play();
}

// 🔘 Sound toggle event
document.getElementById("sound-toggle").addEventListener("change", (e) => {
  soundEnabled = e.target.checked;
  localStorage.setItem("fogoSound", soundEnabled);
});

// 🧠 Restore previous sound setting from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("fogoSound");
  if (saved === "false") {
    document.getElementById("sound-toggle").checked = false;
    soundEnabled = false;
  }
});

// 🖼️ Random fogo image
const randomImage = `assets/images/fogo${Math.floor(Math.random() * 5) + 1}.png`;

// 🧩 Initialize puzzle board
const board = new Board(3, randomImage);

// 🎮 Controls
document.getElementById("shuffle-btn").addEventListener("click", () => {
  playSound(clickSound);
  board.start();
});

document.getElementById("solve-btn").addEventListener("click", () => {
  playSound(clickSound);
  const solver = new Solver(board);
  solver.solveAI();
});
