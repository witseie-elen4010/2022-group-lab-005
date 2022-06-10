'use strict'

function getMode (username) {
  $.get('/user/api/DarkModeData', { usernameInput: username })
    .done(function (response) {
      console.log(response)
      console.log(username)
      const darkMode = response.recordset[0].isDarkmode
      document.cookie = 'darkMode=' + darkMode + ';'
      window.location.href = '/loginRedirect'
    })
    .fail(function (serverResponse) {
      alert(serverResponse)
    })
}
