'use strict'

function getMode () {
  request.open('GET', '/user/api/DarkModeData', true)
  request.addEventListener('load', setMode)
  request.send()
}

function setMode () {
  const response = JSON.parse(this.responseText)
  sessionStorage.setItem('mode', response)
}
