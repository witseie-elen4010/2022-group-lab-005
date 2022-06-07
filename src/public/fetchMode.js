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
  request.open('POST', '/user/api/DarkModeData', true)
  request.setRequestHeader('Content-type', 'application/json')
  const username = getFromCookie('username', document.cookie)
  request.send(JSON.stringify({ usernameInput: username }))
  request.addEventListener('load', setMode)
}

function setMode() {
  const response = JSON.parse(this.responseText)
  const darkMode = response.recordset[0].isDarkmode

  //  set current current scheme
  sessionStorage.setItem('mode', darkMode)
}
