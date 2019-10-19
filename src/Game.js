const readLine = require('readline');

class Move {
  /**
   * 
   * @param {number} r 
   * @param {number} c 
   */
  constructor(r, c) {
    this.r = r;
    this.c = c;
  }

  getR() {
    return this.r;
  }

  getC() {
    return this.c;
  }
}



class Point {
  /**
   * 
   * @param {number} value 
   * @param {Move} move 
   */
  constructor(value, move) {
    this.value = value;
    this.move = move;
  }

  getValue() {
    return this.value;
  }

  getMove() {
    return this.move;
  }
}

class Board {
  constructor() {
    /**
     * @type number[][]
     */
    this.cells = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    /**
     * @type Move[]
     */
    this.availableMoves = [];
    /**
     * @type Point[]
     */
    this.nodes = [];
    /**
     * @type string[][]
     */
    this.marks = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
  }

  /**
   * 
   * @param {Move} m 
   * @param {number} i 
   */
  placeMove(m, i) {
    this.cells[m.getR()][m.getC()] = i;
  }

  getAvailableMoves() {
    if (this.availableMoves.length >  0) {
      for (let i = 0; i < this.availableMoves.length; i++) {
        this.availableMoves.splice(i, 1);
      }
    }
    for (let i = 0; i < this.cells.length; i++) {
      for (let j =0; j < this.cells.length; j++) {
        if (this.cells[i][j] === 0) {
          this.availableMoves.push(new Move(i, j));
        }
      }
    }
    return this.availableMoves;
  }

  /**
   * 
   * @param {number} value 
   */
  thereIsAWin(value) {
    for (let i =0; i < this.cells.length; i++) {
      if (this.cells[i][0] === this.cells[i][1] && this.cells[i][1] === this.cells[i][2] && this.cells[i][2] === value) {
        return true;
      }
      if (this.cells[0][i] === this.cells[1][i] && this.cells[1][i] === this.cells[2][i] && this.cells[2][1] === value) {
        return true;
      }
    }
    if ((this.cells[0][0] === this.cells[1][1] && this.cells[1][1] === this.cells[2][2] && this.cells[2][2] === value) || (this.cells[0][2] === this.cells[1][1] && this.cells[1][1] === this.cells[2][0] && this.cells[2][0] === value)) {
      return true;
    }
    return false;
  }

  xHasWon() {
    return this.thereIsAWin(1);
  }

  oHasWon() {
    return this.thereIsAWin(-1);
  }

  gameIsOver() {
    return (this.xHasWon() || this.oHasWon() || this.getAvailableMoves().length === 0);
  }

  /**
   * 
   * @param {number} depth 
   * @param {boolean} isMaximizer 
   */
  minimax(depth, isMaximizer) {
    let maxEval = Number.MIN_VALUE;
    let minEval = Number.MAX_VALUE;
    if (this.getAvailableMoves().length === 0) {
      return 0;
    }
    if (this.xHasWon()) {
      return 1;
    }
    if (this.oHasWon()) {
      return -1;
    }
    if (isMaximizer) {
      for (let i = 0; i < this.getAvailableMoves().length; i++) {
        const m = this.getAvailableMoves()[i];
        this.placeMove(m, 1);
        const evaluate = this.minimax(depth + 1, false);
        maxEval = Math.max(maxEval, evaluate);
        if (depth === 0) {
          this.nodes.push(new Point(maxEval, m));
        }
        this.placeMove(m, 0);
      }
    } else {
      for (let i = 0; i < this.getAvailableMoves().length; i++) {
        const m = this.getAvailableMoves()[i];
        this.placeMove(m, -1);
        const evaluate = this.minimax(depth + 1, true);
        minEval = Math.min(minEval, evaluate);
        if (depth === 0) {
          this.nodes.push(new Point(minEval, m));
        }
        this.placeMove(m, 0);
      }
    }
    // console.log(this.minimax(depth, isMaximizer));
    return isMaximizer ? maxEval : minEval;
  }

