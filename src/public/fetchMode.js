'use strict'
//the issue is that fetch only happens in home page, the update is not instant
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
    sessionStorage.setItem("mode", darkMode);

  })
  .catch(error => document.write(`Fetch failed: ${error}`))
