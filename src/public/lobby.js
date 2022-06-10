'use strict'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
const socket = io('/rooms')

$(function () {
  checkUser(document.cookie).then(
    (result) => {
      if (result === false) {
        window.location.href = '/login'
      }
    }
  ).catch()
})

setModeForPage()
function setModeForPage () {
  const isDarkmode = getFromCookie('darkMode', document.cookie)
  //  set current current scheme
  if (isDarkmode === 'true') {
    document.body.classList.remove('bg-light')
    document.body.classList.add('bg-dark')
    document.body.style.color = 'white'
    document.getElementById('numPlayersContainer').style.color = 'white'
    document.getElementById('gameModeContainer').style.color = 'white'
    document.getElementById('gameInfo').style.color = 'white'
  } else {
    document.body.classList.remove('bg-dark')
    document.body.classList.add('bg-light')
    document.body.style.color = 'black'
    document.getElementById('numPlayersContainer').style.color = 'black'
    document.getElementById('gameModeContainer').style.color = 'black'
    document.getElementById('gameInfo').style.color = 'black'
  }
}

// Try establish a connection with the server.
socket.connect()

// First, lets remove any previous gameIDs and gameTypes from the session storage.
sessionStorage.removeItem('gameID')
sessionStorage.removeItem('gameType')

// Hide the custom word field for now since the standard radio button is selected by default.
$('#customWordField').hide()
$('#customWordField').append('<div class="form-floating mb-3"><input type="text" class="form-control" id="customWord" placeholder="Custom word"><label for="floatingInput">Custom word</label><div id="invalidWord" class="invalid-feedback"><div id="feedbackText"></div></div></div>')
$('#invalidWord').hide()

// This shows the number of players selected by the slider.
$('#currentNumPlayers').html($('#numPlayers').val())

// Makes the customWord field visible if the custom radio button is active
$('#gameModeContainer input:radio').on('click', () => {
  if ($('#standard').is(':checked')) {
    $('#customWordField').fadeOut('fast')
    document.getElementById('numPlayers').min = 2
    $('#currentNumPlayers').html($('#numPlayers').val())
  } else if ($('#custom').is(':checked')) {
    $('#customWordField').fadeIn('fast')
    document.getElementById('numPlayers').min = 3
    $('#currentNumPlayers').html($('#numPlayers').val())
  } else {
    console.log('Something weird has happened. This should not be reached!')
  }
})

// Dynamically changes the number of players displayed when the user moves the slider.
$('#numPlayers').on('change', function () {
  $('#currentNumPlayers').html($('#numPlayers').val())
})

socket.on('invalid_player_number', () => {
  document.getElementById('errorText').innerHTML = 'The specified player number is invalid.'
  $('#errorModal').modal('show')

  // Re-enable all the buttons
  $('#createGameBtn').removeAttr('disabled')
  $('#gameInfoTableBody').find('button').removeAttr('disabled')

  // Remove loading icon
  document.getElementById('createGameBtn').innerHTML = 'Create game'
})

socket.on('invalid_word', () => {
  document.getElementById('feedbackText').innerHTML = 'Your word is not in our database, please pick another word.'
  $('#invalidWord').show()
  document.getElementById('customWord').className = 'form-control is-invalid'

  // Re-enable all the buttons
  $('#createGameBtn').removeAttr('disabled')
  $('#gameInfoTableBody').find('button').removeAttr('disabled')

  // Remove loading icon
  document.getElementById('createGameBtn').innerHTML = 'Create game'
})

socket.on('get_game_id', (gameID, gameType) => {
  console.log(gameID)
  console.log(`UUID: ${gameID.substring(0, 36)} GameID: ${gameID.substring(36)}`)
  sessionStorage.setItem('gameID', gameID)
  sessionStorage.setItem('gameType', gameType)
  window.location.href = '/game/play'
})

// When this is fired, the game list is updated with a new list of open games.
socket.on('update_game_list', (openGames) => {
  // First, lets empty the table's body
  $('#gameInfoTableBody').empty()

  const tableBody = document.getElementById('gameInfoTableBody')

  // Add the new open games to the table.
  for (let i = 0; i < openGames.length; i++) {
    const newRow = tableBody.insertRow(i)
    const gameName = newRow.insertCell(0)
    const availPlayers = newRow.insertCell(1)
    const gameType = newRow.insertCell(2)
    const joinBtn = newRow.insertCell(3)

    gameName.innerHTML = openGames[i].roomName
    availPlayers.innerHTML = openGames[i].availSlots
    gameType.innerHTML = openGames[i].gameType
    joinBtn.innerHTML = `<button class="btn btn-primary col-4" style="width:100%" id="${openGames[i].roomName},${openGames[i].gameType}">Join game</button>`
    document.getElementById(`${openGames[i].roomName},${openGames[i].gameType}`).addEventListener('click', joinRunningGame)
  }
})

socket.on('get_game_id', (gameID, gameType) => {
  // console.log(gameID)
  /// console.log(`UUID: ${gameID.substring(0, 36)} GameID: ${gameID.substring(36)}`)
  sessionStorage.setItem('gameID', gameID)
  sessionStorage.setItem('gameType', gameType)
  window.location.href = '/game/play'
})

function joinRunningGame (event) {
  // Let's disable all the buttons so that the user can't try joining multiple games while
  // the db is being queried.
  $('#gameInfoTableBody').find('button').attr('disabled', 'disabled')

  // Add a loading icon to the button
  document.getElementById(event.target.id).innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Joining...</span>'

  // Let's also disable the create game button since the user is already joining a game.
  $('#createGameBtn').attr('disabled', 'disabled')

  sessionStorage.setItem('gameID', this.id.substring(0, this.id.indexOf(',')))
  sessionStorage.setItem('gameType', this.id.substring(this.id.indexOf(',') + 1))
  window.location.href = '/game/play'
}

document.getElementById('createGameBtn').addEventListener('click', () => {
  const numPlayers = $('#numPlayers').val()

  let modeChosen = 1

  // Checks if the custom word chosen is valid if the game mode is custom
  if (document.getElementById('custom').checked) {
    modeChosen = 2

    if (document.getElementById('customWord').value !== '') {
      if (document.getElementById('customWord').value.length !== 5) {
        document.getElementById('feedbackText').innerHTML = 'Oi, words have to be 5 letters, so I think you should do that.'
        $('#invalidWord').show()
        document.getElementById('customWord').className = 'form-control is-invalid'
        return
      }
    } else {
      document.getElementById('feedbackText').innerHTML = 'If you didn\'t want to pick a word, why did you pick custom... Standard is fun cause it\'s a random word.'
      $('#invalidWord').show()
      document.getElementById('customWord').className = 'form-control is-invalid'
      return
    }
  }

  // Disable the create game button before sending the request to the server.
  $('#createGameBtn').attr('disabled', 'disabled')

  // Add a loading icon
  document.getElementById('createGameBtn').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Creating game...</span>'

  // Disable the join game buttons for existing games.
  $('#gameInfoTableBody').find('button').attr('disabled', 'disabled')

  socket.connect()
  socket.emit('create_game', numPlayers, modeChosen, document.getElementById('customWord').value)
})

document.getElementById('homeButton').addEventListener('click', () => {
  window.location.href = '/'
})

