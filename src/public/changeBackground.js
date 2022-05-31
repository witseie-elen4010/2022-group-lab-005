'use strict'
const background = document.querySelector('html, .background')
const pageBackground = sessionStorage.getItem('background')
const forestButton = document.getElementById('forestButton')

// set background to user's current background setting
if (pageBackground === 'Mountains') {
  background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")')
} else if (pageBackground === 'Forest') {
  background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")')
} else if (pageBackground === 'Beach') {
  background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")')
}

// if button is pressed change background and send new background to server
forestButton.addEventListener('click', function () {
  background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")')
  const back = 'Forest'
  sendBackgroundToServer(back)
}, false)

// if button is pressed change background and send new background to server
const sunBeachButton = document.getElementById('sunBeachButton')
sunBeachButton.addEventListener('click', function () {
  background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")')
  const back = 'Beach'
  sendBackgroundToServer(back)
}, false)

// if button is pressed change background and send new background to server
const mountainsButton = document.getElementById('mountainsButton')
mountainsButton.addEventListener('click', function () {
  background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")')
  const back = 'Mountains'
  sendBackgroundToServer(back)
}, false)

const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/game/game_debug'
}, false)
