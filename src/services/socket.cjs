'use strict'
module.exports = function (io) {  
  io.on('connection', (socket) => {
    // Let's send a list of all the existing players to the player that
    // just connected.
    const players = [];
    for (let [id, socket] of io.of("/").sockets) {
      players.push({
        playerID: id, // This is how the user is identified. Will change soon(tm).
        playerName: socket.playerName,
      });
    }
    socket.emit("player_list", players);
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
