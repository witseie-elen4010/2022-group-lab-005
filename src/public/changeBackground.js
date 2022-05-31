'use strict'
const background = document.querySelector('html, .background');
// when user selects the dark mode button send dark mode is true to server
const forestButton = document.getElementById('forestButton')
forestButton.addEventListener('click', function () {
    background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")');
}, false)

// when user selects the light mode button send dark mode is false to server
const sunBeachButton = document.getElementById('sunBeachButton')
sunBeachButton.addEventListener('click', function () {
    background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")');
}, false)

const mountainsButton = document.getElementById('mountainsButton')
mountainsButton.addEventListener('click', function () {
    background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")');
}, false)