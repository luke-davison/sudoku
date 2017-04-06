
//loads the start script
document.addEventListener('DOMContentLoaded', setUpPuzzle);

//this array will store the clues (and answers) [array of rows][array of columns][value of cell]
var puzzleClues = []
//this array will store the possible numbers for each cell [array of rows][array of columns][array of possible values]
var possibles = []
//this array stores the rows, columns and sectors that need to be checked or rechecked [0 = row, 1 = column, 2 = sector][row, column or sector number][true or false]
var toCheck = [];
//a variable which stores whether the current loop needs to be repeated
var goThroughAgain = false;
//an array which stores the values that are already in each row, column or sector [0 = row, 1 = column, 2 = sector][row, column or sector number][array of values]
var alreadyContains = [];

//this function just loads an example sudoku (used for testing)
function getSudoku(level) {
  if (level === 1) {
    document.getElementsByClassName("row-0 col-1")[0].value = 8;
    document.getElementsByClassName("row-0 col-2")[0].value = 5;
    document.getElementsByClassName("row-0 col-5")[0].value = 4;
    document.getElementsByClassName("row-0 col-6")[0].value = 7;
    document.getElementsByClassName("row-0 col-8")[0].value = 6;
    document.getElementsByClassName("row-1 col-0")[0].value = 9;
    document.getElementsByClassName("row-1 col-1")[0].value = 4;
    document.getElementsByClassName("row-1 col-3")[0].value = 6;
    document.getElementsByClassName("row-1 col-5")[0].value = 3;
    document.getElementsByClassName("row-2 col-1")[0].value = 7;
    document.getElementsByClassName("row-2 col-2")[0].value = 6;
    document.getElementsByClassName("row-2 col-3")[0].value = 8;
    document.getElementsByClassName("row-2 col-6")[0].value = 9;
    document.getElementsByClassName("row-3 col-0")[0].value = 5;
    document.getElementsByClassName("row-3 col-1")[0].value = 1;
    document.getElementsByClassName("row-3 col-4")[0].value = 3;
    document.getElementsByClassName("row-3 col-8")[0].value = 7;
    document.getElementsByClassName("row-4 col-3")[0].value = 9;
    document.getElementsByClassName("row-4 col-5")[0].value = 5;
    document.getElementsByClassName("row-5 col-0")[0].value = 6;
    document.getElementsByClassName("row-5 col-4")[0].value = 2;
    document.getElementsByClassName("row-5 col-7")[0].value = 4;
    document.getElementsByClassName("row-5 col-8")[0].value = 5;
    document.getElementsByClassName("row-6 col-2")[0].value = 4;
    document.getElementsByClassName("row-6 col-5")[0].value = 7;
    document.getElementsByClassName("row-6 col-6")[0].value = 5;
    document.getElementsByClassName("row-6 col-7")[0].value = 2;
    document.getElementsByClassName("row-7 col-3")[0].value = 5;
    document.getElementsByClassName("row-7 col-5")[0].value = 9;
    document.getElementsByClassName("row-7 col-7")[0].value = 7;
    document.getElementsByClassName("row-7 col-8")[0].value = 1;
    document.getElementsByClassName("row-8 col-0")[0].value = 7;
    document.getElementsByClassName("row-8 col-2")[0].value = 9;
    document.getElementsByClassName("row-8 col-3")[0].value = 2;
    document.getElementsByClassName("row-8 col-6")[0].value = 4;
    document.getElementsByClassName("row-8 col-7")[0].value = 8;
  }
  if (level = 3) {
    document.getElementsByClassName("row-0 col-1")[0].value = 8;
    document.getElementsByClassName("row-0 col-7")[0].value = 7;
    document.getElementsByClassName("row-1 col-0")[0].value = 9;
    document.getElementsByClassName("row-1 col-3")[0].value = 5;
    document.getElementsByClassName("row-1 col-4")[0].value = 6;
    document.getElementsByClassName("row-1 col-5")[0].value = 3;
    document.getElementsByClassName("row-2 col-1")[0].value = 5;
    document.getElementsByClassName("row-2 col-3")[0].value = 7;
    document.getElementsByClassName("row-3 col-2")[0].value = 3;
    document.getElementsByClassName("row-3 col-5")[0].value = 1;
    document.getElementsByClassName("row-3 col-6")[0].value = 9;
    document.getElementsByClassName("row-3 col-8")[0].value = 4;
    document.getElementsByClassName("row-4 col-0")[0].value = 2;
    document.getElementsByClassName("row-4 col-8")[0].value = 5;
    document.getElementsByClassName("row-5 col-0")[0].value = 8;
    document.getElementsByClassName("row-5 col-2")[0].value = 1;
    document.getElementsByClassName("row-5 col-3")[0].value = 2;
    document.getElementsByClassName("row-5 col-6")[0].value = 6;
    document.getElementsByClassName("row-6 col-5")[0].value = 8;
    document.getElementsByClassName("row-6 col-7")[0].value = 1;
    document.getElementsByClassName("row-7 col-3")[0].value = 9;
    document.getElementsByClassName("row-7 col-4")[0].value = 2;
    document.getElementsByClassName("row-7 col-5")[0].value = 6;
    document.getElementsByClassName("row-7 col-8")[0].value = 3;
    document.getElementsByClassName("row-8 col-1")[0].value = 3;
    document.getElementsByClassName("row-8 col-7")[0].value = 6;
  }
}

