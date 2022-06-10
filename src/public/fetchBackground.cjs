'use strict'

$(function () {
  getBackground()
})

function getBackground() {
  const username = getFromCookie('username', document.cookie)
  $.post('/game/api/BackgroundData', { usernameInput: username })
    .done(function (response) {
      const new_response = response.recordset[0].Background
      console.log(new_response)
      const background = document.querySelector('body')

      if (new_response === 'Mountains') {
        background.style.setProperty('background-image', 'url("/src/public/Mountain.jpg")')
      } else if (new_response === 'Forest') {
        background.style.setProperty('background-image', 'url("/src/public/Forest.jpg")')
      } else if (new_response === 'Beach') {
        background.style.setProperty('background-image', 'url("/src/public/Beach.jpg")')
      }
    })
    .fail(function (serverResponse) {
      alert(serverResponse)
    })
}

