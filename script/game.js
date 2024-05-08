// Resets game & rebuilds board
function resetGame() {
  console.log('Resetting the game')
  resetTimer()
  updateFlagCount()
  isFirstClick = true
  gGame.isOn = true
  gGame.shownCount = 0
  gGame.markedCount = 0
  buildBoard()
  renderBoard()
  updateSmileyIcon('play')
}

// Set difficulty
function setLevel(difficulty) {
  console.log('Setting game level')
  switch (difficulty) {
    case 'beginner':
      gLevel.SIZE = 4
      gLevel.MINES = 2
      break
    case 'medium':
      gLevel.SIZE = 8
      gLevel.MINES = 14
      break
    case 'expert':
      gLevel.SIZE = 12
      gLevel.MINES = 32
      break
  }
  resetGame()
}

// Timer functions: start, stop, reset
function startTimer() {
  console.log('Starting timer')
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      gGame.secsPassed++
      document.getElementById('timer').textContent = `Time: ${gGame.secsPassed}`
    }, 1000)
  }
}

function stopTimer() {
  console.log('Stopping timer')
  clearInterval(timerInterval)
  timerInterval = null
}

function resetTimer() {
  console.log('Resetting timer')
  stopTimer()
  gGame.secsPassed = 0
  document.getElementById('timer').textContent = 'Time: 0'
}
