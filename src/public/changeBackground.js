'use strict'
const background = document.querySelector('html, .background');
let pageBackground = sessionStorage.getItem('background')
const forestButton = document.getElementById('forestButton')

if (pageBackground === "Mountains") {
    // document.body.style.backgroundImage = 'url("/src/public/Mountain.jpg")';
    background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")');
} else if (pageBackground  === "Forest") {
        // document.body.style.backgroundImage = 'url("/src/public/Forest.jpg")';
        background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")');
    }
    else if (pageBackground  === "Beach") {
            //  document.body.style.backgroundImage = 'url("/src/public/Beach.jpg")';
            background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")');
        
    }


forestButton.addEventListener('click', function () {
    background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")');
    const back = 'Forest';
    sendBackgroundToServer(back);
}, false)


const sunBeachButton = document.getElementById('sunBeachButton')
sunBeachButton.addEventListener('click', function () {
    background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")');
    const back = 'Beach';
    sendBackgroundToServer(back);
}, false)

const mountainsButton = document.getElementById('mountainsButton')
mountainsButton.addEventListener('click', function () {
    background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")');
    const back = 'Mountains';
    sendBackgroundToServer(back);
}, false)

const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/game/game_debug'
}, false)