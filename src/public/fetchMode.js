'use strict'

const new_request = new XMLHttpRequest()

function getMode(username) {
  new_request.open('POST', '/user/api/DarkModeData', true)
  new_request.setRequestHeader('Content-type', 'application/json')
  new_request.send(JSON.stringify({ usernameInput: username }))
  new_request.addEventListener('load', setMode)
}

function setMode() {
  const response = JSON.parse(this.responseText)
  const darkMode = response.recordset[0].isDarkmode
  document.cookie = 'darkMode='+darkMode+'; path=/'
  window.location.href = '/loginRedirect'
}
