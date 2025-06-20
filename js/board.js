const DEFAULT_SIZE = 3;
let DEFAULT_BOARD_SIZE = 500;

class Board {
  constructor(size = DEFAULT_SIZE) {
    this.size = size;
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
    this.img = ""; // set randomly in start()
  }

  start() {
    if (this.solved) return;
    if (this.started) {
      this.shuffle();
      return;
    }

    // 🎨 Random fogo image
    const images = ["fogo1.png", "fogo2.png", "fogo3.png", "fogo4.png", "fogo5.png"];
    const randomIndex = Math.floor(Math.random() * images.length);
    this.img = `assets/images/${images[randomIndex]}`;

    $(".board").empty().css("visibility", "visible");
    this.createBoard();
    setTimeout(() => this.shuffle(), 600);
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
      html: number !== 0 ? `<p class="number">${number}</p>` : "",
      css: {
        position: "absolute",
        width: `${this.tiles_size}px`,
        height: `${this.tiles_size}px`,
        background: number === 0 ? "transparent" : `url('${this.img}')`,
        backgroundPosition: `-${col * this.tiles_size}px -${row * this.tiles_size}px`,
        backgroundSize: `${this.board_size}px ${this.board_size}px`,
        left: `${col * this.tiles_size}px`,
        top: `${row * this.tiles_size}px`,
        transition: ".3s",
        cursor: number === 0 ? "default" : "pointer",
        opacity: number === 0 ? 0 : 1
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

      if (!this.isAI && typeof playSound === "function") {
        playSound(slideSound);
      }
    }
  }

  isSolved() {
    if (this.state.flat().toString() === this.goal_state.flat().toString()) {
      this.solved = true;
      this.showVictoryModal();
      return true;
    }
    return false;
  }

  showVictoryModal() {
    const moveCount = this.moves;
    let roast = "", title = "";

    if (moveCount <= 20) {
      roast = "🔥 You’re too hot to handle!";
      title = "Fire Master";
    } else if (moveCount <= 35) {
      roast = "🔥 Well played, smoky genius!";
      title = "Blazing Mind";
    } else if (moveCount <= 50) {
      roast = "🔥 You survived the heat.";
      title = "Ash Warrior";
    } else {
      roast = "💀 That was... mildly tragic.";
      title = "Cold Ember";
    }

    const shareText = `I just solved the #FogoPuzzle in ${moveCount} moves 🧩
Rank: ${title}
${roast}
🔥 Think you can beat me? Try: https://fogopuzzle.vercel.app
— by @bytrizz404`;

    const $modal = $(`
      <div class="victory-modal">
        <h2>🎉 Congratulations!</h2>
        <p>You solved the puzzle in <strong>${moveCount}</strong> moves.</p>
        <p>${roast}</p>
        <p>🏆 Your Title: <strong>${title}</strong></p>
        <button class="button x-share" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}','_blank')">📢 Share on X</button>
        <button class="button" onclick="location.reload()">Play Again</button>
      </div>
    `);
    $("body").append($modal);
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
