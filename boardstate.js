class BoardState {
  constructor(state, goal_state, size, path = "", path_states = [], depth = 0) {
    this.state = state;
    this.goal_state = goal_state;
    this.size = size;

    this.path = path;
    this.path_states = path_states;
    this.depth = depth;

    this.value = 0;
    this.empty_tile_row = null;
    this.empty_tile_col = null;

    this.setEmptyTilePos();
    this.setValue();
    this.addPathState();
  }

  // Returns the move path (e.g., "ULDR")
  getPath() {
    return this.path;
  }

  // Calculates and sets the heuristic value
  setValue() {
    // Only include depth for size ≤ 3 to avoid overloading larger puzzles
    this.value = (this.size > 3 ? 0 : this.depth) + this.manhattanDistance();
  }

  // Clones and adds current state to the path trail
  addPathState() {
    const clone = JSON.parse(JSON.stringify(this.path_states));
    clone.push(this.state);
    this.path_states = clone;
  }

  // Heuristic: Misplaced tiles (not used in A* but useful for testing)
  misplacedTiles() {
    let count = 0;
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] !== 0 && this.state[i][j] !== this.goal_state[i][j]) {
          count++;
        }
      }
    }
    return count;
  }

  // Heuristic: Manhattan Distance
  manhattanDistance() {
    let total = 0;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        const tile = this.state[i][j];

        if (tile !== 0) {
          for (let x = 0; x < this.goal_state.length; x++) {
            for (let y = 0; y < this.goal_state[x].length; y++) {
              if (this.goal_state[x][y] === tile) {
                total += Math.abs(x - i) + Math.abs(y - j);
                break;
              }
            }
          }
        }
      }
    }

    return total;
  }

  // Finds the position of the empty tile (0)
  setEmptyTilePos() {
    const flat = this.state.flat();
    const index = flat.indexOf(0);
    this.empty_tile_row = Math.floor(index / this.size);
    this.empty_tile_col = index % this.size;
  }
}
