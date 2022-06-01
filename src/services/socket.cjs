'use strict'
module.exports = function (io) {
  io.on('connection', (socket) => {

    socket.on("send_guess", function(letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray){
      const currentWordArray = ["H", "E", "L", "L", "O"]
      const allLettersArray = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]

      // I did this so I can pass by reference. Maybe there's a better way xD
      let gameProperties = {}
      gameProperties.letterArray = letterArray
      gameProperties.currentWordIndex = currentWordIndex
      gameProperties.colorArray = colorArray
      gameProperties.currentWordCheck = currentWordCheck
      gameProperties.allLettersArray = allLettersArray
      gameProperties.allLettersColorsArray = allLettersColorsArray

      testWord(gameProperties, currentWordArray)
      socket.emit('update_player_screen', gameProperties.letterArray, gameProperties.currentWordIndex, gameProperties.colorArray, gameProperties.currentWordCheck, gameProperties.allLettersColorsArray)
      socket.broadcast.emit('update_opponent_colors', gameProperties.colorArray)

      //socket.broadcast.emit("update_opponent_colors", {colorArr});
      //console.log(guessStr)

      //const query = require('./wordQuery.cjs')
      //query.makeGuess(guessStr, 1)

    });

    if (io.engine.clientsCount === 2) {
      io.emit("game_can_start")
    }
  })

  // When a new player attempts to join the server.
  // TODO CHECK THAT THE SAME USER ISN'T ALREADY IN THE LOBBY!!
  io.use((socket, next) => {
    const playerName = socket.handshake.auth.playerName
    if (!playerName) {
      return next(new Error('invalid_playername'))
    } else {
      // Add a listener for when a *connected* player leaves the server.
      socket.on('disconnect', () => {
        console.log(`${socket.playerName} has disconnected`)
      })

      console.log(`${playerName} has joined the game`)
      // We add a 'playerName' attribute *to* the socket object so we can
      // use that name later on.
      socket.playerName = playerName
      //socket.emit('redirect', '/game/game_debug', playerName)
      next()
    }
  })
}


/**
 * @param {{ letterArray: any; currentWordIndex: any; colorArray: any; currentWordCheck: any; allLettersArray?: any; allLettersColorsArray?: any; }} gameProperties
 * @param {any[]} currentWordArray
 */
function testWord(gameProperties, currentWordArray) {
  // Check if the letters are in the correct places
  let correctWordCount = 0
  for (let i = 0; i < 5; i++) {
    let currentLetter = gameProperties.letterArray[gameProperties.currentWordIndex][i]
    if (currentLetter == currentWordArray[i]) { // WORD TO GUESS
      gameProperties.colorArray[gameProperties.currentWordIndex][i] = "c"
      gameProperties.currentWordCheck[i] = "Y"
      let letterColorProperties = {}
      letterColorProperties.allLettersArray = gameProperties.allLettersArray
      letterColorProperties.allLettersColorsArray = gameProperties.allLettersColorsArray

      updateAllLettersColorsArray("c", currentLetter, letterColorProperties)
      gameProperties.allLettersArray = letterColorProperties.allLettersArray
      gameProperties.allLettersColorsArray = letterColorProperties.allLettersColorsArray
      correctWordCount = correctWordCount + 1
    }
  }
  // Check if the letters are in the word at all 
  for (let i = 0; i < 5; i++) {
    let currentLetter = gameProperties.letterArray[gameProperties.currentWordIndex][i]
    for (let j = 0; j < 5; j++) {
      if (currentLetter == currentWordArray[j]) {
        if (gameProperties.currentWordCheck[j] == "X") {
          gameProperties.colorArray[gameProperties.currentWordIndex][i] = "i"
          gameProperties.currentWordCheck[j] = "Y"

          let letterColorProperties = {}
          letterColorProperties.allLettersArray = gameProperties.allLettersArray
          letterColorProperties.allLettersColorsArray = gameProperties.allLettersColorsArray
    
          updateAllLettersColorsArray("i", currentLetter, letterColorProperties)
          gameProperties.allLettersArray = letterColorProperties.allLettersArray
          gameProperties.allLettersColorsArray = letterColorProperties.allLettersColorsArray
          j = 5; //Break out of the for-loop as letter has been found
        }
      }
    }
    // Checks if the letter is not in the word at all to change the colors to dark grey
    if (!(gameProperties.colorArray[gameProperties.currentWordIndex][i] == "i" || gameProperties.colorArray[gameProperties.currentWordIndex][i] == "c")) {
      gameProperties.colorArray[gameProperties.currentWordIndex][i] = "n"

      let letterColorProperties = {}
      letterColorProperties.allLettersArray = gameProperties.allLettersArray
      letterColorProperties.allLettersColorsArray = gameProperties.allLettersColorsArray

      updateAllLettersColorsArray("n", currentLetter, letterColorProperties)
      gameProperties.allLettersArray = letterColorProperties.allLettersArray
      gameProperties.allLettersColorsArray = letterColorProperties.allLettersColorsArray

    }
  }
  gameProperties.currentWordCheck = ["X", "X", "X", "X", "X"]
  //updateWordleTableColor()
  //updateKeyboard()

  // Checks if the user inputted the correct word
  if (correctWordCount == 5) {
    console.log("WINNER WINNER CHICKEN DINNER")
    // NICK CONNECTION STUFF GOES HERE FOR WHEN A WORD IS COMPLETED AND CORRECT
  }
  else {
    // NICK CONNECTION STUFF GOES HERE FOR WHEN A WORD IS COMPLETED BUT NOT CORRECT
  }
}


/**
 * @param {string} color
 * @param {any} letter
 * @param {{ allLettersArray: any; allLettersColorsArray: any; }} letterColorProperties
 */
function updateAllLettersColorsArray(color, letter, letterColorProperties) {
  for (let i = 0; i < letterColorProperties.allLettersArray.length; i++) {
    if (letterColorProperties.allLettersArray[i] == letter) {
      switch (color) {
        case "i":
          if (letterColorProperties.allLettersColorsArray[i] != "c") {
            letterColorProperties.allLettersColorsArray[i] = color
          }
          break
        case "c":
          letterColorProperties.allLettersColorsArray[i] = color
          break
        case "n":
          if (letterColorProperties.allLettersColorsArray[i] != "c" && letterColorProperties.allLettersColorsArray[i] != "i") {
            letterColorProperties.allLettersColorsArray[i] = color
          }
          break
      }
    }
  }
}