'use strict'
// Takes long to fetch, would it be easier to do this in another page 
// fetch data from api
fetch('/user/api/BackgroundData')

  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    return response.text()
  })

  .then(function (data) {
    // set dark mode setting to data from api

    const background = document.querySelector('html, .background');
    //  set current current scheme variables
    if (data === "Mountains") {
        document.body.style.backgroundImage='url("/src/public/Mountain.jpg")';
    } else {
        if (data === "Forest") {
            document.body.style.backgroundImage='url("/src/public/Forest.jpg")';
        }
        else {
            if (data === "Beach") {
                document.body.style.backgroundImage='url("/src/public/Forest.jpg")';
            }
        }
    }

  })
  .catch(error => document.write(`Fetch failed: ${error}`))