//this script is run when the page loads
function setUpPuzzle() {
  var node;
  for (var i = 0; i < 9; i ++) {
    //creating the arrays within arrays
    puzzleClues[i] = [];
    possibles[i] = [];
    for (var j = 0; j < 9; j ++) {
      //creating the board
      node = document.createElement("input");
      node.type = "text"
      node.classList.add("col-" + j);
      node.classList.add("row-" + i);
      node.classList.add("square");
      document.getElementsByClassName("puzzle")[0].appendChild(node);
      //more array setup stuff
      puzzleClues[i][j] = 0;
      possibles[i][j] = [];
    }
  }
  document.getElementsByClassName("solvebutton")[0].addEventListener('click',solvePuzzle);
  //more array setup stuff
  for (var i = 0; i < 3; i ++) {
    toCheck[i] = [];
    alreadyContains[i] = [];
    for (var j = 0; j < 9; j ++) {
      toCheck[i][j] = true;
      alreadyContains[i][j] = [];
    }
  }
  //loads an example sudoku
  getSudoku(3);
}

function solvePuzzle() {
  //this function adds all the inputs into an array and returns true if there are no issues
  if (getPuzzle()) {
    //this function adds all the possible values into an array
    getPossibles();

    searchForSolutions();

  }
  alert('done');
}

function searchForSolutions() {

  do {
    do {
      do {
        console.log("searching cells");
        //checks each individual cell and repeats if at least one was found
      } while (searchCells());
      console.log("searching rows, columns etc");
      //checks each row, column and sector (that needs to be checked) and restarts if at least one is found
    } while (checkPossibles2());
    console.log("resorting to last resort");
    //checks last resort function to narrow down possibilities.  This function stops and returns true as soon as anything is found
  } while (lastResort())
}

function searchCells() {
  var result = false;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      checkCell(i,j);
      result = true;
    }
  }
  return result;
}

function checkPossibles2() {
  var result = false;
  if (checkRows()) {
    result = true;
  }
  if (checkCols()) {
    result = true;
  }
  if (checkSectors()) {
    result = true;
  }
  return result;
}


