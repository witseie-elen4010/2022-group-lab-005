'use strict'

const request = new XMLHttpRequest()
request.addEventListener('error', onError)

function sendModeToServer (darkModeBool) {
  const darkMode = darkModeBool
  request.open('POST', '/user/changeMode', true)

  // send request to server
  request.setRequestHeader('Content-type', 'application/json')
  const username = getFromCookie('username', document.cookie)
  request.send(JSON.stringify({ usernameInput: username, darkModeInput: darkMode }))
  request.addEventListener('load', dataReceived)
}

function dataReceived () {
  // Let's parse the data we just received.
  const response = JSON.parse(this.responseText)

  const msg = response.message

  const msgFmServer = document.getElementById('msgFmServer')
  msgFmServer.innerHTML = msg

  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: mode is being logged.'
}

function onError () {
  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: Error communicating with server.'
}
