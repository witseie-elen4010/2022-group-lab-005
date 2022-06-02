'use strict'

const allLettersArray = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']

module.exports = function (io) {
  io.on('connection', (socket) => {
    socket.on('send_guess', function (letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray) {
      const currentWordArray = ['H', 'E', 'L', 'L', 'O']
      const [letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin] = testWord(letterArray, currentWordIndex, colorArray, currentWordCheck, allLettersColorsArray, currentWordArray)

      socket.emit('update_player_screen', letterArr, currWordIndex, colorArr, currWordCheck, allLettersColorsArr, didTheyWin) // These values get sent back to the sender.
      socket.broadcast.to(socket.data.roomID).emit('update_opponent_colors', colorArr, didTheyWin, socket.data.playerName) // These values get broadcast to everyone except the sender.
    })

    socket.on('game_over', () => {
      socket.disconnect()
    })
  })

  // This is called a middleware. Its a type of function that is run for every incoming connection.
  // In this case, it is being used for authentication. If the code is happy with the details that the
  // incoming connection specified, this code will add that connection to the specific room for the game.
  // See https://socket.io/docs/v4/middlewares/ for details.
  io.use((socket, next) => {
    // When the a connection is attempted, the client sends an object that contains the player's name and a string called sessionInfo. This string is of the format:
    // x....xy where all the xs form the roomID and y is the number of players that are going to be in the game.

    // We extract the gameID from the sessionInfo string.
    const gameID = socket.handshake.auth.sessionInfo.substring(0, socket.handshake.auth.sessionInfo.length - 1)

    // We get the player's name.
    const playerName = socket.handshake.auth.playerName

    // We extract the number of players from the sessionInfo string.
    const numPlayers = validateNumPlayers(socket.handshake.auth.sessionInfo.substring(socket.handshake.auth.sessionInfo.length - 1))

    if (numPlayers !== -1 && gameID.length !== 0 && playerName.length !== 0) {
      if (!isRoomEmpty(io, gameID)) {
        // This socket is not the first player to join the room. Let's check that the room isn't full
        if (numPlayers > parseInt(io.sockets.adapter.rooms.get(gameID).size)) {
          // The room isn't full yet so the game hasn't started.
          socket = addPlayerToRoom(socket, gameID, playerName, numPlayers)

          // Check if the room is now full. If it is, start the game. Otherwise, tell the socket that just joined to wait.
          if (parseInt(io.sockets.adapter.rooms.get(socket.data.roomID).size) === parseInt(socket.data.numPlayers)) {
            // The room is now full. Let's start the game.
            console.log(`All ${socket.data.numPlayers} players have joined ${socket.data.roomID}, starting the game.`)

            // I think there's a better way to do this (only using one event) but I couldn't get anything to work
            // other than this. This first line broadcasts the 'game_can_start' event to all the sockets in the room
            // except to the sender. The second line sends the 'game_can_start' event to the sender.
            socket.to(socket.data.roomID).emit('game_can_start')
            socket.emit('game_can_start')
          } else {
            // The room is not full yet so we tell the socket that just joined to wait.
            socket.emit('waiting_for_players')
          }

          // This must be here or else the connection will hang until it times out. Its part of the middleware stuff.
          next()
        } else {
          // The room is full and the game is running
          return next(new Error('game_already_running'))
        }
      } else {
        // This socket is the first player to join the room.
        socket = addPlayerToRoom(socket, gameID, playerName, numPlayers)
        socket.emit('waiting_for_players')

        // This must be here or else the connection will hang until it times out. Its part of the middleware stuff.
        next()
      }
    } else {
      return next(new Error('invalid_game_id'))
    }

    /*
    if (!isNaN(numPlayers) && parseInt(numPlayers) <= 6 && parseInt(numPlayers) > 1) {

      if (io.sockets.adapter.rooms.get(gameID) === undefined) { // If the room is undefined, nobody is in it.
        // If the numPlayers are valid, add the player to the new room.
        // Add the player to the room specified by gameID.
        socket.join(gameID)
        console.log(`${playerName} has joined ${gameID}`)

        // We add a 'playerName' attribute *to* the socket object so we can
        // use that name later on.
        socket.data.playerName = playerName
        socket.data.roomID = gameID
        socket.data.numPlayers = numPlayers

        socket.emit('waiting_for_players')
      } else {
        // If we reach this block, then the room is valid. Now we must check if the player can join.
        if (parseInt(io.sockets.adapter.rooms.get(gameID).size) <= parseInt(numPlayers)) {
          // Add the player to the room specified by gameID.
          socket.join(gameID)
          console.log(`${playerName} has joined ${gameID}`)

          // We add a 'playerName' attribute *to* the socket object so we can
          // use that name later on.
          socket.data.playerName = playerName
          socket.data.roomID = gameID
          socket.data.numPlayers = numPlayers

          if (parseInt(io.sockets.adapter.rooms.get(socket.data.roomID).size) === parseInt(socket.data.numPlayers)) { // If this is true, then the game can start since the last player has just joined.
            console.log(`All ${socket.data.numPlayers} players have joined ${socket.data.roomID}, starting the game.`)

            // I think there's a better way to do this (only using one event) but I couldn't get anything to work
            // other than this. This first line broadcasts the 'game_can_start' event to all the sockets in the room
            // except to the sender. The second line sends the 'game_can_start' event to the sender.
            socket.to(socket.data.roomID).emit('game_can_start')
            socket.emit('game_can_start')
          } else { // Not enough players have joined
            socket.emit('waiting_for_players')
          }
        } else {
          return next(new Error('game_already_running'))
          //socket.emit('waiting_for_players')
        }
      }
    } else {
      return next(new Error('invalid_game_id'))
    } */

    /*

    // Here is where we validate the session info.
    // We make sure that the number of players is actually a number.
    // We make sure that the number of players is between (inclusive) 2 and HOW MANY PLAYERS??
    // We make sure that the gameID is valid (i.e. is of the correct form and has no invalid characters)
    // TODO: Validate the gameID. If we use UUID for the gameID, then we can just use a pre-made validator.
    if (numPlayers <= 6 && numPlayers > 1 && !isNaN(numPlayers)) {
      // If the room doesn't exist, then we can check how many players are in it!
      if (io.sockets.adapter.rooms.get(gameID) !== undefined && parseInt(io.sockets.adapter.rooms.get(gameID).size) > parseInt(numPlayers)) {
        return next(new Error('game_already_running'))
      } else {
        // This code is run if the room does not exist yet OR if the room does exist but it isn't at capacity yet.

        // Add the player to the room specified by gameID.
        socket.join(gameID)
        console.log(`${playerName} has joined ${gameID}`)

        // We add a 'playerName' attribute *to* the socket object so we can
        // use that name later on.
        socket.data.playerName = playerName
        socket.data.roomID = gameID
        socket.data.numPlayers = numPlayers

        if (parseInt(io.sockets.adapter.rooms.get(socket.data.roomID).size) === parseInt(socket.data.numPlayers)) {
          console.log(`All ${socket.data.numPlayers} players have joined ${socket.data.roomID}, starting the game.`)
          // I think there's a better way to do this (only using one event) but I couldn't get anything to work
          // other than this. This first line broadcasts the 'game_can_start' event to all the sockets in the room
          // except to the sender. The second line sends the 'game_can_start' event to the sender.
          socket.to(socket.data.roomID).emit('game_can_start')
          socket.emit('game_can_start')
        } else {
          socket.emit('waiting_for_players')
        }

        // Add a listener for when a connected socket leaves the server.
        socket.on('disconnect', () => {
          console.log(`${socket.data.playerName} has disconnected`)
        })

        // This must be here or else the connection will hang until it times out. Its part of the middleware stuff.
        next()
      }
    } else {
      return next(new Error('invalid_game_id'))
    } */
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

/*
* Returns -1 if numPlayers is invalid. Returns numPlayers if the number if valid.
*/
function validateNumPlayers (numPlayersUnchecked) {
  if (isNaN(numPlayersUnchecked)) {
    // Not a number
    return -1
  } else {
    const temp = parseInt(numPlayersUnchecked)
    if (Number.isInteger(temp)) {
      if (temp > 0 && temp < 7) {
        // Number is valid
        return temp
      } else {
        // Integer isn't between 1 and 6 (inclusive).
        return -1
      }
    } else {
      // Number isn't an integer.
      return -1
    }
  }
}

// Returns true if the specified room is empty. False otherwise.
function isRoomEmpty (io, gameID) {
  if (io.sockets.adapter.rooms.get(gameID) === undefined) {
    return true
  } else {
    return false
  }
}

// Adds a player to the specified room and returns the socket object.
// Adds a disconnect listener to the socket.
function addPlayerToRoom (socket, gameID, playerName, numPlayers) {
  // This socket is the first player to join the room.
  // Add the player to the room specified by gameID.
  socket.join(gameID)
  console.log(`${playerName} has joined ${gameID}`)

  // We add a 'playerName' attribute *to* the socket object so we can
  // use that name later on.
  socket.data.playerName = playerName
  socket.data.roomID = gameID
  socket.data.numPlayers = numPlayers

  // Add a listener for when a connected socket leaves the server.
  socket.on('disconnect', () => {
    console.log(`${socket.data.playerName} has disconnected`)
  })

  return socket
}