function getPuzzle() {

  var noIssues = true;
  var node;
  for (var i = 0; i < 9; i ++) {
    for (var j = 0; j < 9; j ++) {
      //gets each square, one at a time
      node = document.getElementsByClassName("col-" + j + " row-" + i)[0];
      //if a non-number is entered, the function will return false
      if (isNaN(Number(node.value))) {
        node.classList.add("error");
        noIssues = false;
      }
      //if the number is too long or short, the function will return false
      else if ((Number(node.value) > 9)||(Number(node.value) < 0)) {
        node.classList.add("error");
        noIssues = false
      }
      //otherwise the function will add all the entered numbers into an array
      else {
        node.classList.remove("error");
        puzzleClues[i][j] = Number(node.value);
        if (node.value > 0) {
          updateContainsArray(i,j,node.value);
        }
      }
    }
  }
  //returns true if all the inputs were correct or empty
  return noIssues;
}

function updateContainsArray(rowNo,colNo,squareValue) {
  alreadyContains[0][rowNo].push(squareValue);
  alreadyContains[1][colNo].push(squareValue);
  alreadyContains[2][(rowNo - rowNo % 3) + (colNo - colNo % 3) / 3].push(squareValue);
}


function getRow(rowNo, colNo) {
  var rowContents = [];
  for (var i = 0; i < 9; i++) {
    rowContents[rowContents.length] = puzzleClues[rowNo][i];
  }
  return rowContents;
}

function getCol(rowNo, colNo) {
  var columnContents = [];
  for (var i = 0; i < 9; i++) {
    columnContents[columnContents.length] = puzzleClues[i][colNo];
  }
  return columnContents;
}

function getSector(rowNo, colNo) {
  var sectorContents = [];
  var rowCorner = rowNo - rowNo % 3;
  var colCorner = colNo - colNo % 3;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      sectorContents[SectorContents.length] = puzzleClues[rowCorner+j][colCorner+i];
    }
  }
}

function getPossibles() {
  //Adds all possibles into each array if there is not already a clue
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j ++) {
      if (puzzleClues[i][j] === 0) {
        for (var k = 0; k < 9; k ++) {
          possibles[i][j][k] = k + 1;
        }
      }
    }
  }

  //Removes possibles based on each clue
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (puzzleClues[i][j] > 0) {
        removePossible(i,j,puzzleClues[i][j]);
      }
    }
  }
}


function removePossible(rowNo, colNo, squareValue) {
  removePossibleFromRow(rowNo,colNo, squareValue);
  removePossibleFromCol(rowNo,colNo,squareValue);
  removePossibleFromSector(rowNo,colNo,squareValue);
}

function removePossibleFromRow(rowNo, colNo, squareValue) {
  for (var i = 0; i < 9; i++) {
    if (possibles[rowNo][i].indexOf(squareValue) !== -1) {
      possibles[rowNo][i].splice(possibles[rowNo][i].indexOf(squareValue),1)
    }
  }
}

function removePossibleFromCol(rowNo, colNo, squareValue) {
  for (var i = 0; i < 9; i++) {
    if (possibles[i][colNo].indexOf(squareValue) !== -1) {
      possibles[i][colNo].splice(possibles[i][colNo].indexOf(squareValue),1)
    }
  }
}
function removePossibleFromSector(rowNo, colNo, squareValue) {
  var rowCorner = rowNo - rowNo % 3;
  var colCorner = colNo - colNo % 3;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (possibles[i+rowCorner][j+colCorner].indexOf(squareValue) !== -1) {
        possibles[i+rowCorner][j+colCorner].splice(possibles[i+rowCorner][j+colCorner].indexOf(squareValue),1)
      }
    }
  }
}

//updates clue array and board
function setValue(rowNo, colNo, squareValue) {
  document.getElementsByClassName("row-" + rowNo + " col-" + colNo)[0].value = squareValue;
  updateContainsArray(rowNo,colNo,squareValue);
  puzzleClues[rowNo][colNo] = squareValue;
  possibles[rowNo][colNo] = [];
}

