    'use strict'

    //fetch data from api
    fetch("/api/DarkModeData")

      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
      })

      .then(function (data) {
        
        //set dark mode setting to data from api
        let darkMode = data;
        let textColour = "black";
        let backColour = "white";
        let buttonColour = "grey";

      //  set current current scheme variables
        if (darkMode === "true") {
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
          location.href = "/settings";
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