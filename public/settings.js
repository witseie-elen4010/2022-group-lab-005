'use strict'

let results = JSON.stringify();
let textColour = sessionStorage.getItem("textColour");
let backColour = sessionStorage.getItem("backColour");
let buttonColour = sessionStorage.getItem("buttonColour");

// when user selects the dark mode button send dark mode is true to server
const darkModeButton = document.getElementById('darkButton')
darkModeButton.addEventListener('click', function () {
    textColour = "blue";
    backColour = "black";
    buttonColour = "white";
    let mode = "true";
    sendModeToServer(mode);
}, false)

// when user selects the light mode button send dark mode is false to server
const lightModeButton = document.getElementById('lightButton')
lightModeButton.addEventListener('click', function () {
    textColour = "black";
    backColour = "white";
    buttonColour = "grey";
    let mode = "false";
    sendModeToServer(mode);
}, false)
// when user selects the light mode button send dark mode is false to server
const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
    location.href = "/";
}, false)
//set colour scheme of this page
document.body.style.color = textColour;
document.body.style.backgroundColor = backColour;
darkModeButton.style.backgroundColor = buttonColour;
darkModeButton.style.color = textColour;
lightModeButton.style.backgroundColor = buttonColour;
lightModeButton.style.color = textColour;


//send colour scheme variables to other html files
sessionStorage.setItem("textColour", textColour);
sessionStorage.setItem("backColour", backColour);
sessionStorage.setItem("buttonColour", buttonColour);


