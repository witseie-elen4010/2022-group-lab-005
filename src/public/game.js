'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

$(function () {
  checkUser(document.cookie).then(
    (result) => {
      if (result === false) {
        window.location.href = '/login'
      }
    }
  ).catch()
})

/** ********* Variables ***********/
let letterArray = [
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ']
]

let colorArray = [
  ['d', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd'],
  ['d', 'd', 'd', 'd', 'd']
]

let currentWordCheck = ['X', 'X', 'X', 'X', 'X']
let currentWordIndex = 0
let currentLetterIndex = 0
const allLettersArray = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
let allLettersColorsArray = ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd']
const playerNamesArr = []
let thisPlayerNumber = -1
let gameType = 'Standard' // Default value for Standard game type
let customOwner = false
/** ********* Socket.io events ***********/
const socket = io({ autoConnect: false })

// This will fire if the server is unhappy with something.
socket.on('connect_error', (err) => {
  document.getElementById('modalCloseButtonError').addEventListener('click', redirectToLobby)

  if (err.message === 'invalid_game_id') {
    document.getElementById('errorText').innerHTML = 'Game code is invalid.'
    $('#gameErrorModal').modal('show')
  } else if (err.message === 'game_already_running') {
    document.getElementById('errorText').innerHTML = 'You cannot rejoin a game that is in progress!'
    $('#gameErrorModal').modal('show')
  } else if (err.message === 'user_already_in_game') {
    document.getElementById('errorText').innerHTML = 'You cannot join a game that you are already in!'
    $('#gameErrorModal').modal('show')
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
socket.on('game_can_start', (playerNames) => {
  if (gameStart === false) {
    // Let's process the playerNames object so its a bit more friendly.
    for (let i = 0; i < playerNames.length; i++) {
      playerNamesArr.push(playerNames[i].Username)
    }

    // Now that everyone has connected, and we know their names, we can start the game.
    // Updates the page on window load to display the default wordle table and keyboard table
    // Also attach the event listener for the keydown event so the user can use their keyboard.
    // Also remove the loading icon.
    document.getElementById('spinner').style.display = 'none'
    document.addEventListener('keydown', keyboardInputEvent)
    document.addEventListener('click', virtualKeyboardInputEvent)
    updateWordleTableText()
    updateWordleTableColor()
    createKeyboard()
    updateKeyboard()
    createOpponentBoards()
    console.log(playerNames)
    gameStart = true
  }
})

// This will fire when the server sends the opponents' colours to the client.
socket.on('update_opponent_colors', (colorArr, didTheyWin, playerName, playerNum) => {
  if (didTheyWin) {
    // Disable the keyboard.
    document.removeEventListener('keydown', keyboardInputEvent)
    document.removeEventListener('click', virtualKeyboardInputEvent)

    document.getElementById('winText').innerHTML = `${playerName} won the game!`
    $('#gameoverModal').modal('show')

    socket.emit('game_over')
  }

  if (playerNum > thisPlayerNumber) {
    playerNum = playerNum - 1
  }
  if ((gameType === 'Custom') && customOwner === false) { // Custom game
    playerNum = playerNum - 1
  }
  updateOpponentColors(colorArr, playerNum, playerName)
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
    document.removeEventListener('click', virtualKeyboardInputEvent)

    document.getElementById('winText').innerHTML = '🎉 You won the game! 🎉'
    $('#gameoverModal').modal('show')

    socket.emit('game_over')
  }

  updateWordleTableColor()
  updateKeyboard()
})

socket.on('get_number', (num) => {
  thisPlayerNumber = num
})

socket.on('word_not_found', () => {
  document.getElementById('errorText').innerHTML = 'This word is not in our database. Please try a different word.'
  $('#gameErrorModal').modal('show')
})

socket.on('invalid_guess', () => {
  document.getElementById('errorText').innerHTML = 'You entered a word that contains illegal values. Please make sure your word only contains letters of the alphabet.'
  $('#gameErrorModal').modal('show')
})

/** ********* General code ***********/
if (window.sessionStorage.getItem('gameID') === null) {
  // If the client doesn't have a gameID in their session storage, then they
  // have navigated to this page without going through the lobby. We redirect them to it.
  window.location.href = '/lobby'
}

const gameID = window.sessionStorage.getItem('gameID')
gameType = window.sessionStorage.getItem('gameType')
console.log(gameType)
// Check what game type it is and whether the player is the custom game owner
if (gameType === 'CustomCreate') {
  customOwner = true
} else if (gameType === 'Standard' || gameType === 'StandardCreate') {
  customOwner = false
} else if (gameType === 'Custom') { // Could be standard or custom game
  customOwner = false
}

const userName = getFromCookie('username', document.cookie)

// Try establish a connection with the server.
socket.auth = { sessionInfo: gameID, playerName: userName }
socket.connect()

function redirectToLobby () {
  // First, lets remove the gameID from the session storage.
  sessionStorage.removeItem('gameID')
  window.location.href = '/lobby'
}

// Add event listener to the modal close button so the player is sent back to the lobby
document.getElementById('modalCloseButtonGameOver').addEventListener('click', redirectToLobby)
// Updates the color currently displayed in this user's wordle table
function updateWordleTableColor () {
  const wordlePlayer = document.getElementById('playerDiv')
  const wordleGrid = wordlePlayer.getElementsByClassName('wordleDiv')[0]
  const wordleRows = wordleGrid.getElementsByClassName('wordleRow')
  updateWordleColors(wordleRows, colorArray)
}

function updateWordleColors (wordleRows, colorArray) {
  for (let i = 0; i < wordleRows.length; i++) {
    const wordleBlocks = wordleRows[i].getElementsByClassName('block')
    for (let j = 0; j < wordleBlocks.length; j++) {
      switch (colorArray[i][j]) {
        case 'd':
        case 'D':
          wordleBlocks[j].style.backgroundColor = 'lightgrey'
          break
        case 'n':
        case 'N':
          wordleBlocks[j].style.backgroundColor = 'grey'
          break
        case 'i':
        case 'I':
          wordleBlocks[j].style.backgroundColor = 'yellow'
          break
        case 'c':
        case 'C':
          wordleBlocks[j].style.backgroundColor = 'green'
          break
      }
    }
  }
}

function updateOpponentColors (arrayOfColors, playerNum, playerName) {
  const wordleGrid = document.getElementById(`opponent${playerNum}`)

  if (playerName) {
    const name = wordleGrid.getElementsByTagName('h2')[0]
    name.innerHTML = playerName
  }
  const wordleRows = wordleGrid.getElementsByClassName('wordleRow')
  updateWordleColors(wordleRows, arrayOfColors)
}

// Updates the text currently displayed in this user's wordle table
function updateWordleTableText () {
  const wordlePlayer = document.getElementById('playerDiv')
  const wordleGrid = wordlePlayer.getElementsByClassName('wordleDiv')[0]
  const wordleRows = wordleGrid.getElementsByClassName('wordleRow')

  for (let i = 0; i < wordleRows.length; i++) {
    const wordleBlocks = wordleRows[i].getElementsByClassName('block')
    for (let j = 0; j < wordleBlocks.length; j++) {
      wordleBlocks[j].innerHTML = letterArray[i][j]
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
  const keyboardDiv = document.getElementById('keyboardDiv')
  const keyboardRows = keyboardDiv.getElementsByClassName('keyboardRow')
  let count = 0

  for (let i = 0; i < keyboardRows.length; i++) {
    const keys = keyboardRows[i].getElementsByClassName('key')
    for (let j = 0; j < keys.length; j++) {
      keys[j].innerHTML = allLettersArray[count]
      keys[j].style.backgroundColor = 'lightgrey'
      count = count + 1
    }
  }
}

// Updates the on-screen keyboard's colors
function updateKeyboard () {
  const keyboardDiv = document.getElementById('keyboardDiv')
  const keyboardRows = keyboardDiv.getElementsByClassName('keyboardRow')
  let count = 0

  for (let i = 0; i < keyboardRows.length; i++) {
    const keys = keyboardRows[i].getElementsByClassName('key')

    for (let j = 0; j < keys.length; j++) {
      switch (allLettersColorsArray[count]) {
        case 'd':
        case 'D':
          keys[j].style.backgroundColor = 'lightgrey'
          break
        case 'n':
        case 'N':
          keys[j].style.backgroundColor = 'grey'
          break
        case 'i':
        case 'I':
          keys[j].style.backgroundColor = 'yellow'
          break
        case 'c':
        case 'C':
          keys[j].style.backgroundColor = 'green'
          break
      }
      count = count + 1
    }
  }
}

function customOwnerLayout () {
  document.getElementById('gridContainer').style.flexWrap = 'wrap'
  document.getElementById('playerDiv').style.display = 'none'
  document.getElementById('playerDiv').style.order = '3'
  document.getElementById('opponentsDivRight').style.display = '2'
  document.getElementById('opponentsDivRight').style.width = '100%'
  document.getElementById('opponentsDivRight').style.flexWrap = 'nowrap'
  document.getElementById('opponentsDivRight').style.justifyContent = 'space-between'
  document.getElementById('opponentsDivLeft').style.width = '100%'
  document.getElementById('opponentsDivLeft').style.flexWrap = 'nowrap'
  document.getElementById('opponentsDivLeft').style.justifyContent = 'space-between'

  const wordleDivArray = document.getElementsByClassName('wordleDiv')
  for (let i = 1; i < wordleDivArray.length; i++) {
    wordleDivArray[i].style.height = '50vh'
  }
}

function normalLayout () {
  document.getElementById('gridContainer').style.flexWrap = 'nowrap'
  document.getElementById('playerDiv').style.display = 'block'
  document.getElementById('playerDiv').style.order = '2'
  document.getElementById('opponentsDivRight').style.display = '3'
  document.getElementById('opponentsDivRight').style.width = '20%'
  document.getElementById('opponentsDivRight').style.flexWrap = 'wrap'
  document.getElementById('opponentsDivRight').style.justifyContent = 'space-evenly'
  document.getElementById('opponentsDivLeft').style.width = '20%'
  document.getElementById('opponentsDivLeft').style.flexWrap = 'wrap'
  document.getElementById('opponentsDivLeft').style.justifyContent = 'space-evenly'

  const wordleDivArray = document.getElementsByClassName('wordleDiv')
  for (let i = 1; i < wordleDivArray.length; i++) {
    wordleDivArray[i].style.height = '25vh'
  }
}

function createOpponentBoards () {
  if (thisPlayerNumber !== -1) {
    const numPlayers = parseInt(gameID[gameID.length - 1])

    if (gameType === 'Standard' || gameType === 'StandardCreate') { // Standard game
      normalLayout()
      let count = 1
      for (let i = 1; i <= numPlayers; i++) {
        if (i !== thisPlayerNumber) {
          const opponent = document.getElementById(`opponent${count}`)
          const opponentNameHeading = opponent.getElementsByTagName('h2')[0]
          opponentNameHeading.innerHTML = 'Opponent ' + count
          updateOpponentColors(colorArray, count)
          count = count + 1
        }
      }
    } else if (gameType === 'CustomCreate') { // Custom game + lobby owner
      if (customOwner === true) {
        customOwnerLayout()
        let count = 1
        for (let i = 1; i <= numPlayers; i++) {
          if (i !== thisPlayerNumber) {
            const opponent = document.getElementById(`opponent${count}`)
            const opponentNameHeading = opponent.getElementsByTagName('h2')[0]
            opponentNameHeading.innerHTML = 'Opponent ' + count
            updateOpponentColors(colorArray, count)
            count = count + 1
          }
        }
      }
    } else if (gameType === 'Custom') { // Custom game + non-lobby-owner
      normalLayout()
      let count = 1
      for (let i = 2; i <= numPlayers; i++) {
        if (i !== thisPlayerNumber) {
          const opponent = document.getElementById(`opponent${count}`)
          const opponentNameHeading = opponent.getElementsByTagName('h2')[0]
          opponentNameHeading.innerHTML = 'Opponent ' + count
          updateOpponentColors(colorArray, count)
          count = count + 1
        }
      }
    }
  } else {
    console.log('Player number error!')
  }
}

function keyboardInputEvent (event) {
  document.getElementById('gameInfoText').innerHTML = ''
  if (event.key === 'Backspace') {
    if (currentLetterIndex > 0) {
      currentLetterIndex = currentLetterIndex - 1
    }
    letterArray[currentWordIndex][currentLetterIndex] = ''
    updateWordleTableText()
  } else if (event.key === 'Enter') {
    if (currentLetterIndex < 5) {
      document.getElementById('gameInfoText').innerHTML = 'Not enough letters!'
    }
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

function virtualKeyboardInputEvent (event) {
  document.getElementById('gameInfoText').innerHTML = ''
  const keys = document.getElementsByClassName('key')
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key === event.target) {
      const keyText = key.innerHTML.toUpperCase()
      if (keyText === 'BACK') {
        if (currentLetterIndex > 0) {
          currentLetterIndex = currentLetterIndex - 1
        }
        letterArray[currentWordIndex][currentLetterIndex] = ''
        updateWordleTableText()
      } else if (keyText === 'ENTER') {
        if (currentLetterIndex < 5) {
          document.getElementById('gameInfoText').innerHTML = 'Not enough letters!'
        }
      } else {
        for (let i = 0; i < allLettersArray.length; i++) {
          if (keyText === allLettersArray[i]) {
            letterArray[currentWordIndex][currentLetterIndex] = keyText
            updateWordleTableText()
            incrementLetterIndex()
          }
        }
      }
    }
  }
}
