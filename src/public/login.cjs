'use strict'
const request = new XMLHttpRequest()
request.addEventListener('error', onError)
let loginOrRegister = true

window.onload = function () {
  document.getElementById('loginButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    document.getElementById('registerButton').disabled = true
    loginOrRegister = true
    // open the post request to the server with url of log
    request.open('POST', '/log', true)
    request.setRequestHeader('Content-type', 'application/json')
    updateAndSendFormControl()
  })

  document.getElementById('registerButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    document.getElementById('loginButton').disabled = true
    loginOrRegister = false
    // open the post request to the server with url of log
    request.open('POST', '/register', true)
    request.setRequestHeader('Content-type', 'application/json')
    updateAndSendFormControl()
  })
}

function updateAndSendFormControl () {
  // check if user have inputed anything
  if (document.getElementById('username').value === '') {
    document.getElementById('username').className = 'form-control is-invalid'
    document.getElementById('password').className = 'form-control'
    document.getElementById('output').innerHTML = 'Please input your username'
  } else if (document.getElementById('password').value === '') {
    document.getElementById('username').className = 'form-control'
    document.getElementById('password').className = 'form-control is-invalid'
    document.getElementById('output').innerHTML = 'Please input your password'
  } else {
    // get username and password and send it via json
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const hashedPassword = addingSomeSaltAndHash(password)
    request.send(JSON.stringify({ usernameInput: username, passwordInput: hashedPassword }))
    // wait for the server to respond back
    request.addEventListener('load', receivedValue)
  }
}

function receivedValue () {
  // parse the data received from server
  const response = JSON.parse(this.responseText)
  // get the msg of the json (get the value of a field loggedInOrNot)
  const msg = response.loggedInOrNot
  console.log(msg)
  // out put the value
  document.getElementById('output').innerHTML = msg

  if (msg === 'Please input a valid username') {
    document.getElementById('username').className = 'form-control is-invalid'
    document.getElementById('password').className = 'form-control'
  } else if (msg === 'User is now logged in' || msg === 'Registration completed') {
    // the code below is to set a cookie value, the only issue with this cookie is that it will
    // store a new cookie everytime the user logs in or registers, until the browser is closed
    const usernameText = document.getElementById('username').value
    const username = 'username=' + usernameText
    document.cookie = username
    // Let's reset everything
    document.getElementById('username').className = 'form-control'
    document.getElementById('password').className = 'form-control'
    getMode(usernameText)
    // redirect in getMode
  }
  if (loginOrRegister === true) {
    document.getElementById('registerButton').disabled = false
  } else {
    document.getElementById('loginButton').disabled = false
  }
}

function onError () {
  // Let's tell the user that something wrong happened.
  document.getElementById('output').innerHTML = 'Status: Error communicating with server.'
}

function addingSomeSaltAndHash (password) {
  const saltPassword = password + 'PleaseGiveGoodMark'// can add special characters but i want good marks please
  const hash = CryptoJS.SHA256(saltPassword).toString()
  return hash
}
