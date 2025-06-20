const DEFAULT_SIZE = 3;
const DEFAULT_IMAGE = ""; // Will be set randomly in start()
let DEFAULT_BOARD_SIZE = 500;


class Board {
  constructor(size = DEFAULT_SIZE, image = DEFAULT_IMAGE) {
    this.size = size;
    this.img = image;
    this.board_size = DEFAULT_BOARD_SIZE;
    this.tiles_size = this.board_size / this.size;
    this.state = [];
    this.goal_state = [];
    this.empty_tile_row = null;
    this.empty_tile_col = null;
    this.started = false;
    this.solved = false;
    this.moves = 0;
    this.isAI = false;
    this.start();
  }

  start() {
    if (this.solved) return;
    if (this.started) {
      this.shuffle();
      return;
    }
    this.createBoard();
    setTimeout(() => this.shuffle(), 1000);
    this.started = true;
  }

  createBoard() {
    const board = $(".board");
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
  }

  createTile(number, row, col) {
    return $("<div/>", {
      class: "tile",
      id: number,
      html: `<p class="number">${number}</p>`,
      css: {
        position: "absolute",
        width: `${this.tiles_size}px`,
        height: `${this.tiles_size}px`,
        scale: "0.99",
        color: "black",
        background: `url("${this.img}")`,
        backgroundPosition: `-${col * this.tiles_size}px -${row * this.tiles_size}px`,
        backgroundSize: `${this.board_size}px ${this.board_size}px`,
        left: `${col * this.tiles_size}px`,
        top: `${row * this.tiles_size}px`,
        transition: ".3s",
        cursor: number === 0 ? "default" : "pointer",
        opacity: number === 0 ? "0" : "1"
      },
      click: () => this.moveTile(number)
    });
  }

  moveTile(number) {
    if (!this.state?.length || this.solved) return;
    this.isAI = false;

    const [row, col] = this.findTilePos(number);
    const [empty_row, empty_col] = this.findTilePos(0);

    let newState = this.clone(this.state);
    let moved = false;

    if (
      (empty_col === col && Math.abs(row - empty_row) === 1) ||
      (empty_row === row && Math.abs(col - empty_col) === 1)
    ) {
      newState[empty_row][empty_col] = number;
      newState[row][col] = 0;
      moved = true;
    }

    if (moved) {
      this.state = newState;
      this.moves++;
      $(".move span").text(this.moves);
      this.placeTiles();

      // 🔊 Play sound if not AI and sound function exists
      if (!this.isAI && typeof playSound === "function") {
        playSound(slideSound);
      }
    }
  }

  isSolved() {
    if (this.state.flat().toString() === this.goal_state.flat().toString()) {
      this.solved = true;
      this.playAgainPrompt();
      return true;
    }
    return false;
  }

  playAgainPrompt() {
    $(".tile").css({ scale: 1, cursor: "default" });
    $("#0").css("opacity", 1);
    $(".board").append(
      $("<button/>", {
        class: "button play-again large",
        text: "Play Again",
        css: {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        },
        click: () => {
          $(".move span").text(0);
          updateBoard();
        }
      })
    );
  }

  findTilePos(number) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === number) return [r, c];
      }
    }
  }

  clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  placeTiles() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const id = this.state[r][c];
        $(`#${id}`).css({
          top: `${r * this.tiles_size}px`,
          left: `${c * this.tiles_size}px`
        });
      }
    }
    this.isSolved();
  }

  shuffle() {
    let state = this.goal_state.flat();

    for (let i = state.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state[i], state[j]] = [state[j], state[i]];
    }

    if (!this.isSolvable(state)) {
      [state[0], state[1]] = [state[1], state[0]];
    }

    this.state = this.make2dstate(state);
    this.placeTiles();
  }

  make2dstate(state) {
    const result = [];
    for (let i = 0; i < state.length; i += this.size) {
      result.push(state.slice(i, i + this.size));
    }
    return result;
  }

  isSolvable(state) {
    let inv = 0;
    for (let i = 0; i < state.length; i++) {
      if (state[i] === 0) {
        this.empty_tile_row = Math.floor(i / this.size);
        this.empty_tile_col = i % this.size;
        continue;
      }
      for (let j = i + 1; j < state.length; j++) {
        if (state[j] !== 0 && state[i] > state[j]) inv++;
      }
    }

    if (this.size % 2 !== 0) return inv % 2 === 0;

    const blankRowFromBottom = this.size - this.empty_tile_row;
    return blankRowFromBottom % 2 === 0 ? inv % 2 !== 0 : inv % 2 === 0;
  }
}
