'use strict'
const background = document.querySelector('html, .background');

const forestButton = document.getElementById('forestButton')
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