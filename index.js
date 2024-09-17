var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function () {
  setGame();
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      // <div id="0-0"><div>
      let tile = document.createElement("div");
      tile.id = i.toString() + "-" + j.toString();
      let num = board[i][j];
      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }

  setTwo();
  setTwo();
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = ""; //clear the classList (we don't want tiles with multiple classes x2 x4 x8 ...)
  tile.classList.add("tile");

  if (num == 0) {
    tile.classList.add("empty");
  } else if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
  } else if (e.code == "ArrowRight") {
    slideRight();
  } else if (e.code == "ArrowUp") {
    slideUp();
  } else if (e.code == "ArrowDown") {
    slideDown();
  }

  if (isGameOver()) {
    alert("Game over!");
  } else {
    setTwo();
  }

  document.getElementById("score").innerText = score;
});

function hasEmptyTile() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] == 0) return true;
    }
  }
  return false;
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }
  let found = false;
  while (!found) {
    //random i, j value
    let i = Math.floor(Math.random() * rows);
    let j = Math.floor(Math.random() * columns);

    if (board[i][j] == 0) {
      board[i][j] = 2;
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;
    }
  }
}

function filterZero(row) {
  return row.filter((num) => num != 0); //create a new array without zeroes
}

function slide(row) {
  //[0, 2, 2, 2]
  row = filterZero(row); //get rid of zeroes => [2, 2, 2]

  //slide
  for (let i = 0; i < row.length; i++) {
    //check every 2
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    } //[2,2,2] => [4, 0, 2]
  }

  row = filterZero(row); //[4,2]

  //add empty tiles (zeroes)
  while (row.length < columns) {
    row.push(0);
  } //[4,2,0,0]

  return row;
}

function slideLeft() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];
    row = slide(row);
    board[i] = row;

    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];
    row.reverse();
    row = slide(row);
    row.reverse();
    board[i] = row;

    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let j = 0; j < columns; j++) {
    let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
    row = slide(row);
    board[0][j] = row[0];
    board[1][j] = row[1];
    board[2][j] = row[2];
    board[3][j] = row[3];

    for (let i = 0; i < rows; i++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let j = 0; j < columns; j++) {
    let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
    row.reverse();
    row = slide(row);
    row.reverse();
    board[0][j] = row[0];
    board[1][j] = row[1];
    board[2][j] = row[2];
    board[3][j] = row[3];

    for (let i = 0; i < rows; i++) {
      let tile = document.getElementById(i.toString() + "-" + j.toString());
      let num = board[i][j];
      updateTile(tile, num);
    }
  }
}

function isGameOver() {
  if (hasEmptyTile()) {
    return false;
  }
  // Check for possible merges
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      // Check right
      if (j < columns - 1 && board[i][j] === board[i][j + 1]) {
        return false; // Tiles can be merged to the right
      }
      // Check down
      if (i < rows - 1 && board[i][j] === board[i + 1][j]) {
        return false; // Tiles can be merged downward
      }
    }
  }
  return true;
}
