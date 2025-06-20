// Initialize the puzzle board with default 3x3 size
const board = new Board(3);

// Shuffle button handler
const shuffleButton = document.getElementById("shuffle-btn");
if (shuffleButton) {
  shuffleButton.addEventListener("click", () => {
    board.shuffle();
  });
}

// Solve button handler
const solveButton = document.getElementById("solve-btn");
if (solveButton) {
  solveButton.addEventListener("click", () => {
    try {
      const solver = new Solver(board);
      solver.solveAI();
    } catch (error) {
      console.error("Solve failed:", error);
    }
  });
}
