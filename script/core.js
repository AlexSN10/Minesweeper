// Global variables
let gBoard
let gLevel = { SIZE: 4, MINES: 2 } // Default difficulty
let gGame
let isFirstClick = true
let timerInterval

// Initialize game
function init() {
  console.log('Initializing game')
  gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
  buildBoard()
  renderBoard()
  document.getElementById('smile-button').addEventListener('click', resetGame)
  setLevel('beginner')
  updateGameStatus('Right-click to place flags, left-click to reveal cells.')
}

window.onload = init
