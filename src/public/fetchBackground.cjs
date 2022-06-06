'use strict'

const new_request = new XMLHttpRequest()
window.onload = getBackground()

function getBackground() {
  new_request.open('GET', '/game/api/BackgroundData', true)
  new_request.addEventListener('load', setBackground)
  new_request.send()
}

function setBackground() {
  const new_response = this.responseText
  const background = document.querySelector('body')

  if (new_response === 'Mountains') {
    background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")')
  } else if (new_response === 'Forest') {
    background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")')
  } else if (new_response === 'Beach') {
    background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")')
  }
}

