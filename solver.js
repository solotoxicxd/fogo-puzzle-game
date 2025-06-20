class Solver {
  constructor(boardInstance) {
    this.state = boardInstance.state;
    this.goal_state = boardInstance.goal_state;
    this.size = boardInstance.size;

    this.queue = new FastPriorityQueue((a, b) => a.value < b.value);
    this.visited = new Set();
    this.limit = 100000;

    this.test = new Map(); // For internal debugging or analysis
  }

  // Deep clone a board state
  clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  // Expand all possible valid moves from current state
  expand(current_state) {
    const flatKey = current_state.state.flat().toString();
    this.test.set(flatKey, (this.test.get(flatKey) ?? 0) + 1);

    const state = current_state.state;
    const row = current_state.empty_tile_row;
    const col = current_state.empty_tile_col;

    const directions = [
      { dr: -1, dc: 0, dir: "U" }, // Up
      { dr: 1, dc: 0, dir: "D" },  // Down
      { dr: 0, dc: -1, dir: "L" }, // Left
      { dr: 0, dc: 1, dir: "R" }   // Right
    ];

    for (let { dr, dc, dir } of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (this.isInsideBoard(newRow, newCol)) {
        const new_state = this.clone(state);

        // Swap empty tile with the target tile
        [new_state[row][col], new_state[newRow][newCol]] = [
          new_state[newRow][newCol], 0
        ];

        const newFlat = new_state.flat().toString();
        if (!this.visited.has(newFlat)) {
          const newBoardState = new BoardState(
            new_state,
            this.goal_state,
            this.size,
            current_state.path + dir,
            current_state.path_states,
            current_state.depth + 1
          );

          this.queue.add(newBoardState);
          this.limit -= 1;
        }
      }
    }
  }

  // Check if the coordinates are within the board
  isInsideBoard(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  // A* solving function
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
      const flatState = current_state.state.flat().toString();

      this.visited.add(flatState);

      if (flatState === this.goal_state.flat().toString()) {
        return current_state;
      }

      this.expand(current_state);
    }
  }
}
