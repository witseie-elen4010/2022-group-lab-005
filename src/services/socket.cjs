'use strict'
module.exports = function (io) {
  io.on('connection', (socket) => {

    socket.on("send_guess", function(data){
      const guessStr = data.wrdToSend.join('')
      console.log(guessStr)
    });

    if (io.engine.clientsCount === 2) {
      io.emit("game_can_start")
    }
    //socket.emit("player_list", players);
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
