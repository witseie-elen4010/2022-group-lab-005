'use strict'

const request = new XMLHttpRequest()
request.addEventListener('error', onError)

function sendWordToServer () {
  // Let's get the word that the user input to the textbox (with an id of 'wordID').
  const word = document.getElementById('wordID').value

  // Then we open a POST request to the server with the url of '/logWord'.
  request.open('POST', '/logWord', true)

  // We tell the server we are going to send JSON data.
  request.setRequestHeader('Content-type', 'application/json')

  // Convert the word given by the user to a JSON object and send it to the server.
  request.send(JSON.stringify({ wordToLog: word }))

  // Now we attach an event listener to XMLHttpRequest so we can do stuff
  // when the server gets back to us.
  // See (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/load_event) for more info.
  request.addEventListener('load', dataReceived)

  // Let's tell the user that the data has been sent.
  // We do this by updating the paragraph tag in the HTML
  // with the id 'status'.
  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: Sent word to server'
}

function dataReceived () {
  // Let's get parse the data we just received.
  const response = JSON.parse(this.responseText)

  // When we made the JSON object (on the server, look at the code for the /myWord POST function),
  // we called the field (in the JSON object) 'message'. So, we extract the 'message' field from the
  // JSON object.
  const msg = response.message

  // Now we can display the server's response on the HTML page by modifying the paragraph tag with the
  // id 'msgFmServer'.
  const msgFmServer = document.getElementById('msgFmServer')
  msgFmServer.innerHTML = msg

  // Let's tell the user that the data from the server has been received.
  // We do this by updating the paragraph tag in the HTML
  // with the id 'status'.
  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: Word is being logged.'
}

function onError () {
  // Let's tell the user that something wrong happened.
  const statusTag = document.getElementById('status')
  statusTag.innerHTML = 'Status: Error communicating with server.'
}
