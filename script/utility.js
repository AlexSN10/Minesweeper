// Updates the count of flagged cells and refreshes the display
function updateFlagCount() {
  console.log('Updating flag count')
  let flagCount = 0
  for (let row of gBoard) {
    for (let cell of row) {
      if (cell.isMarked) {
        flagCount++
      }
    }
  }
  gGame.flagCount = flagCount
  document.getElementById('flag-count').textContent = `Flags: ${gGame.flagCount}`
}

// Changes the smiley icon based on the game state
function updateSmileyIcon(state) {
  console.log('Updating smiley icon')
  const smileButton = document.getElementById('smile-button').getElementsByTagName('img')[0]

  switch(state) {
    case 'play':
      smileButton.src = 'img/play.gif'
      updateGameStatus('Right-click to place flags, left-click to reveal cells.')
      break
    case 'win':
      smileButton.src = 'img/win.gif'
      updateGameStatus('Congratulations! You win!')
      break
    case 'lose':
      smileButton.src = 'img/lose.gif'
      updateGameStatus('Game Over! Try again.')
      break
  }
}

// Displays a new game status message
function updateGameStatus(message) {
  console.log('Updating game status')
  const gameStatusElement = document.getElementById('game-status')
  gameStatusElement.textContent = message
}

// Temporarily reveals all mines on the board for set time (1000 = 1sec)
function revealMinesTemporarily() {
  console.log('Revealing mines temporarily')
  const gameBoard = document.getElementById('game-board')
  let tempRevealedCells = []
  for (let i = 0; i < gLevel.SIZE; i++) {
    for (let j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        const cell = gameBoard.children[i].children[j]
        cell.classList.add('temp-reveal')
        cell.innerHTML = '&#128163;'
        tempRevealedCells.push(cell)
      }
    }
  }
  setTimeout(() => {
    tempRevealedCells.forEach(cell => {
      cell.classList.remove('temp-reveal')
      cell.innerHTML = ''
    })
  }, 10000) 
}
