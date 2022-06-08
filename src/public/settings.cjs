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
  document.cookie = 'darkMode='+mode+'; path=/'
  sendModeToServer(mode)
  document.body.classList.remove('bg-light')
  document.body.classList.add('bg-dark')
  location.reload()
}, false)

// when user selects the light mode button send dark mode is false to server
const lightModeButton = document.getElementById('lightButton')
lightModeButton.addEventListener('click', function () {
  const mode = 'false'
  document.cookie = 'darkMode='+mode+'; path=/'
  sendModeToServer(mode)
  document.body.classList.remove('bg-dark')
  document.body.classList.add('bg-light')
  location.reload()
}, false)

// when user selects the light mode button send dark mode is false to server
const backButton = document.getElementById('backButton')
backButton.addEventListener('click', function () {
  location.href = '/'
}, false)
