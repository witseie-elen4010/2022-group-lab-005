'use strict'

$(function () {
  checkUser(document.cookie).then(
    (result) => {
      if(result === false){
        window.location.href = "/login"
      }
    }
  ).catch()
})

// when user selects the dark mode button send dark mode is true to server
const darkModeButton = document.getElementById('darkButton')
darkModeButton.addEventListener('click', function () {
  const mode = 'true'
  document.body.classList.remove('light-mode')
  document.body.classList.add('dark-mode')
  sessionStorage.setItem('mode', mode)
  sendModeToServer(mode)
}, false)

// when user selects the light mode button send dark mode is false to server
const lightModeButton = document.getElementById('lightButton')
lightModeButton.addEventListener('click', function () {
  const mode = 'false'
  document.body.classList.remove('dark-mode')
  document.body.classList.add('light-mode')
  sessionStorage.setItem('mode', mode)
  sendModeToServer(mode)
}, false)

// when user selects the light mode button send dark mode is false to server
const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/'
}, false)