  getBestMove() {
    let max = Number.MIN_VALUE;
    let index = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      if (max < node.getValue()) {
        max = node.getValue();
        index = i;
      }
    }
    return this.nodes[index].getMove();
  }

  /**
   * 
   * @param {number} depth 
   * @param {boolean} isMaximizer 
   */
  callMinimax(depth, isMaximizer) {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes.splice(i, 1);
    }
    this.minimax(depth, isMaximizer);
  }

  showBoard() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells.length; j++) {
        if (this.cells[i][j] === 0) {
          this.marks[i][j] = '-';
        }
        if (this.cells[i][j] === 1) {
          this.marks[i][j] = 'X';
        }
        if (this.cells[i][j] === -1) {
          this.marks[i][j] = 'O';
        }
        process.stdout._write('[ '+ this.marks[i][j] + ' ]', 'utf-8', (err) => {});
      }
      console.log('\n');
    }
  }

  showHint() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells.length; j++) {
        process.stdout._write(`[${[ i + 1, j + 1 ]}]`, 'utf-8', (err) => {});
      }
      console.log('\n');
    } 
  }

  async startGame() {
    console.log('Welcome to the Tic-Tac-Toe game \n Author: Kingsley Victor \n');
    this.showBoard();
    this.showHint();
    console.log('\n To place a mark, enter the corresponding row and column value \n');
    const reading = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    let getChoice = await new Promise((resolve) => {
      reading.question('\n Who plays first? Computer(1), User (2) \n', (data) => {
        resolve(data);
      });
    });
    const checkChoice = async () => {
      getChoice = await new Promise((resolve) => {
        reading.question('\n Invalid Choice \n', (data) => {
          resolve(data);
        });
      });
      if (parseInt(getChoice) < 1 || parseInt(getChoice) > 2) {
        checkChoice();
      }
    }
    if (parseInt(getChoice) < 1 || parseInt(getChoice) > 2) {
      checkChoice();
    }
    if (parseInt(getChoice) === 1) {
      const randomRow = Math.floor(Math.random() * 3);
      const randomColumn = Math.floor(Math.random() * 3);
      const m = new Move(randomRow, randomColumn);
      this.placeMove(m, 1);
      this.showBoard();
      this.showHint();
    }
    const checkIfGameOver = async () => {
      console.log('Make your move \n \n');
      let r = await new Promise((resolve) => {
        reading.question('\n Enter Row \n', (data) => {
          resolve(parseInt(data) - 1);
        });
      });
      let c = await new Promise((resolve) => {
        reading.question('\n Enter Column \n', (data) => {
          resolve(parseInt(data) - 1);
        });
      });
      let m = new Move(r, c);
      const checkIfCellOccupied = async () => {
        console.log('\n Invalid move. Cell already occupied \n');
        r = await new Promise((resolve) => {
          reading.question('\n Enter Row \n', (data) => {
            resolve(parseInt(data) - 1);
          });
        });
        c = await new Promise((resolve) => {
          reading.question('\n Enter Column \n', (data) => {
            resolve(parseInt(data) - 1);
          });
        });
        m = new Move(r, c);
        if (this.cells[m.getR()][m.getC()] !== 0) {
          checkIfCellOccupied();
        }
      }
      if (this.cells[m.getR()][m.getC()] !== 0) {
        checkIfCellOccupied();
      } else {
        this.placeMove(m, -1);
        this.showBoard();
        this.callMinimax(0, true);
        if (this.gameIsOver()) {
        console.log('\n');
        this.showBoard();
        reading.close();
      }
      try {
        console.log();
        console.log('Wait! Computer is thinking');
        console.log()
        setTimeout(() => {}, 2000);
      } catch (error) {
        console.log(error.message);
      }
      this.placeMove(this.getBestMove(), 1);
      this.showBoard();
      if (!this.gameIsOver()) {
        this.showHint();
        checkIfGameOver();
      }
      }
    }
    if (!this.gameIsOver()) {
      checkIfGameOver();
    }
    if (this.xHasWon()) {
      console.log('Computer wins the game');
    }
    if (this.oHasWon()) {
      console.log('You win the game');
    }
    if (this.getAvailableMoves().length === 0 && !this.xHasWon() && !this.oHasWon()) {
      console.log(`It's a tie`);
    }
  }
}

class Game {
  start() {
    const b = new Board();
    b.startGame();
  }
}

const game = new Game();

game.start();
