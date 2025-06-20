const DEFAULT_IMAGES = [
  "assets/images/fogo1.png",
  "assets/images/fogo2.png",
  "assets/images/fogo3.png",
  "assets/images/fogo4.png",
  "assets/images/fogo5.png"
];
let DEFAULT_IMAGE = DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
let DEFAULT_SIZE = 3;
let DEFAULT_BOARD_SIZE = 500;

const CLICK_SOUND = document.getElementById("click-sound");
const SLIDE_SOUND = document.getElementById("slide-sound");

let board;
let size_el = document.getElementById("size");
let checkbox_el = document.getElementById("checkbox");

function check() {
  if (checkbox_el.checked) {
    document.querySelectorAll(".number").forEach(el => el.style.visibility = "visible");
  } else {
    document.querySelectorAll(".number").forEach(el => el.style.visibility = "hidden");
  }
}

function updateBoard() {
  document.querySelector(".board").innerHTML = "";
  DEFAULT_IMAGE = DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
  const size = parseInt(size_el.value);
  board = new Board(size, DEFAULT_IMAGE);
  check();
  document.getElementById("solve-btn").disabled = size > 3;
}

function clearAllAnimation() {
  run?.forEach(el => clearTimeout(el));
  isSolving = false;
}

document.getElementById("shuffle-btn").addEventListener("click", () => {
  CLICK_SOUND.currentTime = 0;
  CLICK_SOUND.play();
  document.querySelector(".move span").textContent = "0";
  clearAllAnimation();
  if (isSolving) return;
  board.start();
});

document.getElementById("solve-btn").addEventListener("click", () => {
  CLICK_SOUND.currentTime = 0;
  CLICK_SOUND.play();
  if (board.state.length < 1 || isSolving || board.size > 3) return;
  const init = new Solver(board);
  let path = init.solveAStar();

  async function move() {
    return new Promise(resolve => {
      path.path_states.forEach((state, index) => {
        run.push(setTimeout(() => {
          board.state = state;
          board.placeTiles();
        }, 400 * index));
      });
      setTimeout(() => resolve("done"), path.path_states.length * 400);
    });
  }

  async function execute() {
    isSolving = true;
    await move();
    isSolving = false;
  }
  execute();
});

size_el.addEventListener("change", updateBoard);
checkbox_el.addEventListener("change", check);

window.addEventListener("resize", updateBoardSize);
window.addEventListener("load", () => {
  updateBoardSize();
  updateBoard();
});

function updateBoardSize() {
  if (window.innerWidth > 550) {
    DEFAULT_BOARD_SIZE = 500;
  } else {
    DEFAULT_BOARD_SIZE = window.innerWidth - 50;
  }
  const boardEl = document.querySelector(".board");
  boardEl.style.height = `${DEFAULT_BOARD_SIZE}px`;
  boardEl.style.width = `${DEFAULT_BOARD_SIZE}px`;
}
