class Solver {
  constructor(boardInstance) {
    this.state = boardInstance.state;
    this.goal_state = boardInstance.goal_state;
    this.size = boardInstance.size;
    this.queue = new FastPriorityQueue((a, b) => a.value < b.value);
    this.visited = new Set();
    this.limit = 100000;
    this.test = new Map();
  }

  clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  expand(current_state) {
    const key = current_state.state.flat().toString();
    this.test.set(key, (this.test.get(key) ?? 0) + 1);

    const directions = [
      [-1, 0, "U"], [1, 0, "D"],
      [0, -1, "L"], [0, 1, "R"]
    ];

    for (const [dr, dc, dir] of directions) {
      const row = current_state.empty_tile_row;
      const col = current_state.empty_tile_col;
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow < 0 || newRow >= this.size || newCol < 0 || newCol >= this.size) continue;

      const new_state = this.clone(current_state.state);
      [new_state[row][col], new_state[newRow][newCol]] = [new_state[newRow][newCol], 0];

      const flatKey = new_state.flat().toString();
      if (!this.visited.has(flatKey)) {
        const new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          current_state.path + dir,
          current_state.path_states,
          current_state.depth + 1
        );
        this.queue.add(new_board_state);
        this.limit--;
      }
    }
  }

  solveAStar() {
    const init_state = new BoardState(
      this.state,
      this.goal_state,
      this.size,
      "",
      [],
      0
    );

    this.queue.add(init_state);
    while (!this.queue.isEmpty() && this.limit > 0) {
      const current_state = this.queue.poll();
      this.visited.add(current_state.state.flat().toString());

      if (
        current_state.state.flat().toString() ===
        this.goal_state.flat().toString()
      ) {
        return current_state;
      }

      this.expand(current_state);
    }
    return null;
  }

  // 🔥 Visual Solver
  solveAI() {
    if (this.size > 3) {
      alert("Solver only supports up to 3x3 boards for performance reasons.");
      return;
    }

    const result = this.solveAStar();
    if (!result) {
      alert("No solution found within the limit.");
      return;
    }

    const path = result.path_states;
    if (!path || path.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i >= path.length) {
        clearInterval(interval);
        return;
      }
      board.state = path[i];
      board.placeTiles();
      playSound(slideSound, 100); // 🎵 Add sound here
      i++;
    }, 300);
  }
}
