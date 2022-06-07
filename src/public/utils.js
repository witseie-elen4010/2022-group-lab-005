'use strict'

// Checks if the user is logged in
export async function checkUser (cookie) {
  return new Promise((resolve, reject) => {
    if (cookie === undefined) {
      resolve(false)
    } else {
      const username = getFromCookie('username', cookie)
      if (username === '') {
        // createFakeUser()
        resolve(false)
      } else {
        $.post('/get/user', {
          user: username
        }).done(
          function (responseText) {
            // Checks if the user in the cookie exists
            if (responseText.recordset.length !== 1) {
              resolve(false)
            } else {
              resolve(true)
            }
          }).fail(
          function (serverResponse) {
            reject(serverResponse)
          })
      }
    }
  })
}

// Gets an attribute in the cookie
export function getFromCookie (cname, cookie) {
  const name = cname + '='
  const decodedCookie = decodeURIComponent(cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export function createFakeUser () {
  // Used to check if a fake user is added to the cookie
  console.log('Creating FakeUser')
  let fakeUser = 'FakerUser'
  fakeUser = 'username=' + 'FakerUser'
  console.log(fakeUser) // User for testing so the console.log stays
  return fakeUser
}
