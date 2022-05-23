'use strict'

    var results = JSON.stringify();
    var textColour = sessionStorage.getItem("textColour");
    var backColour = sessionStorage.getItem("backColour");
    var buttonColour = sessionStorage.getItem("buttonColour");

// when user selects the dark mode button send dark mode is true to server
    const darkModeButton = document.getElementById('darkButton')
    darkModeButton.addEventListener('click', function () {
        textColour = "blue";
        backColour = "black";
        buttonColour = "white"; 
        var mode = "true";
        sendModeToServer(mode);
    }, false)

// when user selects the light mode button send dark mode is false to server
    const lightModeButton = document.getElementById('lightButton')
    lightModeButton.addEventListener('click', function () {
      textColour = "black";
      backColour = "white";
      buttonColour = "grey";
      var mode = "false";
      sendModeToServer(mode);
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

  
  // When response.text() has succeeded, the `then()` handler is called with
  // the text, and we copy it into the `poemDisplay` box.
  //.then( text => document.write(text) )
  // Catch any errors that might happen, and display a message
  // in the `poemDisplay` box.
  

// const fetchPromise = fetch("http://127.0.0.1:3000/api/testconnection");
// fetchPromise.then(response => {
//   return response.json();
// }).then(User_Details=> {
//   const names = User_Details.map(users => users.recordsets).join("\n");
//     const darkModeButton = document.getElementById('darkButton')
//     darkModeButton.addEventListener('click', function () {
//       //  textColour = "blue";
//       //  backColour = "black";
//       //  buttonColour = "white"; 
      
//       const para = document.createElement('p')
//       let obj = JSON.parse(data);

//       const text = document.createTextNode(names)
//       //document.getElementById("demo").innerHTML = obj.Darkmode;
//       para.appendChild(text)
//       document.body.appendChild(para)
//     }, false)
// });

  



// let response = fetch("http://127.0.0.1:3000/api/testconnection");
// // change colour scheme if button is pressed
// const darkModeButton = document.getElementById('darkButton')
// darkModeButton.addEventListener('click', function () {
//   //  textColour = "blue";
//   //  backColour = "black";
//   //  buttonColour = "white"; 

//   const para = document.createElement('p')
//   const text = document.createTextNode(output)
//   console.log(response)
//   para.appendChild(text)
//   document.body.appendChild(para)
// }, false)



