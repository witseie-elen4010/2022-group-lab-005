'use strict'
const background = document.querySelector('body')
const forestButton = document.getElementById('forestButton')

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

// if button is pressed change background and send new background to server
const noneButton = document.getElementById('noneButton')
noneButton.addEventListener('click', function () {
  background.style.removeProperty('background-image')
  const back = 'None'
  sendBackgroundToServer(back)
}, false)


let popup = document.getElementById("background_popup")

function openBackgroundPopup(){
  popup.classList.add("background-popup-visible")
}

function closeBackgroundPopup(){
  popup.classList.remove("background-popup-visible")
}