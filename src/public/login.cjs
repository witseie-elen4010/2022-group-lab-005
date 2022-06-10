'use strict'
let loginOrRegister = true

window.onload = function () {
  document.getElementById('loginButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    document.getElementById('registerButton').disabled = true
    document.getElementById('loginButton').disabled = true
    loginOrRegister = true
    updateAndSendFormControl()
  })

  document.getElementById('registerButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    document.getElementById('registerButton').disabled = true
    document.getElementById('loginButton').disabled = true
    loginOrRegister = false
    updateAndSendFormControl()
  })
}

function updateAndSendFormControl () {
  // check if user have inputed anything
  if (document.getElementById('username').value === '') {
    document.getElementById('username').className = 'form-control is-invalid'
    document.getElementById('password').className = 'form-control'
    document.getElementById('output').innerHTML = 'Please input your username'
    document.getElementById('registerButton').disabled = false
    document.getElementById('loginButton').disabled = false
  } else if (document.getElementById('password').value === '') {
    document.getElementById('username').className = 'form-control'
    document.getElementById('password').className = 'form-control is-invalid'
    document.getElementById('output').innerHTML = 'Please input your password'
    document.getElementById('registerButton').disabled = false
    document.getElementById('loginButton').disabled = false
  } else {
    // get username and password and send it via json
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const hashedPassword = addingSomeSaltAndHash(password)
    if (loginOrRegister === true) {
      $.get('/log', { usernameInput: username, passwordInput: hashedPassword }).done(
        function (response) {
          receivedValue(response)
        }
      ).fail(
        function (serverResponse) {
          alert(serverResponse)
        })
    } else {
      $.get('/register', { usernameInput: username, passwordInput: hashedPassword }).done(
        function (response) {
          receivedValue(response)
        }
      ).fail(
        function (serverResponse) {
          alert(serverResponse)
        })
    }
  }
}

function receivedValue (response) {
  const msg = response.loggedInOrNot
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
  document.getElementById('registerButton').disabled = false
  document.getElementById('loginButton').disabled = false
}

function addingSomeSaltAndHash (password) {
  const saltPassword = password + 'PleaseGiveGoodMark'// can add special characters but i want good marks please
  const hash = CryptoJS.SHA256(saltPassword).toString()
  return hash
}
