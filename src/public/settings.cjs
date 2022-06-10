'use strict'

$(function () {
  checkUser(document.cookie).then(
    (result) => {
      if (result === false) {
        window.location.href = '/login'
      }
    }
  ).catch()
})

// when user selects the dark mode button send dark mode is true to server
const darkModeButton = document.getElementById('darkButton')
darkModeButton.addEventListener('click', function () {
  const mode = 'true'
  // save dark mode in cookie
  document.cookie = 'darkMode=' + mode + '; path=/'
  // send dark mode is true to server
  sendModeToServer(mode)
  // remove light mode class
  document.body.classList.remove('bg-light')
  // add dark mode class
  document.body.classList.add('bg-dark')
  location.reload()
}, false)

// when user selects the light mode button send dark mode is false to server
const lightModeButton = document.getElementById('lightButton')
lightModeButton.addEventListener('click', function () {
  const mode = 'false'
  // save dark mode in cookie
  document.cookie = 'darkMode=' + mode + '; path=/'
  // send dark mode is false to server
  sendModeToServer(mode)
  // remove dark mode class
  document.body.classList.remove('bg-dark')
  // add light mode class
  document.body.classList.add('bg-light')
  location.reload()
}, false)

document.getElementById('updatePassword').addEventListener('click', function (evt) {
  evt.preventDefault()
  // open post request
  request.open('POST', '/user/updatePassword', true)
  request.setRequestHeader('Content-type', 'application/json')
  updateAndSendFormControl()
})

function updateAndSendFormControl () {
  if (document.getElementById('password').value === '') {
    // if password field is empty display error
    document.getElementById('password').className = 'form-control is-invalid'
    document.getElementById('output').innerHTML = 'Please input new password'
  } else {
    const password = document.getElementById('password').value
    const username = getFromCookie('username', document.cookie)
    // encrypt password
    const hashedPassword = addingSomeSaltAndHash(password)
    // send password and username to server
    request.send(JSON.stringify({ usernameInput: username, passwordInput: hashedPassword }))
    request.addEventListener('load', receivedValue)
  }
}

function receivedValue () {
  const response = JSON.parse(this.responseText)
  const msg = 'Password successfully updated'
  console.log(msg)
  document.getElementById('output').innerHTML = msg
}

function addingSomeSaltAndHash (password) {
  const saltPassword = password + 'PleaseGiveGoodMark'
  const hash = CryptoJS.SHA256(saltPassword).toString()
  return hash
}

// when user selects the light mode button send dark mode is false to server
const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/'
}, false)
