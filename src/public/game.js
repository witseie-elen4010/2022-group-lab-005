'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

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
socket.on('game_can_start', (playerNames) => {
  if (gameStart === false) {
    // Now that everyone has connected, we can start the game.
    // Updates the page on window load to display the default wordle table and keyboard table
    // Also attach the event listener for the keydown event so the user can use their keyboard.
    // Also remove the loading icon.
    document.getElementById('spinner').style.display = 'none'
    document.addEventListener('keydown', keyboardInputEvent)
    document.addEventListener('click', virtualKeyboardInputEvent)
    updateWordleTableText()
    updateWordleTableColor()
    updateKeyboard()
    createKeyboard()
    createOpponentBoards()
    gameStart = true
  }
})

// This will fire when the server sends the opponents' colours to the client.
socket.on('update_opponent_colors', (colorArr, didTheyWin, playerName, playerNum) => {
  if (didTheyWin) {
    // Disable the keyboard.
    document.removeEventListener('keydown', keyboardInputEvent)
    document.removeEventListener('click', virtualKeyboardInputEvent)
    document.getElementById('winner').innerHTML = `${playerName} won the game!`
    socket.emit('game_over')
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
    document.getElementById('winner').innerHTML = 'You won the game!'
    socket.emit('game_over')
  }

  updateWordleTableColor()
  updateKeyboard()
})

/** ********* General code ***********/
if (window.sessionStorage.getItem('gameID') === null) {
  // If the client doesn't have a gameID in their session storage, then they
  // have navigated to this page without going through the lobby. We redirect them to it.
  window.location.href = `/lobby` 
}
// This is used to identify the user. It will be replaced with the identity from the login system.
const gameID = window.sessionStorage.getItem('gameID') //prompt('Please enter your game ID', 'ID')
// Last digit of gameID is the number of players!

const userName = prompt('Please enter your username', 'Username')

// Try establish a connection with the server.
socket.auth = { sessionInfo: gameID, playerName: userName }
socket.connect()

// Updates the color currently displayed in this user's wordle table
function updateWordleTableColor () {
  const wordlePlayer = document.getElementById('playerDiv')
  const wordleGrid = wordlePlayer.getElementsByClassName('wordleDiv')[0]
  let wordleRows = wordleGrid.getElementsByClassName('wordleRow')
  updateWordleColors(wordleRows, colorArray)
}

function updateWordleColors(wordleRows, colorArray){
  for (let i = 0; i < wordleRows.length; i++) {
    let wordleBlocks = wordleRows[i].getElementsByClassName('block')
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

  //NICK TO LOOK HERE - this updates every time the player submits a word - should update all of them only once when the game starts
  //Although.. maybe a good thing because when people reconnect it updates
  if(playerName){ 
    let name = wordleGrid.getElementsByTagName('h2')[0]
    name.innerHTML = playerName 
  }
  let wordleRows = wordleGrid.getElementsByClassName('wordleRow')
  updateWordleColors(wordleRows, arrayOfColors)
}

// Updates the text currently displayed in this user's wordle table
function updateWordleTableText () {
  const wordlePlayer = document.getElementById('playerDiv')
  const wordleGrid = wordlePlayer.getElementsByClassName('wordleDiv')[0]
  let wordleRows = wordleGrid.getElementsByClassName('wordleRow')

  for (let i = 0; i < wordleRows.length; i++) {
    let wordleBlocks = wordleRows[i].getElementsByClassName('block')
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
  let keyboardRows = keyboardDiv.getElementsByClassName('keyboardRow')
  let count = 0

  for (let i = 0; i < keyboardRows.length; i++) {
    let keys = keyboardRows[i].getElementsByClassName('key')
    for(let j = 0; j < keys.length; j++)
    {
      keys[j].innerHTML = allLettersArray[count]
      keys[j].style.backgroundColor = 'lightgrey'
      count = count + 1
    }
  }
}

// Updates the on-screen keyboard's colors
function updateKeyboard () {
  const keyboardDiv = document.getElementById('keyboardDiv')
  let keyboardRows = keyboardDiv.getElementsByClassName('keyboardRow')
  let count = 0

  for (let i = 0; i < keyboardRows.length; i++) {
    let keys = keyboardRows[i].getElementsByClassName('key')

    for(let j = 0; j < keys.length; j++)
    {
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

function createOpponentBoards(){
  let numPlayers = gameID[gameID.length-1]
  for(let i = 1; i <= numPlayers; i++)
  {
    const opponent = document.getElementById(`opponent${i}`)
    let opponentNameHeading = opponent.getElementsByTagName('h2')[0]
    opponentNameHeading.innerHTML = 'Opponent ' + i
    updateOpponentColors(colorArray, i)
  }
  for(let i = numPlayers; i < 6; i++)
  {
    const opponent = document.getElementById(`opponent${i}`)
    opponent.style.display = "none"
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

function virtualKeyboardInputEvent (event){
  let keys = document.getElementsByClassName('key')
  for(let i = 0; i < keys.length; i++){
    let key = keys[i]
    if(key === event.target){
      let keyText = key.innerHTML.toUpperCase()
      if(keyText === "BACK"){
        if (currentLetterIndex > 0) {
          currentLetterIndex = currentLetterIndex - 1
        }
        letterArray[currentWordIndex][currentLetterIndex] = ''
        updateWordleTableText()
      } else if(keyText === "ENTER"){
        if(currentLetterIndex < 5)
        {
          console.log("NOT ENOUGH LETTERS!")
        }
      }
      else{
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