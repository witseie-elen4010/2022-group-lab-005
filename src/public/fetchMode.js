'use strict'


$(document).ready(function () {
  //const fake = createFakeUser()
  //document.cookie = fake
  checkUser(document.cookie).then(
    (result) => {
      if(result === false){
        window.location.href = "/login"
      }
    }
  ).catch()
})

function getMode () {
  request.open('GET', '/user/api/DarkModeData', true)
  request.addEventListener('load', setMode)
  request.send()
}

function setMode () {
  const response = JSON.parse(this.responseText)
  sessionStorage.setItem('mode', response)
}
