'use strict'

const request = new XMLHttpRequest()

$(function () {
  //const fake = createFakeUser()
  //document.cookie = fake
  checkUser(document.cookie).then(
    (result) => {
      if (result === false) {
        window.location.href = "/login"
      }
    }
  ).catch()
})
getMode()
function getMode() {

  request.open('GET', '/user/api/DarkModeData', true)
  request.setRequestHeader('Content-type', 'application/json')
  const username = getFromCookie('username', document.cookie)
  request.send(JSON.stringify({ usernameInput: username }))
  request.addEventListener('load', setMode)
}

function setMode() {
  const response = JSON.parse(this.responseText)
  console.log(response)

  const darkMode = response

  //  set current current scheme
  if (darkMode === 'true') {
    document.body.classList.remove('light-mode')
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
    document.body.classList.add('light-mode')
  }
  //sessionStorage.setItem('mode', response)
}
