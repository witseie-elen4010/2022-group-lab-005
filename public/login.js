'use strict'
const request = new XMLHttpRequest()
request.addEventListener('error', onError)

document.getElementById('output').style.display = 'None'// switch this output off until button is clicked

function loggingIn () {
  // open the post request to the server with url of log
  request.open('POST', '/log', true)
  request.setRequestHeader('Content-type', 'application/json')
  // get username and password
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  // send username and password to ther server via json
  request.send(JSON.stringify({ usernameInput: username, passwordInput: password }))
  // wait for server to respond back
  request.addEventListener('load', recievedValue)
  // set the output to be visible
  document.getElementById('output').style.display = 'initial'// initial is on
}

function recievedValue () {
  // parse the data recieved from server
  const response = JSON.parse(this.responseText)
  // get the msg of the json (get the value of a field loggedInOrNot)
  const msg = response.loggedInOrNot
  // out put the value
  document.getElementById('output').innerHTML = msg
};

function onError () {
  // Let's tell the user that something wrong happened.
  document.getElementById('output').innerHTML = 'Status: Error communicating with server.'
}
