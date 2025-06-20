const board = new Board(3);

document.getElementById("shuffle-btn").addEventListener("click", () => {
  board.start();
});

document.getElementById("solve-btn").addEventListener("click", () => {
  const solver = new Solver(board);
  solver.solveAI();
});
