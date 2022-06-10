'use strict'

function sendBackgroundToServer (background) {
  console.log(background)
  // send new background to page
  const username = getFromCookie('username', document.cookie)
  $.post('/game/api/BackgroundData', { usernameInput: username, back: background })
    .done(function (response) {
      dataReceived(response)
    })
    .fail(function (serverResponse) {
      alert(serverResponse)
    })
}

function dataReceived (response) {
  // get response from server
  const msg = response.message
  const msgFmServer = document.getElementById('msgFmServer')
  const statusTag = document.getElementById('status')
}
