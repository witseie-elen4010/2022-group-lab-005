'use strict'

const darkMode = sessionStorage.getItem('mode')

//  set current current scheme
if (darkMode === 'true') {
  document.body.classList.remove('light-mode')
  document.body.classList.add('dark-mode')
} else {
  document.body.classList.remove('dark-mode')
  document.body.classList.add('light-mode')
}
