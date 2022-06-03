'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/rooms')

// Try establish a connection with the server.
socket.connect()

socket.on('update_game_list', (openGames) => {

    let table = document.getElementById('gameInfo').getElementsByTagName('tbody')[0]

    if (openGames.length !== 0) {

        // Add the new open games to the table.
        for (let i = 0; i < openGames.length; i++) {
            let newRow = table.insertRow(i)
            let gameName = newRow.insertCell(0)
            let availPlayers = newRow.insertCell(1)

            gameName.innerHTML = openGames[i].roomName
            availPlayers.innerHTML = openGames[i].availSlots
        }
    } else {
        // There are no open games, so we must clear the table.
        const emptyTblBdy = document.createElement('tbody')
        table.parentNode.replaceChild(emptyTblBdy, table)
    }
})

document.getElementById('createGameBtn').addEventListener('click', () => {
    // Get the number of players
    const numPlayers = document.getElementById('playerRnge').value

    let gameType

    // Check the radio buttons
    if (document.getElementById('standardRdo').checked) {
        //console.log(`Standard game with ${numPlayers} players.`)
        gameType = 'standard'
    } else {
        //console.log(`Custom game with ${numPlayers} players.`)
        gameType = 'custom'
    }

    socket.connect()
    socket.emit('create_game', gameType, numPlayers)
})