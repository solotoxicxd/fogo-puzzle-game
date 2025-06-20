const board = new Board(3); // Initializes and shuffles

document.getElementById("shuffle-btn").addEventListener("click", () => {
  board.shuffle();
});

document.getElementById("solve-btn").addEventListener("click", () => {
  const solver = new Solver(board);
  solver.solveAI();
});