//updates the array of lines to check
function reCheck(rowNo,colNo) {
  toCheck[0][rowNo] = true;
  toCheck[1][colNo] = true;
  toCheck[2][(rowNo - rowNo % 3) + (colNo - colNo % 3) / 3] = true;
  goThroughAgain = true;
}


//checks to see if there is only one possible value the cell could contain
function checkCell(rowNo,colNo) {
  if (possibles[rowNo][colNo].length === 1) {
    var squareValue = possibles[rowNo][colNo][0]
    console.log("zero " + rowNo + "," + colNo + "," + squareValue)
    setValue(rowNo,colNo,squareValue);
    removePossible(rowNo,colNo,squareValue)
    reCheck(rowNo,colNo);
    return true;
  }
  else {
    return false;
  }
}

function checkRows() {
  var result = false;
  for (var i = 0; i < 9; i++) {
    if (checkRow(i)) {
      result = true;
    }
  }
  return result;
}

function checkCols() {
  var result = false;
  for (var i = 0; i < 9; i++) {
    if (checkCol(i)) {
      result = true;
    }
  }
  return result;
}
function checkSectors() {
  var result = false;
  for (var i = 0; i < 9; i++) {
    if (checkSector(i)) {
      result = true;
    }
  }
  return result;
}

function checkRow(rowNo) {
  var result = false;
  var counter;
  var cellId;
  for (var i = 0; i < 9; i++) {
    if (alreadyContains[0][rowNo].indexOf(i) === -1) {
      counter = 0;
      for (var j = 0; j < 9; j++) {
        if (possibles[rowNo][j].indexOf(i) !== -1) {
          counter ++;
          cellId = j;
        }
      }
      if (counter === 1) {
        console.log("one " + rowNo+","+cellId+","+i);
        setValue(rowNo,cellId,i);
        removePossible(rowNo,cellId,i);
        reCheck(rowNo,cellId);
        result = true;
      }
    }
  }
  return result;
}

function checkCol(colNo) {
  var result = false;
  var counter;
  var cellId;
  for (var i = 0; i < 9; i++) {
    if (alreadyContains[1][colNo].indexOf(i) === -1) {
      counter = 0;
      for (var j = 0; j < 9; j++) {
        if (possibles[j][colNo].indexOf(i) !== -1) {
          counter ++;
          cellId = j;
        }
      }
      if (counter === 1) {
        console.log("two " + cellId+","+colNo+","+i);
        setValue(cellId,colNo,i);
        removePossible(cellId,colNo,i);
        reCheck(cellId,colNo);
        result = true;
      }
    }
  }
  return result;
}

function checkSector(sectorNo) {
  var result = false;
  var rowCorner = sectorNo - sectorNo % 3;
  var colCorner = (sectorNo - rowCorner) * 3;
  var counter;
  var cellRow;
  var cellCol;
  for (var i = 0; i < 9; i++) {
    if (alreadyContains[2][sectorNo].indexOf(i) === -1) {
      counter = 0;
      for (var j = 0; j < 3; j ++) {
        for (var k = 0; k < 3; k++) {
          if (possibles[rowCorner+j][colCorner+k].indexOf(i) !== -1) {
            counter ++;
            cellRow = rowCorner+j;
            cellCol = colCorner+k;
          }
        }
      }
      if (counter === 1) {
        console.log("three " + cellRow+","+cellCol+","+i);
        setValue(cellRow,cellCol,i);
        removePossible(cellRow,cellCol,i);
        reCheck(cellRow,cellCol);
        result = true;
      }
    }
  }
  return result;
}

function lastResort() {
  //for each row, column and then sector

    //gets a list of numbers that are still to appear

    //for each number from 2 to 1 - number of empty cells

      //picks that many different numbers

      //gets a list of all cells that still have the possibility of being those numbers

      //if the number of cells those numbers could appear in is x then

        //removes all extra numbers from those cells

        //function returns and the usual seach functions are continued
}
