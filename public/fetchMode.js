    'use strict'

    //fetch data from api
    fetch("http://127.0.0.1:3000/api/DarkModeData")

      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
      })

      .then(function (data) {
        
        //set dark mode setting to data from api
        var darkMode = data;
        var textColour = "black";
        var backColour = "white";
        var buttonColour = "grey";

      //  set current current scheme variables
        if (darkMode == "true") {
        textColour = "blue";
        backColour = "black";
        buttonColour = "white";
        }
        else { 
        textColour = "black";
        backColour = "white";
        buttonColour = "grey";
        }

        const helloButton = document.getElementById('helloButton')
        const settingsButton = document.getElementById('settingsButton')

        //redirect to settings page when button is pressed
        settingsButton.addEventListener('click', function () {
          location.href = "http://127.0.0.1:3000/settings";//get using path variable
        }, false)

        //set colour scheme of this page
        document.body.style.color = textColour;
        document.body.style.backgroundColor = backColour;
        helloButton.style.backgroundColor = buttonColour;
        helloButton.style.color = textColour;
        settingsButton.style.backgroundColor = buttonColour;
        settingsButton.style.color = textColour;

        //set current current scheme variables
        sessionStorage.setItem("textColour", textColour);
        sessionStorage.setItem("backColour", backColour);
        sessionStorage.setItem("buttonColour", buttonColour);
      })
      .catch(error => document.write(`Could not fetch verse: ${error}`));