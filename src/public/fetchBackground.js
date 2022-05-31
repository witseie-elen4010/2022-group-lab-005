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
    const background = document.querySelector('html, .background')
    let back = ''

    // set current background to user's background in database
    if (data === 'Mountains') {
      back = 'Mountains'
      background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")')
    } else {
      if (data === 'Forest') {
        back = 'Forest'
        background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")')
      } else {
        if (data === 'Beach') {
          back = 'Beach'
          background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")')
        }
      }
    }

    // save current background in session storage
    sessionStorage.setItem('background', back)
  }).catch(error => document.write(`Fetch failed: ${error}`))
