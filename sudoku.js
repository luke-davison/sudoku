
//loads the start script
document.addEventListener('DOMContentLoaded', setUpPuzzle);

//this array will store the clues (and answers) [array of rows][array of columns][value of cell]
var puzzleClues = []
//this array will store the possible numbers for each cell [array of rows][array of columns][array of possible values]
var possibles = []
//this array stores the rows, columns and sectors that need to be checked or rechecked.  Each index contains a pair of variables [the type (0 = row, 1 = column, 2 = sector)][the number]
var toCheck = [];
//a variable which stores whether the current loop needs to be repeated
var emptySquares = 81;
//an array which stores the values that are not yet in each row, column or sector [0 = row, 1 = column, 2 = sector][row, column or sector number][array of values]
var doesntContain = [];


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
    doesntContain[i] = [];
    for (var j = 0; j < 9; j ++) {
      toCheck.push([i,j]);
      doesntContain[i][j] = [];
      for (var k = 0; k < 9; k ++) {
        doesntContain[i][j].push(k+1);
      }
    }
  }
  //loads an example sudoku
  //getSudoku(3);
}

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

function solvePuzzle() {
  //this function adds all the inputs into an array and returns true if there are no issues
  if (getPuzzle()) {
    //this function adds all the possible values into an array
    getPossibles();
    //this is the main function to solve the sudoku
    searchForSolutions();

  }
  alert('done');
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
          updateContainsArray(i,j,Number(node.value));
          emptySquares --;
        }
      }
    }
  }
  //returns true if all the inputs were correct or empty
  return noIssues;
}

//this function fills the possibles array
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

//the main function used to solve the puzzle
function searchForSolutions() {

  do {
    do {
      do {
        //stops the function when the solution is found
        if (emptySquares === 0) {
          return;
        }
        console.log("searching cells");
        //checks each individual cell and repeats if at least one was found
      } while (searchCells());
      console.log("searching rows, columns etc");
      //checks each row, column and sector (that needs to be checked) and restarts if at least one is found
    } while (searchRowsEtc());
    console.log("resorting to last resort");
    //checks last resort function to narrow down possibilities.  This function stops and returns true as soon as anything is found
  } while (lastResort())
}

//this function searches each cell to check if there is only one possible solution
function searchCells() {
  var result = false;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j ++) {
      if (checkCell(i,j)) {
        result = true;
      }
    }
  }
  return result;
}

//this function searches each row, column and sector to check if any of them have only one square where a certain number is possible.
function searchRowsEtc() {
  var checking;
  var result = false;
  for (var i = 0; i < toCheck.length; i) {
    console.log(toCheck[0][0] + "," + toCheck[0][1])
    checking = toCheck.shift();
    switch (checking[0]) {
      case 0:
        if (checkRow(checking[1])) {
          result = true;
        }
        break;
      case 1:
        if (checkCol(checking[1])) {
          result = true;
        }
        break;
      case 2:
        if (checkSector(checking[1])) {
          result = true;
        }
        break;
    }
  }
  //returns true if any soluntions were found
  return result;
}

/*
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
}*/

//this function updates everything whenever a soluntion is found
function setValue(rowNo, colNo, squareValue) {
  document.getElementsByClassName("row-" + rowNo + " col-" + colNo)[0].value = squareValue;
  updateContainsArray(rowNo,colNo,squareValue);
  removePossible(rowNo,colNo,squareValue);
  reCheck(rowNo,colNo);
  puzzleClues[rowNo][colNo] = squareValue;
  possibles[rowNo][colNo] = [];
  emptySquares --;
}

//this function updates the doesntContain array
function updateContainsArray(rowNo,colNo,squareValue) {
  doesntContain[0][rowNo].splice(doesntContain[0][rowNo].indexOf(squareValue),1);
  doesntContain[1][colNo].splice(doesntContain[1][colNo].indexOf(squareValue),1)
  doesntContain[2][(rowNo - rowNo % 3) + (colNo - colNo % 3) / 3].splice(doesntContain[2][(rowNo - rowNo % 3) + (colNo - colNo % 3) / 3].indexOf(squareValue),1)
}

//this function removes all possibles when a solution is found
function removePossible(rowNo, colNo, squareValue) {
  removePossibleFromRow(rowNo,colNo, squareValue);
  removePossibleFromCol(rowNo,colNo,squareValue);
  removePossibleFromSector(rowNo,colNo,squareValue);
}

//this function removes the possible from a particular row
function removePossibleFromRow(rowNo, colNo, squareValue) {
  for (var i = 0; i < 9; i++) {
    if (possibles[rowNo][i].indexOf(squareValue) !== -1) {
      possibles[rowNo][i].splice(possibles[rowNo][i].indexOf(squareValue),1)
    }
  }
}

//this function removes the possible from a particular column
function removePossibleFromCol(rowNo, colNo, squareValue) {
  for (var i = 0; i < 9; i++) {
    if (possibles[i][colNo].indexOf(squareValue) !== -1) {
      possibles[i][colNo].splice(possibles[i][colNo].indexOf(squareValue),1)
    }
  }
}

//this function removes the possible from a particular sector
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

//updates the array of lines to check
function reCheck(rowNo,colNo) {
  toCheck.push([0,rowNo]);
  toCheck.push([1,colNo]);
  toCheck.push([2,(rowNo - rowNo % 3) + (colNo - colNo % 3) / 3]);
}


//checks to see if there is only one possible value the cell could contain
function checkCell(rowNo,colNo) {
  if (possibles[rowNo][colNo].length === 1) {
    var squareValue = possibles[rowNo][colNo][0]
    console.log("Cell: " + rowNo+","+colNo+","+squareValue);
    setValue(rowNo,colNo,squareValue);
    return true;
  }
  return false;
}

