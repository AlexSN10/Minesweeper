// Global variables
let gBoard
let gLevel = { SIZE: 4, MINES: 2 } // start from beginner do not touch or it breaks
let gGame
let isFirstClick = true
let timerInterval

// start the game
function init() {
    console.log('Initializing the game...')
    gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
    buildBoard()
    renderBoard()
    document.getElementById('smile-button').addEventListener('click', resetGame)
    setLevel('beginner')
    updateGameStatus('Game ready. Right-click to place flags, left-click to reveal cells.')
}

// reset the game
function resetGame() {
    console.log('Resetting the game...')
    resetTimer()
    updateFlagCount()
    isFirstClick = true
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    buildBoard()
    renderBoard()
    updateGameStatus('Game reset. Click any cell to start.')
    updateSmileyIcon('play')
}

// set the level based on difficulty
function setLevel(difficulty) {
    console.log('Setting game level...')
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

// build the game board
function buildBoard() {
    console.log('Building game board...')
    gBoard = []
    for (let i = 0; i < gLevel.SIZE; i++) {
        gBoard.push([])
        for (let j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
}

// render the game board
function renderBoard() {
    console.log('Rendering game board...')
    const gameBoard = document.getElementById('game-board')
    gameBoard.innerHTML = '' // Clear previous board
    for (let i = 0; i < gLevel.SIZE; i++) {
        const row = document.createElement('div')
        row.className = 'row'
        for (let j = 0; j < gLevel.SIZE; j++) {
            const cell = document.createElement('div')
            cell.className = 'cell'
            if (gBoard[i][j].isShown) {
                cell.classList.add('revealed')
                if (gBoard[i][j].isMine) {
                    cell.innerHTML = '&#128163;' // mine symbol? fix to image
                } else if (gBoard[i][j].minesAroundCount > 0) {
                    cell.textContent = gBoard[i][j].minesAroundCount
                }
            } else if (gBoard[i][j].isMarked) {
                cell.textContent = '🚩' // flag emoji fix to image later
            }
            cell.addEventListener('click', () => cellClicked(i, j))
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault() // Prevent default context menu
                cellMarked(i, j)
            })
            row.appendChild(cell)
        }
        gameBoard.appendChild(row)
    }
}

// handle left-click on cell
function cellClicked(row, col) {
    console.log('Left-clicked on cell...')
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

// handle right-click to flag/unflag a cell
function cellMarked(row, col) {
    console.log('Right-clicked on cell...')
    const cell = gBoard[row][col]
    if (!cell.isShown && gGame.isOn) {
        cell.isMarked = !cell.isMarked
        updateFlagCount()
        renderBoard()
    }
    return false
}

// place mines ensuring the first click is safe
function addMines(firstClickRow, firstClickCol) {
    console.log('Adding mines to the board...')
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

// count mines around each cell
function setMinesNegsCount() {
    console.log('Counting neighboring mines...')
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount = countNeighbors(i, j)
            }
        }
    }
}

// count mines in neighboring cells
function countNeighbors(row, col) {
    console.log('Counting neighboring mines for cell...')
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

// check for win // add smiley for win condition
function checkWin() {
    console.log('Checking win condition...')
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
        updateGameStatus('You win!')
        updateSmileyIcon('win')
        renderBoard()
    }
}

// game over // add smiley for lose condition
function gameOver() {
    console.log('Game over...')
    stopTimer()
    gGame.isOn = false
    revealAllMines()
    updateGameStatus('Game Over!')
    updateSmileyIcon('lose')
    renderBoard()
}

// reeveal all mines
function revealAllMines() {
    console.log('Revealing all mines...')
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
            }
        }
    }
    renderBoard()
}

// expand zero mine count cells
function expandShown(row, col) {
    console.log('Expanding shown cells...')
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

// timer
function startTimer() {
    console.log('Starting timer...')
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            gGame.secsPassed++
            document.getElementById('timer').textContent = `Time: ${gGame.secsPassed}`
        }, 1000)
    }
}


//stoptimer
function stopTimer() {
    console.log('Stopping timer...')
    clearInterval(timerInterval)
    timerInterval = null
}

//timer reset
function resetTimer() {
    console.log('Resetting timer...')
    stopTimer()
    gGame.secsPassed = 0
    document.getElementById('timer').textContent = 'Time: 0'
}

//flag count // add maximum number of flags later
function updateFlagCount() {
    console.log('Updating flag count...')
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

//game status update // not working?
function updateGameStatus(message) {
    console.log('Updating game status...')
    const gameStatusElement = document.getElementById('game-status')
    gameStatusElement.textContent = message
}

// load game
window.onload = init
