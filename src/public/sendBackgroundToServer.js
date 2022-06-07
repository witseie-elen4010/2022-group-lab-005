'use strict'

const request = new XMLHttpRequest()
request.addEventListener('error', onError)

function sendBackgroundToServer (background) {
  console.log(background)
  // send new background to page
  request.open('POST', '/game/newBackground', true)
  request.setRequestHeader('Content-type', 'application/json')
  const username = getFromCookie('username', document.cookie)
  request.send(JSON.stringify({ usernameInput: username, back: background }))
  request.addEventListener('load', dataReceived)

}

function dataReceived () {
  // get response from server
  const response = JSON.parse(this.responseText)
  const msg = response.message
  const msgFmServer = document.getElementById('msgFmServer')
  const statusTag = document.getElementById('status')
}

function onError () {
  const statusTag = document.getElementById('status')
}
