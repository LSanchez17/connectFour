/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game{
  constructor(playerOne, playerTwo, height = 6, width = 7){
    this.height = height;
    this.width = width;
    this.board = [];
    this.currPlayer = 1;
    this.players = [playerOne, playerTwo];
    this.makeBoard();
    this.makeHtmlBoard();
    this.won = false;
  }
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
    console.log('Board RAN')
  }  
  makeHtmlBoard() {
    const board = document.getElementById('board');
    
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
   
    this.handleClicks = this.handleClick.bind(this);
    top.addEventListener('click', this.handleClicks);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
    console.log("All this ran too")
  }
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
    if(this.currPlayer === 1){    
      piece.style.backgroundColor = this.players[0].colorString;
    }
    else{
      piece.style.backgroundColor = this.players[1].colorString;
    }    

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }  
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.won = true;
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }
  checkForWin() {
    const _win = (cells)  => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  endGame(msg) {
    alert(msg);
    let top = document.querySelector('#column-top');
    top.removeEventListener('click', this.handleClicks);
  }
  restart() {
    let body = document.querySelector('div');
    let childOfBody = document.querySelector('#board');
    
    this.removeBoard(body, childOfBody);
    this.makeBoard()
    this.makeHtmlBoard();
  }
  rebuildTable(parent){
    let newTable = document.createElement('table');
    newTable.setAttribute('id', 'board');
    parent.append(newTable);
  }
  removeBoard(parent, child){
    parent.removeChild(child);
    this.rebuildTable(parent)
  }
  checkBoard(){
    console.log(this.board);
  }
}

class Player{
  constructor(colorString){
    this.colorString = colorString;
  }
}


//let firstGame = new Game(6,7); //Makes new game!
let gameButton = document.querySelector('#playerColor');
let playerColorOne = document.querySelector('#p1Color');
let playerColorTwo = document.querySelector('#p2Color');

gameButton.addEventListener('submit', (e) => {
  e.preventDefault();
  let playerOne = new Player(document.querySelector('#p1Color').value);
  let playerTwo = new Player(document.querySelector('#p2Color').value);
  let drawGame = new Game(playerOne, playerTwo);
  drawGame.restart();
  return drawGame;
});
