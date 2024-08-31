const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('#result')
const startButton = document.querySelector('#start-button')
const restartButton = document.querySelector('#restart-button')

let currentShooterIndex = 210
let width = 20
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let result = 0
let gameStarted = false

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54
]

for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

function drawInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}

function removeInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    removeInvaders()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    drawInvaders()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        gameOver('Game Over!')
        return
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] >= squares.length - width) {
            startButton.innerHTML = 'Restart'
            gameOver('Game Over!')
            return
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        startButton.innerHTML = 'Restart'
        gameOver('You Win!')
    }
}

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)

            const alienRemoval = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoval)
            result++
            resultsDisplay.innerHTML = result
        }
    }
    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 100)
    }
}

function gameOver(message) {
    resultsDisplay.innerHTML = message
    clearInterval(invadersId)
    document.removeEventListener('keydown', moveShooter)
    document.removeEventListener('keydown', shoot)
}

function startGame() {
    resetGame()
    drawInvaders()
    squares[currentShooterIndex].classList.add("shooter")
    invadersId = setInterval(moveInvaders, 250)
    document.addEventListener('keydown', moveShooter)
    document.addEventListener('keydown', shoot)
    startButton.blur() // Remove focus from the button
}

function resetGame() {
    clearInterval(invadersId)
    removeInvaders()
    squares.forEach(square => {
        square.classList.remove('shooter', 'laser', 'boom')
    })
    resultsDisplay.innerHTML = ''
    currentShooterIndex = 210
    direction = 1
    goingRight = true
    aliensRemoved = []
    result = 0
    gameStarted = false
    alienInvaders.splice(0, alienInvaders.length, ...[
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54
    ])
}

startButton.addEventListener('click', startGame)
