'use strict'

const new_request = new XMLHttpRequest()
window.onload = getBackground()

function getBackground() {
  new_request.open('POST', '/game/api/BackgroundData', true)
  new_request.setRequestHeader('Content-type', 'application/json')
  const username = getFromCookie('username', document.cookie)
  new_request.send(JSON.stringify({ usernameInput: username }))
  new_request.addEventListener('load', setBackground)
}

function setBackground() {
  const response = JSON.parse(this.responseText)
  const new_response = response.recordset[0].Background
  console.log(new_response)
  const background = document.querySelector('body')

  if (new_response === 'Mountains') {
    background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")')
  } else if (new_response === 'Forest') {
    background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")')
  } else if (new_response === 'Beach') {
    background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")')
  }
}

