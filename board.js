class Board {
  constructor(size, image) {
    this.size = size;
    this.image = image;
    this.boardSize = DEFAULT_BOARD_SIZE;
    this.tileSize = this.boardSize / this.size;
    this.state = [];
    this.goalState = [];
    this.moves = 0;
    this.solved = false;
    this.started = false;
    this.emptyRow = null;
    this.emptyCol = null;

    this.init();
  }

  init() {
    this.createGoalState();
    this.renderTiles();
    setTimeout(() => this.shuffle(), 500);
  }

  createGoalState() {
    const board = $(".board");
    let num = 1;

    for (let row = 0; row < this.size; row++) {
      const rowArr = [];
      for (let col = 0; col < this.size; col++) {
        if (row === this.size - 1 && col === this.size - 1) {
          rowArr.push(0); // Empty tile
        } else {
          rowArr.push(num++);
        }
      }
      this.goalState.push(rowArr);
    }
  }

  renderTiles() {
    const board = $(".board").empty();
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.goalState[row][col];
        const tile = this.createTile(value, row, col);
        board.append(tile);
      }
    }
    this.state = JSON.parse(JSON.stringify(this.goalState));
  }

  createTile(value, row, col) {
    return $("<div/>", {
      class: "tile",
      id: `tile-${value}`,
      html: value !== 0 ? `<p class="number">${value}</p>` : "",
      css: {
        width: `${this.tileSize}px`,
        height: `${this.tileSize}px`,
        top: `${row * this.tileSize}px`,
        left: `${col * this.tileSize}px`,
        position: "absolute",
        background: value !== 0 ? `url(${this.image})` : "",
        backgroundSize: `${this.boardSize}px ${this.boardSize}px`,
        backgroundPosition: `-${col * this.tileSize}px -${row * this.tileSize}px`,
        transition: "all 0.3s",
        opacity: value === 0 ? "0" : "1",
        cursor: value === 0 ? "default" : "pointer"
      },
      click: () => this.handleMove(value)
    });
  }

  handleMove(value) {
    if (value === 0 || isSolving) return;

    const [tileRow, tileCol] = this.findTile(value);
    const [emptyRow, emptyCol] = this.findTile(0);

    const isValidMove =
      (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
      (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1);

    if (!isValidMove) return;

    playSlide();
    $(".move span").text(++this.moves);

    this.swapTiles(tileRow, tileCol, emptyRow, emptyCol);
    this.updateBoard();

    if (this.isSolved()) {
      this.showSuccessPopup();
    }
  }

  swapTiles(r1, c1, r2, c2) {
    [this.state[r1][c1], this.state[r2][c2]] = [this.state[r2][c2], this.state[r1][c1]];
  }

  updateBoard() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.state[row][col];
        $(`#tile-${value}`).css({
          top: `${row * this.tileSize}px`,
          left: `${col * this.tileSize}px`
        });
      }
    }
  }

  findTile(value) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === value) return [row, col];
      }
    }
    return [];
  }

  shuffle() {
    let flat = this.goalState.flat();
    do {
      flat = flat.sort(() => Math.random() - 0.5);
    } while (!this.isSolvable(flat));

    this.state = this.chunk(flat, this.size);
    this.updateBoard();
  }

  isSolvable(arr) {
    let invCount = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) invCount++;
      }
    }
    if (this.size % 2 === 1) return invCount % 2 === 0;

    const [row] = this.findTile(0);
    return (this.size - row) % 2 === 0 ? invCount % 2 === 1 : invCount % 2 === 0;
  }

  chunk(arr, size) {
    return Array.from({ length: size }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  isSolved() {
    return this.state.flat().toString() === this.goalState.flat().toString();
  }

  showSuccessPopup() {
    setTimeout(() => {
      const moves = this.moves;
      const rank =
        moves <= 10
          ? "🔥 Flame Master"
          : moves <= 20
          ? "🔥 Ember Adept"
          : "🌫️ Smoky Soul";

      const intent = `https://x.com/intent/tweet?text=I completed the Fogo Puzzle in ${moves} moves! I earned the rank: "${rank}".%0A%0ACan you beat me? 🔥%0Ahttps://your-site-url.vercel.app/ %0Aby @bytrizz404`;

      const popup = $(`
        <div class="popup">
          <h2>🔥 Puzzle Solved!</h2>
          <p>You finished in <strong>${moves}</strong> moves</p>
          <p>Your Rank: <strong>${rank}</strong></p>
          <a href="${intent}" target="_blank" class="button share">Share on X</a>
          <button onclick="updateBoard()" class="button">Play Again</button>
        </div>
      `);
      $("body").append(popup);
    }, 300);
  }
}
