let board;

$(document).ready(function () {
  board = new Board(3);

  $("#shuffle-btn").click(() => {
    board.shuffle();
  });

  $("#solve-btn").click(() => {
    board.solve();
  });
});