function checkRows() {
  var result = false;
  for (var i = 0; i < toCheck[0].length; i++) {
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
    if (doesntContain[0][rowNo].indexOf(i) !== -1) {
      counter = 0;
      for (var j = 0; j < 9; j++) {
        if (possibles[rowNo][j].indexOf(i) !== -1) {
          counter ++;
          cellId = j;
        }
      }
      if (counter === 1) {
        console.log("Row: " + rowNo+","+cellId+","+i);
        setValue(rowNo,cellId,i);
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
    if (doesntContain[1][colNo].indexOf(i) !== -1) {
      counter = 0;
      for (var j = 0; j < 9; j++) {
        if (possibles[j][colNo].indexOf(i) !== -1) {
          counter ++;
          cellId = j;
        }
      }
      if (counter === 1) {
        console.log("Column: " + cellId+","+colNo+","+i);
        setValue(cellId,colNo,i);
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
    if (doesntContain[2][sectorNo].indexOf(i) !== -1) {
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
        console.log("Sector: " + cellRow+","+cellCol+","+i);
        setValue(cellRow,cellCol,i);
        result = true;
      }
    }
  }
  return result;
}

function lastResort() {
  //this variable keeps track of the number of values currently looking for
  var numValues = 2;
  //this variable contains an array of the values currently looking for
  var theseValues = [];
  //this variable is temporarily used to grab the values from the doesntContain array
  var theseValues2 = [];
  //this variable contains a list of all the cells that require those values
  var theseCells = [];
  //is used to count which combination of values we are currently checking
  var countArray = [];
  var countLevel = 0;
  //this array is used to grab the empty cells in the row
  var empties = [];
  //for each row, column and then sector
  for (var searchingType = 0; searchingType < 3; searchingType++) {
    for (var searchingValue = 0; searchingValue < 9; searchingValue++) {
      //gets the empy cells
      empties = getEmpties(searchingType,searchingValue);

      //need to make sure I reset the variables

      //gets a list of numbers that are still to appear
      //for each number from 2 to (1 - number of empty cells)
      numValues = 2;
      while (numValues < doesntContain[searchingType][searchingValue].length) {
        theseValues2 = doesntContain[searchingType][searchingValue];
        //picks that many different numbers
        countArray = [];
        theseValues = [];

        for (var i = 0; i < numValues; i++) {
          countArray[i] = i;
        }

        while (countArray[0] <= doesntContain[searchingType][searchingValue].length - numValues) {
          //gets the cells that the chosen values (in the countArray)
          theseCells = [];
          for (var i = 0; i < numValues; i++) {
            theseValues[i] = theseValues2[countArray[i]];
          }

          for (var i = 0; i < theseValues.length; i++) {
            for (var j = 0; j < empties.length; j++) {
              //gets a list of all cells that still have the possibility of being those numbers
              if (possibles[empties[j][0]][empties[j][1]].indexOf(theseValues[i]) != -1) {
                if (theseCells.indexOf(j) === -1) {
                  theseCells.push(j);
                }
              }
            }
          }

          //if the number of cells those numbers could appear in is x then
          if (theseCells.length === numValues) {
            var doneYet = false;
            //removes all extra numbers from those cells
            for (var i = 0; i < theseCells.length; i++) {
              for (var j = 0; j < possibles[empties[theseCells[i]][0]][empties[theseCells[i]][1]].length; j++) {
                var temp1 = possibles[empties[theseCells[i]][0]][empties[theseCells[i]][1]][j];
                var temp = theseValues.indexOf(possibles[empties[theseCells[i]][0]][empties[theseCells[i]][1]][j]);
                if (theseValues.indexOf(possibles[empties[theseCells[i]][0]][empties[theseCells[i]][1]][j]) === -1) {
                  console.log("splicing " + possibles[empties[theseCells[i]][0]][empties[theseCells[i]][1]][j] + " from " + empties[theseCells[i]][0] + "," + empties[theseCells[i]][1]);
                  possibles[empties[theseCells[i]][0]][empties[theseCells[i]][1]].splice(j,1);
                  j --;
                  doneYet = true;
                  reCheck(empties[theseCells[i]][0],empties[theseCells[i]][1]);
                }
              }
            }
            //function returns and the usual seach functions are continued
            if (doneYet === true) {
              return true;
            }
          }

          //gets the next set of numbers
          if (countArray[countArray.length-1] === doesntContain[searchingType][searchingValue].length - 1) {
            countLevel = countArray.length-2;
            while (countArray[countLevel] === countArray[countLevel+1]-1) {
              countLevel --;
            }
            countArray[countLevel] ++;
            while (countLevel < countArray.length - 1) {
              countLevel ++;
              countArray[countLevel] = countArray[countLevel-1] + 1;
            }
          }
          else {
            countArray[countArray.length-1] ++;
          }
        }
        numValues ++;
      }
    }
  }

}

function getEmpties(searchingType,searchingValue) {
  var result = [];
  var cellRow;
  var cellCol;
  for (var i = 0; i < 9; i ++) {
    switch (searchingType) {
      case 0:
        cellRow = searchingValue;
        cellCol = i;
        break;
      case 1:
        cellRow = i;
        cellCol = searchingValue;
        break;
      case 2:
        cellRow = searchingValue - searchingValue % 3 + (i - i % 3) / 3;
        cellCol = (searchingValue % 3) * 3 + i % 3;
        break;
    }
    if (puzzleClues[cellRow][cellCol] === 0) {
      result.push([cellRow,cellCol]);
    }
  }
  return result;
}
