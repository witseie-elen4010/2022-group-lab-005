'use strict'

$(function () {
  checkUser(document.cookie).then(
    (result) => {
      if (result === false) {
        window.location.href = '/login'
      }
    }
  ).catch()
})

document.getElementById('logoutButton').addEventListener('click', () => {
  document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'darkMode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  window.location.href = '/login'
})
