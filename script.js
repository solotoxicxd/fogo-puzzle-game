const DEFAULT_SIZE = 3;
const DEFAULT_IMAGES = [
  "assets/images/fogo1.png",
  "assets/images/fogo2.png",
  "assets/images/fogo3.png",
  "assets/images/fogo4.png",
  "assets/images/fogo5.png"
];
const DEFAULT_AUDIO = {
  click: new Audio("assets/audio/click.mp3"),
  slide: new Audio("assets/audio/slide.mp3")
};

let board, url = getRandomImage(), size_el = $("#size"), checkbox_el = $("#checkbox");
let DEFAULT_BOARD_SIZE = window.innerWidth > 550 ? 500 : window.innerWidth - 50;

// 🧠 Init on load
$(document).ready(() => {
  initBoard();
});

// 🎲 Random image
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
  return DEFAULT_IMAGES[randomIndex];
}

// 🔊 Play sound
function playSound(type) {
  const sound = DEFAULT_AUDIO[type];
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// 🧩 Init board
function initBoard() {
  board = new Board(DEFAULT_SIZE, url);
  board.start();
  bindEvents();
}

// 🔄 Update board
function updateBoard() {
  $(".board").empty();
  url = getRandomImage();
  let size = parseInt(size_el.val());
  board = new Board(size, url);
  check();
}

// ☑️ Number toggle
checkbox_el.on("change", check);
function check() {
  const show = checkbox_el.is(":checked");
  $(".number").css("visibility", show ? "visible" : "hidden");
}

// 🔘 Shuffle
$("#shuffle-btn").click(() => {
  $(".move span").text(0);
  playSound("click");
  board.start();
});

// 🧠 Solve (up to 3x3)
$("#solve-btn").click(() => {
  if (board.size > 3) return;
  playSound("click");
  const solver = new Solver(board);
  const path = solver.solveAStar();
  if (!path) return;

  let run = [], step = 0;
  function animate() {
    if (step >= path.path_states.length) return;
    board.state = path.path_states[step];
    board.placeTiles();
    playSound("slide");
    step++;
    run.push(setTimeout(animate, 400));
  }
  animate();
});

// 🪟 Resize responsive
$(window).on("resize", () => {
  DEFAULT_BOARD_SIZE = window.innerWidth > 550 ? 500 : window.innerWidth - 50;
  $(".board").css({
    width: `${DEFAULT_BOARD_SIZE}px`,
    height: `${DEFAULT_BOARD_SIZE}px`
  });
  updateBoard();
});
