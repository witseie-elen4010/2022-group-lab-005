
var textColour = sessionStorage.getItem("textColour");
var backColour = sessionStorage.getItem("backColour", backColour);
var buttonColour  = sessionStorage.getItem("buttonColour", buttonColour);


// change colour scheme if button is pressed
 const darkModeButton = document.getElementById('darkButton')
 darkModeButton.addEventListener('click', function () {
     textColour = "blue";
     backColour = "black";
     buttonColour = "white"; 
 }, false)

const lightModeButton = document.getElementById('lightButton')
lightModeButton.addEventListener('click', function () {
     textColour = "black";
     backColour = "white";
     buttonColour = "grey"; 
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
