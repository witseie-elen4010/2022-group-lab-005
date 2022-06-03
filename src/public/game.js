'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

/** ********* Variables ***********/
let letterArray = [
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', '']
]

let colorArray = [
  ['d', 'd', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd', 'd']
]

let currentWordCheck = ['X', 'X', 'X', 'X', 'X']
let currentWordIndex = 0
let currentLetterIndex = 0
const allLettersArray = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
let allLettersColorsArray = ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'D', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd']

/** ********* Socket.io events ***********/
const socket = io({ autoConnect: false })

// This will fire if the server is unhappy with something.
socket.on('connect_error', (err) => {
  if (err.message === 'invalid_game_id') {
    console.log('Game code is invalid.')
  } else if (err.message === 'game_already_running') {
    console.log('You cannot join a game that is already in progress!')
  }
})

// When this is fired, the server is telling us that it is waiting for more players to join.
// So, we show the loading icon so that the player knows.
socket.on('waiting_for_players', () => {
  document.getElementById('spinner').style.display = 'block'
})

// This will fire when the server tells the clients that the right number of players have joined the game.
// There must be a more elegant solution than this implementation.
let gameStart = false
socket.on('game_can_start', () => {
  if (gameStart === false) {
    // Now that everyone has connected, we can start the game.
    // Updates the page on window load to display the default wordle table and keyboard table
    // Also attach the event listener for the keydown event so the user can use their keyboard.
    // Also remove the loading icon.
    document.getElementById('spinner').style.display = 'none'
    document.addEventListener('keydown', keyboardInputEvent)
    updateWordleTableText()
    updateWordleTableColor()
    updateKeyboard()
    createKeyboard()
    gameStart = true
  }
})

// This will fire when the server sends the opponents' colours to the client.
socket.on('update_opponent_colors', (colorArr, didTheyWin, playerName, playerNum) => {
  if (didTheyWin) {
    // Disable the keyboard.
    document.removeEventListener('keydown', keyboardInputEvent)
    document.getElementById('winner').innerHTML = `${playerName} won the game!`
    socket.emit('game_over')
  }

  updateOpponentColors(colorArr, playerNum)
})

// This will fire when the server sends the results of the word validation and testing to the client.
// This basically contains the results of the game logic on the server.
socket.on('update_player_screen', (letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin) => {
  currentLetterIndex = 0
  letterArray = letterArr
  currentWordIndex = currWordIndex + 1 // Move the keyboard to the next row on the grid.
  colorArray = colorArr
  currentWordCheck = currWordCheck
  allLettersColorsArray = allLettersColorsArr

  if (didTheyWin) {
    // Disable the keyboard.
    document.removeEventListener('keydown', keyboardInputEvent)
    document.getElementById('winner').innerHTML = 'You won the game!'
    socket.emit('game_over')
  }

  updateWordleTableColor()
  updateKeyboard()
})

/** ********* General code ***********/

// This is used to identify the user. It will be replaced with the identity from the login system.
const gameID = prompt('Please enter your game ID', 'ID')
// Last digit of gameID is the number of players!

const userName = prompt('Please enter your username', 'Username')

// Try establish a connection with the server.
socket.auth = { sessionInfo: gameID, playerName: userName }
socket.connect()

// Updates the color currently displayed in this user's wordle table
function updateWordleTableColor () {
  const table = document.getElementById('wordleTable')
  // const tempColor = 'grey'
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      switch (colorArray[i][j]) {
        case 'd':
        case 'D':
          table.rows[i].cells[j].style.backgroundColor = 'lightgrey'
          break
        case 'n':
        case 'N':
          table.rows[i].cells[j].style.backgroundColor = 'grey'
          break
        case 'i':
        case 'I':
          table.rows[i].cells[j].style.backgroundColor = 'yellow'
          break
        case 'c':
        case 'C':
          table.rows[i].cells[j].style.backgroundColor = 'green'
          break
      }
    }
  }
}

function updateOpponentColors (arrayOfColors, playerNum) {
  let table = document.getElementById(`opponent${playerNum}Table`)

  //const table = document.getElementById('opponentColorTable')
  // const tempColor = 'grey'
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      switch (arrayOfColors[i][j]) {
        case 'd':
        case 'D':
          table.rows[i].cells[j].style.backgroundColor = 'lightgrey'
          break
        case 'n':
        case 'N':
          table.rows[i].cells[j].style.backgroundColor = 'grey'
          break
        case 'i':
        case 'I':
          table.rows[i].cells[j].style.backgroundColor = 'yellow'
          break
        case 'c':
        case 'C':
          table.rows[i].cells[j].style.backgroundColor = 'green'
          break
      }
    }
  }
}

// Updates the text currently displayed in this user's wordle table
function updateWordleTableText () {
  const table = document.getElementById('wordleTable')
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      table.rows[i].cells[j].innerHTML = letterArray[i][j]
    }
  }
}

// Updates the variable keeping track of what letter the user is on
function incrementLetterIndex () {
  if (currentLetterIndex < 4) {
    currentLetterIndex = currentLetterIndex + 1
  } else {
    socket.emit('send_guess', letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray)
  }
}

// Initialize the on-screen keyboard with the correct innerHTML and default grey colors
function createKeyboard () {
  const keyboardTable = document.getElementById('keyboardTable')
  let count = 0

  for (let i = 0; i < keyboardTable.rows.length; i++) {
    for (let j = 0; j < keyboardTable.rows[i].cells.length; j++) {
      keyboardTable.rows[i].cells[j].innerHTML = allLettersArray[count]
      keyboardTable.rows[i].cells[j].style.backgroundColor = 'lightgrey'
      count = count + 1
    }
  }
}

// Updates the on-screen keyboard's colors
function updateKeyboard () {
  const keyboardTable = document.getElementById('keyboardTable')
  let count = 0
  for (let i = 0; i < keyboardTable.rows.length; i++) {
    for (let j = 0; j < keyboardTable.rows[i].cells.length; j++) {
      switch (allLettersColorsArray[count]) {
        case 'd':
        case 'D':
          keyboardTable.rows[i].cells[j].style.backgroundColor = 'lightgrey'
          break
        case 'n':
        case 'N':
          keyboardTable.rows[i].cells[j].style.backgroundColor = 'grey'
          break
        case 'i':
        case 'I':
          keyboardTable.rows[i].cells[j].style.backgroundColor = 'yellow'
          break
        case 'c':
        case 'C':
          keyboardTable.rows[i].cells[j].style.backgroundColor = 'green'
          break
      }
      count = count + 1
    }
  }
}

function keyboardInputEvent (event) {
  if (event.key === 'Backspace') {
    if (currentLetterIndex > 0) {
      currentLetterIndex = currentLetterIndex - 1
    }
    letterArray[currentWordIndex][currentLetterIndex] = ''
    updateWordleTableText()
  } else {
    for (let i = 0; i < allLettersArray.length; i++) {
      if (event.key.toUpperCase() === allLettersArray[i]) {
        letterArray[currentWordIndex][currentLetterIndex] = event.key.toUpperCase()
        updateWordleTableText()
        incrementLetterIndex()
      }
    }
  }
}
