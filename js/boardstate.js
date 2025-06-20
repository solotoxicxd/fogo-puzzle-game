class BoardState {
  constructor(state, goal_state, size, path = "", path_states = [], depth = 0) {
    this.state = state;
    this.goal_state = goal_state;
    this.size = size;
    this.path = path;
    this.path_states = [...path_states]; // preserve previous path states
    this.depth = depth;
    this.value = 0;
    this.empty_tile_row = null;
    this.empty_tile_col = null;

    this.setEmptyTilePos();
    this.setValue();
    this.addPathState();
  }

  getPath() {
    return this.path;
  }

  setValue() {
    // A* value = cost (depth) + heuristic
    this.value = (this.size > 3 ? 0 : this.depth) + this.manhattanDistance();
  }

  addPathState() {
    const clone = JSON.parse(JSON.stringify(this.state));
    this.path_states.push(clone);
  }

  misplacedTiles() {
    let result = 0;
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (
          this.state[i][j] !== 0 &&
          this.state[i][j] !== this.goal_state[i][j]
        ) {
          result++;
        }
      }
    }
    return result;
  }

  manhattanDistance() {
    let distance = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const value = this.state[i][j];
        if (value !== 0) {
          for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
              if (this.goal_state[x][y] === value) {
                distance += Math.abs(i - x) + Math.abs(j - y);
              }
            }
          }
        }
      }
    }
    return distance;
  }

  setEmptyTilePos() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === 0) {
          this.empty_tile_row = i;
          this.empty_tile_col = j;
          return;
        }
      }
    }
  }
}
