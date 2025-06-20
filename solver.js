class Solver {
  constructor(boardInstance) {
    this.state = boardInstance.state;
    this.goal_state = boardInstance.goal_state;
    this.size = boardInstance.size;
    this.queue = new FastPriorityQueue(function (a, b) {
      return a.value < b.value;
    });
    this.visited = new Set();
    this.limit = 100000;
    this.test = new Map();
  }

  clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  expand(current_state) {
    this.test.set(
      current_state.state.flat().toString(),
      (this.test.get(current_state.state.flat().toString()) ?? 0) + 1
    );

    let new_state = null;
    let state = current_state.state;
    let row = current_state.empty_tile_row;
    let col = current_state.empty_tile_col;

    const directions = [
      { dr: -1, dc: 0, dir: "U" },
      { dr: 1, dc: 0, dir: "D" },
      { dr: 0, dc: -1, dir: "L" },
      { dr: 0, dc: 1, dir: "R" }
    ];

    for (let { dr, dc, dir } of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
        new_state = this.clone(state);
        let temp = new_state[newRow][newCol];
        new_state[newRow][newCol] = 0;
        new_state[row][col] = temp;
        if (!this.visited.has(new_state.flat().toString())) {
          let new_board_state = new BoardState(
            new_state,
            this.goal_state,
            this.size,
            current_state.path + dir,
            current_state.path_states,
            current_state.depth + 1
          );
          this.queue.add(new_board_state);
          this.limit -= 1;
        }
      }
    }
  }

  solveAStar() {
    let init_state = new BoardState(
      this.state,
      this.goal_state,
      this.size,
      "",
      [],
      0
    );

    this.queue.add(init_state);
    while (!this.queue.isEmpty() && this.limit > 0) {
      let current_state = this.queue.poll();
      this.visited.add(current_state.state.flat().toString());
      if (
        current_state.state.flat().toString() ===
        this.goal_state.flat().toString()
      ) {
        return current_state;
      }
      this.expand(current_state);
    }
  }
}
