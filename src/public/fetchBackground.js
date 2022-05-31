'use strict'
// Takes long to fetch, would it be easier to do this in another page 
// fetch data from api
fetch('/game/api/BackgroundData')

  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    return response.text()
  })

  .then(function (data) {
    // set background setting to data from api
    // Get HTML head element

    const background = document.querySelector('html, .background');

    if (data === "Mountains") {
     // document.body.style.backgroundImage = 'url("/src/public/Mountain.jpg")';
     background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")');
    } else {
      if (data === "Forest") {
       // document.body.style.backgroundImage = 'url("/src/public/Forest.jpg")';
       background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")');
      }
      else {
        if (data === "Beach") {
        //  document.body.style.backgroundImage = 'url("/src/public/Beach.jpg")';
        background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")');
        }
      }
    }
    var head = document.getElementsByTagName('HEAD')[0];

  })
  .catch(error => document.write(`Fetch failed: ${error}`))
