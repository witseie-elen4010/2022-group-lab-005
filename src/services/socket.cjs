'use strict'

const allLettersArray = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']

module.exports = function (io) {
  io.on('connection', (socket) => {
    socket.on('send_guess', function (letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray) {
      const currentWordArray = ['H', 'E', 'L', 'L', 'O']

      const [letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin] = testWord(letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, currentWordArray)

      socket.emit('update_player_screen', letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin)
      socket.broadcast.emit('update_opponent_colors', colorArr, didTheyWin, socket.playerName)
    })

    if (io.engine.clientsCount === 2) {
      io.emit('game_can_start')
    }

    socket.on('game_over', () => {
      socket.disconnect()
    })
  })

  // When a new player attempts to join the server.
  // TODO CHECK THAT THE SAME USER ISN'T ALREADY IN THE GAME!!
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
      next()
    }
  })
}

/**
 * @param {{ [x: string]: any[]; }} letterArray
 * @param {string | number} currentWordIndex
 * @param {{ [x: string]: string[]; }} colorArray
 * @param {string[]} currentWordCheck
 * @param {any[]} allLettersColorsArray
 * @param {any[]} currentWordArray
 */
function testWord (letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, currentWordArray) {
  // Check if the letters are in the correct places
  let correctWordCount = 0
  for (let i = 0; i < 5; i++) {
    const currentLetter = letterArray[currentWordIndex][i]
    if (currentLetter === currentWordArray[i]) { // WORD TO GUESS
      colorArray[currentWordIndex][i] = 'c'
      currentWordCheck[i] = 'Y'
      allLettersColorsArray = updateAllLettersColorsArray('c', currentLetter, allLettersColorsArray)
      correctWordCount = correctWordCount + 1
    }
  }
  // Check if the letters are in the word at all
  for (let i = 0; i < 5; i++) {
    const currentLetter = letterArray[currentWordIndex][i]
    for (let j = 0; j < 5; j++) {
      if (currentLetter === currentWordArray[j]) {
        if (currentWordCheck[j] === 'X') {
          colorArray[currentWordIndex][i] = 'i'
          currentWordCheck[j] = 'Y'
          allLettersColorsArray = updateAllLettersColorsArray('i', currentLetter, allLettersColorsArray)
          j = 5 // Break out of the for-loop as letter has been found
        }
      }
    }
    // Checks if the letter is not in the word at all to change the colors to dark grey
    if (!(colorArray[currentWordIndex][i] === 'i' || colorArray[currentWordIndex][i] === 'c')) {
      colorArray[currentWordIndex][i] = 'n'
      allLettersColorsArray = updateAllLettersColorsArray('n', currentLetter, allLettersColorsArray)
    }
  }

  currentWordCheck = ['X', 'X', 'X', 'X', 'X']

  if (correctWordCount === 5) {
    // The player has won!
    return [letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, true]
  } else {
    return [letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, false]
  }
}

/**
 * @description Updates all the color of the corresponding blocks in the color array that will be displayed to the client.
 * @param {string} color
 * @param {string} letter
 * @param {any[]} allLettersColorsArray
 * @returns {any[]} allLettersColorsArray
 */
function updateAllLettersColorsArray (color, letter, allLettersColorsArray) {
  for (let i = 0; i < allLettersArray.length; i++) {
    if (allLettersArray[i] === letter) {
      switch (color) {
        case 'i':
          if (allLettersColorsArray[i] !== 'c') {
            allLettersColorsArray[i] = color
          }
          break
        case 'c':
          allLettersColorsArray[i] = color
          break
        case 'n':
          if (allLettersColorsArray[i] !== 'c' && allLettersColorsArray[i] !== 'i') {
            allLettersColorsArray[i] = color
          }
          break
      }
    }
  }

  return allLettersColorsArray
}
