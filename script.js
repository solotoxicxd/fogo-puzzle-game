// === Default Settings ===
const DEFAULT_SIZE = 3;
let DEFAULT_BOARD_SIZE = 500;

const IMAGES = [
  "assets/images/fogo1.png",
  "assets/images/fogo2.png",
  "assets/images/fogo3.png",
  "assets/images/fogo4.png",
  "assets/images/fogo5.png"
];

// === Audio Effects ===
const clickSound = new Audio("assets/audio/click.mp3");
const slideSound = new Audio("assets/audio/slide.mp3");

// === Globals ===
let isSolving = false;
let run = [];
let selectedImage = getRandomImage();
let board = new Board(DEFAULT_SIZE, selectedImage);

// === Utility Functions ===
function getRandomImage() {
  return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playSlide() {
  slideSound.currentTime = 0;
  slideSound.play();
}

function clearAllAnimation() {
  run.forEach((t) => clearTimeout(t));
  isSolving = false;
}

function checkNumberToggle() {
  const visible = $("#checkbox").is(":checked");
  $(".number").css("visibility", visible ? "visible" : "hidden");
}

// === Result Popup ===
function showResultPopup(moves, size) {
  let rank;

  if (moves <= size * 2) rank = "🔥 Blazing Fast";
  else if (moves <= size * 4) rank = "💨 Smooth Solver";
  else if (moves <= size * 6) rank = "♨️ Warm Ember";
  else rank = "❄️ Cold Ash";

  $("#finalMoves").text(moves);
  $("#rankLabel").text(rank);
  $("#completionModal").fadeIn();

  $("#shareBtn").off("click").on("click", () => {
    const message = `I just solved a ${size}x${size} Fogo Puzzle in ${moves} moves! Rank: ${rank} 🔥 Try it: https://your-site-url.com — by @bytrizz404`;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(intent, "_blank");
  });

  $("#playAgainBtn").off("click").on("click", () => {
    $("#completionModal").fadeOut();
    $(".move span").text(0);
    updateBoard();
  });
}

// === Update Board ===
function updateBoard() {
  $(".board").empty();
  const size = $("#size").val();
  selectedImage = getRandomImage();
  board = new Board(size, selectedImage);
  checkNumberToggle();
}

// === Event Listeners ===
$("#checkbox").on("click", () => {
  playClick();
  checkNumberToggle();
});

$("#shuffle-btn").on("click", () => {
  playClick();
  $(".move span").text(0);
  clearAllAnimation();
  board.start();
});

$("#solve-btn").on("click", () => {
  playClick();

  if (board.state.length < 1 || isSolving || board.size > 3) return;

  const solver = new Solver(board);
  const path = solver.solveAStar();
  const states = path?.path_states;

  if (!states) return;

  isSolving = true;

  states.forEach((state, index) => {
    run.push(setTimeout(() => {
      board.state = state;
      board.placeTiles();
      if (index !== 0) playSlide();
      if (index === states.length - 1) isSolving = false;
    }, 300 * index));
  });
});

// === Window Events ===
window.addEventListener("resize", () => {
  DEFAULT_BOARD_SIZE = window.innerWidth < 550 ? window.innerWidth - 50 : 500;
  $(".board").css({ width: `${DEFAULT_BOARD_SIZE}px`, height: `${DEFAULT_BOARD_SIZE}px` });
  updateBoard();
});

window.addEventListener("load", () => {
  DEFAULT_BOARD_SIZE = window.innerWidth < 550 ? window.innerWidth - 50 : 500;
  $(".board").css({ width: `${DEFAULT_BOARD_SIZE}px`, height: `${DEFAULT_BOARD_SIZE}px` });
  updateBoard();
});
