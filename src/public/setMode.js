'use strict'

setModeForPage()
function setModeForPage() {
  let isDarkmode = getFromCookie('darkMode', document.cookie)
  //  set current current scheme
  if (isDarkmode === 'true') {
    document.body.classList.remove('bg-light')
    document.body.classList.add('bg-dark')
  } else {
    document.body.classList.remove('bg-dark')
    document.body.classList.add('bg-light')
  }
}
