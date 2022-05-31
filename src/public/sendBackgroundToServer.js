'use strict'

const request = new XMLHttpRequest()
request.addEventListener('error', onError)

function sendBackgroundToServer (background) {
  
  console.log(background)
  const back = background

  request.open('POST', '/game/newBackground', true)

  request.setRequestHeader('Content-type', 'application/json')

  request.send(JSON.stringify({ back }))

  request.addEventListener('load', dataReceived)

  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: Sent background to server'
}

function dataReceived () {

  const response = JSON.parse(this.responseText)

  const msg = response.message

  const msgFmServer = document.getElementById('msgFmServer')
  msgFmServer.innerHTML = msg

  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: background is being logged.'
}

function onError () {
  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: Error communicating with server.'
}
