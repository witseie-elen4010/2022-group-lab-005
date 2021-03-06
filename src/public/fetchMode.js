'use strict'

function getMode (username) {
  $.get('/user/api/DarkModeData', { usernameInput: username })
    .done(function (response) {
      const darkMode = response.recordset[0].isDarkmode
      document.cookie = 'darkMode=' + darkMode + '; path=/'
      window.location.href = '/loginRedirect'
    })
    .fail(function (serverResponse) {
      alert(serverResponse)
    })
}
