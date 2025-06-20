const DEFAULT_SIZE = 3;
let DEFAULT_BOARD_SIZE = 500;
let IMAGES = [
  "assets/images/fogo1.png",
  "assets/images/fogo2.png",
  "assets/images/fogo3.png",
  "assets/images/fogo4.png",
  "assets/images/fogo5.png"
];

let clickSound = new Audio("assets/audio/click.mp3");
let slideSound = new Audio("assets/audio/slide.mp3");

let selectedImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
let board = new Board(DEFAULT_SIZE, selectedImage);

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playSlide() {
  slideSound.currentTime = 0;
  slideSound.play();
}

function updateBoard() {
  $(".board").empty();
  let size = $("#size").val();
  selectedImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  board = new Board(size, selectedImage);
  checkNumberToggle();
}

function checkNumberToggle() {
  if ($("#checkbox").is(":checked")) {
    $(".number").css("visibility", "visible");
  } else {
    $(".number").css("visibility", "hidden");
  }
}

function clearAllAnimation() {
  run?.forEach((el) => clearTimeout(el));
  isSolving = false;
}

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
  const init = new Solver(board);
  let path = init.solveAStar();
  let pathStates = path.path_states;
  isSolving = true;

  pathStates.forEach((state, i) => {
    setTimeout(() => {
      board.state = state;
      board.placeTiles();
      if (i !== 0) playSlide();
      if (i === pathStates.length - 1) isSolving = false;
    }, 300 * i);
  });
});

window.addEventListener("resize", () => {
  DEFAULT_BOARD_SIZE = window.innerWidth < 550 ? window.innerWidth - 50 : 500;
  $(".board").css({
    width: DEFAULT_BOARD_SIZE + "px",
    height: DEFAULT_BOARD_SIZE + "px"
  });
  updateBoard();
});

window.addEventListener("load", () => {
  updateBoard();
});
