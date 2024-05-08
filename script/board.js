// Build game board
function buildBoard() {
  console.log('Building game board')
  gBoard = []
  for (let i = 0; i < gLevel.SIZE; i++) {
    gBoard.push([])
    for (let j = 0; j < gLevel.SIZE; j++) {
      gBoard[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
    }
  }
}

// Render game board
function renderBoard() {
  console.log('Rendering game board')
  const gameBoard = document.getElementById('game-board')
  gameBoard.innerHTML = ''
  for (let i = 0; i < gLevel.SIZE; i++) {
    const row = document.createElement('div')
    row.className = 'row'
    for (let j = 0; j < gLevel.SIZE; j++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      if (gBoard[i][j].isShown) {
        cell.classList.add('revealed')
        if (gBoard[i][j].isMine) {
          cell.innerHTML = '&#128163;'
        } else if (gBoard[i][j].minesAroundCount > 0) {
          cell.textContent = gBoard[i][j].minesAroundCount
        }
      } else if (gBoard[i][j].isMarked) {
        cell.textContent = '🚩'
      }
      cell.addEventListener('click', () => cellClicked(i, j))
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        cellMarked(i, j)
      })
      row.appendChild(cell)
    }
    gameBoard.appendChild(row)
  }
}
