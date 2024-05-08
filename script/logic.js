// Handles the left-click event on cells
function cellClicked(row, col) {
  console.log('Left-clicked on cell')
  if (gGame.isOn) {
    if (isFirstClick) {
      isFirstClick = false
      startTimer()
      addMines(row, col)
      setMinesNegsCount()
    }
    const cell = gBoard[row][col]
    if (!cell.isMarked && !cell.isShown) {
      cell.isShown = true
      if (cell.isMine) {
        gameOver()
      } else {
        if (cell.minesAroundCount === 0) {
          expandShown(row, col)
        }
        checkWin()
      }
      renderBoard()
    }
  }
}

// Handles the right-click event to mark cells with flags
function cellMarked(row, col) {
  console.log('Right-clicked on cell')
  const cell = gBoard[row][col]
  if (!cell.isShown && gGame.isOn) {
    cell.isMarked = !cell.isMarked
    updateFlagCount()
    renderBoard()
  }
  return false
}

// Checks if all non-mine cells are revealed and declares a win
function checkWin() {
  console.log('Checking win condition')
  let revealedCount = 0
  for (let i = 0; i < gLevel.SIZE; i++) {
    for (let j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isShown && !gBoard[i][j].isMine) {
        revealedCount++
      }
    }
  }
  if (revealedCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
    stopTimer()
    gGame.isOn = false
    updateSmileyIcon('win')
    updateGameStatus('You win!')
    renderBoard()
  }
}

// Ends the game and reveals all mines
function gameOver() {
  console.log('Game over...')
  stopTimer()
  gGame.isOn = false
  revealAllMines()
  updateSmileyIcon('lose')
  updateGameStatus('Game Over!')
  renderBoard()
}

// Reveals all mines when the game is over
function revealAllMines() {
  console.log('Revealing all mines')
  for (let i = 0; i < gLevel.SIZE; i++) {
    for (let j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
      }
    }
  }
  renderBoard()
}

// Expands revealed areas automatically when a cell with zero adjacent mines is clicked
function expandShown(row, col) {
  console.log('Expanding shown cells')
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE && !gBoard[i][j].isShown && !gBoard[i][j].isMarked && !gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        if (gBoard[i][j].minesAroundCount === 0) {
          expandShown(i, j)
        }
      }
    }
  }
}

// Adds mines randomly on the board, ensuring the first click is always safe
function addMines(firstClickRow, firstClickCol) {
  console.log('Adding mines to the board')
  let minesAdded = 0
  while (minesAdded < gLevel.MINES) {
    let i = Math.floor(Math.random() * gLevel.SIZE)
    let j = Math.floor(Math.random() * gLevel.SIZE)
    if (!gBoard[i][j].isMine && i !== firstClickRow && j !== firstClickCol) {
      gBoard[i][j].isMine = true
      minesAdded++
    }
  }
}

// Counts the number of mines adjacent to each cell and updates the board state
function setMinesNegsCount() {
  console.log('Counting neighboring mines')
  for (let i = 0; i < gLevel.SIZE; i++) {
    for (let j = 0; j < gLevel.SIZE; j++) {
      if (!gBoard[i][j].isMine) {
        gBoard[i][j].minesAroundCount = countNeighbors(i, j)
      }
    }
  }
}

// Calculates the number of mines around a specific cell
function countNeighbors(row, col) {
  console.log('Counting neighboring mines for cell')
  let count = 0
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
        if (gBoard[i][j].isMine) {
          count++
        }
      }
    }
  }
  return count
}
