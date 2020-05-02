/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
const makeBoard = () => {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  /*
  /  Used an old algo for this, from a previous simple minesweeper game
  /  I made a while back :D Yay for reusability!
  /  Modified the order of creation to make it work
  */
  board = [];
  for(let i = 0; i < HEIGHT; i++){
    let tempBoard = [];
    for(let j = 0; j < WIDTH; j++){
      tempBoard.push(null);
    }
    board.push(tempBoard);
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.querySelector('#board')
  // TODO: add comment for this code
  //We create a tr element, and then set the id to column-top
  //We then give this top column an event listener to handle our logic
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //We create td, and set attributes to them based on the loop.
  //We then append these to the top tr
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  //append what we just made to the top
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    //Creates a row within the table, at each iteration of the loop
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      //Creates a cell within the table, at each iteration of the inner loop
      const cell = document.createElement("td");
      //Gives each created cell, two attributes, and id, and a coordinate pair
      //Coordinate pair is made from created "time" in loop
      cell.setAttribute("id", `${y}-${x}`);
      //Appends the created row to the current cell, and repeats!
      row.append(cell);
    }
    //We append the current row to the htmlBoard after the inner loop has ran
    //By doing it here, we ensure the inner loop has created a column with enough rows
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0
  //We set coordinate to null in case we clicked on a previously filled spot
  let coordinate = null;

  //We loop through the array at this particular column, and go through each value
  //beginning at the begining and moving on down till we match
  for(let i = 0; i < HEIGHT; i++){
    console.log(board[i][x])
    if(board[i][x] === null){
      coordinate = i;
    }
  }
  return coordinate;
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell
  let boardCell = document.getElementById(`${y}-${x}`);
  let newDivPiece = document.createElement('div');

  newDivPiece.className = `piece p${currPlayer}`;
  boardCell.append(newDivPiece);
}

/** endGame: announce game end */
const endGame = (msg) => {
  // TODO: pop up alert message
  alert(msg);
  //build a reset here for new game
  let body = document.querySelector('div');
  let childOfBody = document.querySelector('#board');


  removeBoard(body, childOfBody);
  makeBoard();
  makeHtmlBoard();
}

const rebuildTable = (parent) => {
  let newTable = document.createElement('table');
  newTable.setAttribute('id', 'board');
  parent.append(newTable);
}

const removeBoard = (parent, child) => {
  parent.removeChild(child);
  rebuildTable(parent);
}

/** handleClick: handle click of column top to play piece */
const handleClick = (evt) => {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  console.log(y,x)
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board.every(([y,x]) => { [y,x] === 1 || [y,x] === 2 })){
    endGame(`TIE!`);
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  if(currPlayer === 1){
    currPlayer = 2;
  }
  else{
    currPlayer = 1;
  }
  appendPlayer();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        /*Checks to see if all the coordinates are real(positive number, within range),
          and then checks to see that the coordinate has been assigned a P1, or P2 piece
        */
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  /*Loops over each column, then through each row in that column
    Once looping through the rows, it creates four variables, each representing
    a winning condition.  Then it calls the _win function with those pairs to see if 
    it is a winning match!
  */
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //Makes an array, first element is the beginning point, then moving to the right 3 times
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //Makes an array, then moving up 3 spaces
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //creates a diagonal array, only containing pieces diagonal to the origin
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //If either of the winning conditions returns true from the .every check, we end the game!
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

const appendPlayer = () => {
  let appendHere = document.querySelector('#player');
  appendHere.innerText = `Current Player: Player ${currPlayer}`;
}
makeBoard();
makeHtmlBoard();
appendPlayer();