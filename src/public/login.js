'use strict'
const request = new XMLHttpRequest()
request.addEventListener('error', onError)

window.onload = function () {
  document.getElementById('loginbutton').addEventListener('click', function (evt) {
    evt.preventDefault()
    // open the post request to the server with url of log
    request.open('POST', '/log', true)
    request.setRequestHeader('Content-type', 'application/json')
    // get username and password
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    // send username and password to the server via json
    request.send(JSON.stringify({ usernameInput: username, passwordInput: password }))
    // wait for server to respond back
    request.addEventListener('load', receivedValue)
  })
}

function receivedValue () {
  // parse the data received from server
  const response = JSON.parse(this.responseText)
  // get the msg of the json (get the value of a field loggedInOrNot)
  const msg = response.loggedInOrNot
  console.log(msg)
  // out put the value
  document.getElementById('output').innerHTML = msg

  if (msg === 'Username and password are invalid.') {
    document.getElementById('password').className = 'form-control is-invalid'
    document.getElementById('username').className = 'form-control is-invalid'
  } else if (msg === 'Please input a valid password') {
    document.getElementById('username').className = 'form-control'
    document.getElementById('password').className = 'form-control is-invalid'
  } else if (msg === 'Please input a valid username') {
    document.getElementById('username').className = 'form-control is-invalid'
    document.getElementById('password').className = 'form-control'
  } else {
    // Let's reset everything
    document.getElementById('username').className = 'form-control'
    document.getElementById('password').className = 'form-control'
    window.location.href = "/loginRedirect"
  }
}

function onError () {
  // Let's tell the user that something wrong happened.
  document.getElementById('output').innerHTML = 'Status: Error communicating with server.'
}
