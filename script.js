// Default settings
const DEFAULT_SIZE = 3;
let DEFAULT_BOARD_SIZE = 500;

// Available puzzle images
const IMAGES = [
  "assets/images/fogo1.png",
  "assets/images/fogo2.png",
  "assets/images/fogo3.png",
  "assets/images/fogo4.png",
  "assets/images/fogo5.png"
];

// Sound effects
const clickSound = new Audio("assets/audio/click.mp3");
const slideSound = new Audio("assets/audio/slide.mp3");

// Select random image for initial board
let selectedImage = getRandomImage();
let board = new Board(DEFAULT_SIZE, selectedImage);

// Get a random puzzle image
function getRandomImage() {
  const index = Math.floor(Math.random() * IMAGES.length);
  return IMAGES[index];
}

// Play button click sound
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

// Play tile slide sound
function playSlide() {
  slideSound.currentTime = 0;
  slideSound.play();
}

// Update and reset board
function updateBoard() {
  $(".board").empty();

  const size = $("#size").val();
  selectedImage = getRandomImage();
  board = new Board(size, selectedImage);

  checkNumberToggle();
}

// Show or hide tile numbers
function checkNumberToggle() {
  const visible = $("#checkbox").is(":checked");
  $(".number").css("visibility", visible ? "visible" : "hidden");
}

// Clear ongoing animation and AI solving
function clearAllAnimation() {
  run?.forEach((el) => clearTimeout(el));
  isSolving = false;
}

// Toggle number visibility
$("#checkbox").on("click", () => {
  playClick();
  checkNumberToggle();
});

// Shuffle button logic
$("#shuffle-btn").on("click", () => {
  playClick();
  $(".move span").text(0);
  clearAllAnimation();
  board.start();
});

// Solve button logic
$("#solve-btn").on("click", () => {
  playClick();

  if (board.state.length < 1 || isSolving || board.size > 3) return;

  const solver = new Solver(board);
  const path = solver.solveAStar();
  const states = path.path_states;

  isSolving = true;

  states.forEach((state, index) => {
    setTimeout(() => {
      board.state = state;
      board.placeTiles();

      if (index !== 0) playSlide();
      if (index === states.length - 1) isSolving = false;
    }, 300 * index);
  });
});

// Resize listener for responsive board size
window.addEventListener("resize", () => {
  DEFAULT_BOARD_SIZE = window.innerWidth < 550 ? window.innerWidth - 50 : 500;

  $(".board").css({
    width: DEFAULT_BOARD_SIZE + "px",
    height: DEFAULT_BOARD_SIZE + "px"
  });

  updateBoard();
});

// Initialize board on load
window.addEventListener("load", updateBoard);
