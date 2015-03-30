console.log("Loading tetrix model...");

if(!Tetrix) {
  console.log("Please load tetrix.js first.");
}

Tetrix.LAYOUTS = [
  [ [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0] ],

  [ [1,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0] ],

  [ [0,0,1,1],
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0] ],

  [ [0,0,0,0],
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0] ],

  [ [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0] ],

  [ [0,0,0,0],
    [0,0,1,1],
    [0,1,1,0],
    [0,0,0,0] ],

  [ [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0] ]
];

Tetrix.COLORS = [
  'green', 'red', 'blue', 'yellow', 'purple'
];

Tetrix.Shape = class {

  constructor(layout, color, position){
    this.layout = layout;
    this.color = color;
    this.position = position;
  }

  static getRandomShape(cols) {
    var layout = Tetrix.LAYOUTS[Math.floor(Math.random() * Tetrix.LAYOUTS.length)];
    var color = Tetrix.COLORS[Math.floor(Math.random() * Tetrix.COLORS.length)];
    var position = {
      i : -4,
      j : Math.floor(cols / 2) - 2,
    };
    return new Tetrix.Shape(layout, color, position);
  }

  rotate() {
    var layout = [ [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0] ];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        layout[i][j] = this.layout[j][3-i];
      }
    }
    return new Tetrix.Shape(layout, this.color, this.position);
  }

  move(down, right) {
    return new Tetrix.Shape(this.layout, this.color, { i: this.position.i + down, j: this.position.j + right});
  }

  getBox(i, j) {
    if (i >= 0 && i < 4 && j >= 0 && j < 4 && this.layout[i][j]) {
      return this.color;
    }
    return null;
  }
}

Tetrix.Board = class {

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.array = [];
    for(var i=0; i<rows; i++) {
      this.array[i] = [];
      for(var j=0; j<cols; j++) {
        this.array[i][j] = 0;
      }
    }
  }

  checkIfAllowed(shape) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var ti = shape.position.i + i;
        var tj = shape.position.j + j;
        if (!shape.layout[i][j] || ti < 0) {
          continue;
        }
        if(ti >= this.array.length || tj < 0 || tj >= this.array[0].length) {
          return false;
        }
        if(this.array[ti][tj]) {
          return false;
        }
      }
    }
    return true;
  }

  land(shape) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var ti = shape.position.i + i;
        var tj = shape.position.j + j;
        if(ti < 0 || ti >= this.array.length || tj < 0 || tj >= this.array[ti].length) {
          continue;
        }
        if(shape.layout[i][j]) {
          this.array[ti][tj] = shape.color;
        }
      }
    }
  }

  removeFullLines() {
    var newArray = [];
    this.array.forEach(function(r, i) {
      for(var j=0; j<r.length; j++) {
        if(!r[j]) {
          newArray.push(r);
          break;
        }
      }
    });
    var count = this.array.length - newArray.length;
    while(newArray.length < this.array.length) {
      newArray.unshift(new Array(this.cols));
    }
    this.array = newArray;
    return count;
  }

  getBox(i, j) {
    if (i < 0 || i >= this.array.length || j < 0 || j >= this.array[0].length)
      return null;
    return this.array[i][j];
  }
}

Tetrix.Game = class {

  constructor(rows, cols) {
    this.gameOver = false;
    this.rows = rows;
    this.cols = cols;
    this.board = new Tetrix.Board(rows, cols);
    this.shape = Tetrix.Shape.getRandomShape(cols);
    this.score = 0;
  }

  getBox(i, j) {
    return this.shape.getBox(i - this.shape.position.i, j - this.shape.position.j) || this.board.getBox(i, j);
  }

  nextState() {
    if(this.gameOver) {
      return;
    }

    if(!this.__tryMove(1, 0)) {
      this.board.land(this.shape);
      this.score += 10 * this.board.removeFullLines();
      this.shape = Tetrix.Shape.getRandomShape(this.cols);
      this.gameOver = !this.board.checkIfAllowed(this.shape.move(1, 0));
    }
  }

  isGameOver() {
    return this.gameOver;
  }

  moveRight() {
    this.__tryMove(0, 1);
  }

  moveDown() {
    this.__tryMove(1, 0);
  }

  moveLeft() {
    this.__tryMove(0, -1);
  }

  rotate() {
    var newShape = this.shape.rotate(1);
    if (this.board.checkIfAllowed(newShape)){
      this.shape = newShape;
    }
  }

  __tryMove(down, right) {
    var newShape = this.shape.move(down, right);
    if(this.board.checkIfAllowed(newShape)) {
      this.shape = newShape;
      return true;
    }
    return false;
  }
}
