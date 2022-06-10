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
  updateAndSendFormControl()
})

function updateAndSendFormControl() {
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
    $.post('/user/updatePassword', { usernameInput: username, passwordInput: hashedPassword })
      .done(function (response) {
        const msg = 'Password successfully updated'
        console.log(msg)
        document.getElementById('output').innerHTML = msg
      })
      .fail(function (serverResponse) {
        alert(serverResponse)
      })
  }
}

function addingSomeSaltAndHash(password) {
  const saltPassword = password + 'PleaseGiveGoodMark'
  const hash = CryptoJS.SHA256(saltPassword).toString()
  return hash
}

// when user selects the light mode button send dark mode is false to server
const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/'
}, false)
