'use strict'

// fetch data from api
fetch('/user/api/DarkModeData')

  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    return response.text()
  })

  .then(function (data) {
    // set dark mode setting to data from api
    const darkMode = data
    let textColour = 'black'
    let backColour = 'white'
    let buttonColour = 'grey'
    const dark = document.querySelectorAll('.dark-mode')
    document.style = ".dark-mode";
    //  set current current scheme variables
    if (darkMode === 'true') {
      textColour = 'blue'
      backColour = 'black'
      buttonColour = 'white'
      document.body.classList.toggle("dark-mode");
    } else {
      textColour = 'black'
      backColour = 'white'
      buttonColour = 'grey'
    }

    const settingsButton = document.getElementById('settingsButton')

    // set colour scheme of this page
    // document.body.style.color = textColour
    // document.body.style.backgroundColor = backColour
    // settingsButton.style.backgroundColor = buttonColour
    // settingsButton.style.color = textColour

    // // set current current scheme variables
    // sessionStorage.setItem('textColour', textColour)
    // sessionStorage.setItem('backColour', backColour)
    // sessionStorage.setItem('buttonColour', buttonColour)
  })
  .catch(error => document.write(`Fetch failed: ${error}`))
