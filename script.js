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

// Global state
let board;
let isSolving = false;
let selectedImage;
let run = [];

// Randomly select puzzle image
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
  const size = parseInt($("#size").val()) || DEFAULT_SIZE;
  selectedImage = getRandomImage();
  board = new Board(size, selectedImage);
  checkNumberToggle();
}

// Toggle number visibility
function checkNumberToggle() {
  const visible = $("#checkbox").is(":checked");
  $(".number").css("visibility", visible ? "visible" : "hidden");
}

// Clear animations and AI solving
function clearAllAnimation() {
  run?.forEach(clearTimeout);
  run = [];
  isSolving = false;
}

// Event: Toggle tile numbers
$("#checkbox").on("click", () => {
  playClick();
  checkNumberToggle();
});

// Event: Shuffle
$("#shuffle-btn").on("click", () => {
  playClick();
  $(".move span").text("0");
  clearAllAnimation();
  board.start();
});

// Event: Solve
$("#solve-btn").on("click", () => {
  playClick();

  if (!board?.state?.length || isSolving || board.size > 3) return;

  const solver = new Solver(board);
  const result = solver.solveAStar();

  if (!result?.path_states?.length) return;

  const states = result.path_states;
  isSolving = true;

  states.forEach((state, index) => {
    const delay = 300 * index;
    run.push(
      setTimeout(() => {
        board.state = state;
        board.placeTiles();
        if (index !== 0) playSlide();
        if (index === states.length - 1) {
          isSolving = false;
          $(".move span").text(states.length - 1);
        }
      }, delay)
    );
  });
});

// Resize board responsively
window.addEventListener("resize", () => {
  DEFAULT_BOARD_SIZE = window.innerWidth < 550 ? window.innerWidth - 50 : 500;
  $(".board").css({
    width: DEFAULT_BOARD_SIZE + "px",
    height: DEFAULT_BOARD_SIZE + "px"
  });
  updateBoard();
});

// Initialize on page load
window.addEventListener("load", () => {
  DEFAULT_BOARD_SIZE = window.innerWidth < 550 ? window.innerWidth - 50 : 500;
  $(".board").css({
    width: DEFAULT_BOARD_SIZE + "px",
    height: DEFAULT_BOARD_SIZE + "px"
  });
  updateBoard();
});
