'use strict'

function sendModeToServer (darkModeBool) {
  const darkMode = darkModeBool
  // send request to server
  const username = getFromCookie('username', document.cookie)
  $.post('/user/changeMode', { usernameInput: username, darkModeInput: darkMode })
    .done(function (response) {
      dataReceived(response)
    })
    // .fail(function (serverResponse) {
    //   alert(serverResponse)
    // })
}

function dataReceived () {
  // Let's parse the data we just received.
  const msg = response.message
  const msgFmServer = document.getElementById('msgFmServer')
  const statusTag = document.getElementById('status')
}
