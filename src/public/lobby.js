'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/rooms')

// Try establish a connection with the server.
socket.connect()

// When this is fired, the game list is updated with a new list of open games.
// This will be triggered when some event causes one or more players to join or leave games.
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

// When the user clicks the create game button, the server is sent the details of the game. If it is happy, 
// it will create an unique game ID that will be received here.
socket.on('get_game_id', (gameID) => {
    sessionStorage.setItem('gameID', gameID)
    alert(`Please share ${gameID} with your friends!`)
    window.location.href = `/game/play`  
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

document.getElementById('joinGameBtn').addEventListener('click', () => {
    // Get the existing gameID
    const gameID = document.getElementById('existingGameID').value
    sessionStorage.setItem('gameID', gameID)
    window.location.href = `/game/play`
})