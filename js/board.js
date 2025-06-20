class Board {
  constructor(size = 3) {
    this.size = size;
    this.img = `assets/images/fogo${Math.floor(Math.random() * 5) + 1}.png`;
    this.tiles_size = 500 / size;
    this.state = [];
    this.goal_state = [];
    this.moves = 0;
    this.solved = false;
    this.createBoard();
    setTimeout(() => this.shuffle(), 500);
  }

  createBoard() {
    const board = $(".board").empty();
    let number = 1;
    for (let row = 0; row < this.size; row++) {
      let row_goal = [];
      for (let col = 0; col < this.size; col++) {
        if (row === this.size - 1 && col === this.size - 1) number = 0;
        row_goal.push(number);
        board.append(this.createTile(number++, row, col));
      }
      this.goal_state.push(row_goal);
    }
    this.state = JSON.parse(JSON.stringify(this.goal_state));
  }

  createTile(number, row, col) {
    return $("<div/>", {
      class: "tile",
      id: number,
      html: number ? number : "",
      css: {
        width: `${this.tiles_size}px`,
        height: `${this.tiles_size}px`,
        position: "absolute",
        left: `${col * this.tiles_size}px`,
        top: `${row * this.tiles_size}px`,
        background: number !== 0 ? `url("${this.img}") -${col * this.tiles_size}px -${row * this.tiles_size}px / 500px 500px no-repeat` : "",
        opacity: number === 0 ? "0" : "1"
      },
      click: () => this.moveTile(number)
    });
  }

  moveTile(number) {
    const [r1, c1] = this.findTile(number);
    const [r0, c0] = this.findTile(0);
    if ((Math.abs(r1 - r0) + Math.abs(c1 - c0)) === 1) {
      this.state[r0][c0] = number;
      this.state[r1][c1] = 0;
      this.moves++;
      $(".move-counter span").text(this.moves);
      this.updateBoard();
      if (this.checkWin()) this.showResultPopup();
    }
  }

  findTile(num) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === num) return [r, c];
      }
    }
  }

  updateBoard() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const id = this.state[r][c];
        $(`#${id}`).css({
          top: `${r * this.tiles_size}px`,
          left: `${c * this.tiles_size}px`
        });
      }
    }
  }

  shuffle() {
    const flat = this.goal_state.flat();
    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flat[i], flat[j]] = [flat[j], flat[i]];
    }
    this.state = [];
    for (let i = 0; i < flat.length; i += this.size) {
      this.state.push(flat.slice(i, i + this.size));
    }
    this.moves = 0;
    $(".move-counter span").text("0");
    this.updateBoard();
    this.solved = false;
  }

  checkWin() {
    return this.state.flat().join() === this.goal_state.flat().join();
  }

  showResultPopup() {
    this.solved = true;
    const moves = this.moves;
    let roast = "";
    let title = "";

    if (moves <= 20) {
      roast = "You're built different.";
      title = "🔥 Flame God";
    } else if (moves <= 35) {
      roast = "Efficient and clean.";
      title = "🔥 Ember Expert";
    } else if (moves <= 50) {
      roast = "Took your time, but made it.";
      title = "🔥 Warm Ash";
    } else {
      roast = "How did you even make it?";
      title = "🔥 Lost in the Smoke";
    }

    const msg = `I solved the Fogo Puzzle in ${moves} moves and earned the title: "${title}". ${roast}`;

    const shareIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent("https://fogopuzzle.vercel.app")}&via=bytrizz404`;

    $("body").append(`
      <div class="popup-overlay">
        <div class="popup">
          <h2>Congratulations!</h2>
          <p>You completed the puzzle in <strong>${moves} moves</strong>.</p>
          <p>${roast}</p>
          <p><em>Title Earned:</em> <strong>${title}</strong></p>
          <a href="${shareIntent}" class="share-btn" target="_blank">Share on X</a>
          <button class="close-btn" onclick="location.reload()">Play Again</button>
        </div>
      </div>
    `);
  }
}
