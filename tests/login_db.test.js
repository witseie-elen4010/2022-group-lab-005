'use strict'
const {LogIn,registerUser} = require('../src/services/login_db')
jest.useFakeTimers()
//------------------------------------------------
//code below is for login function

//original format
// test('user login if username input empty and password is empty', () => {
//   LogIn('a', '').then(data => {
//     expect(data).toBe('Please input a username and password')
//   })
// })

// test('user login if username input empty', () => {
//   LogIn('', 'password').then(data => {
//     expect(data).toBe('Please input a username')
//   })
// })

// test('user login if password input empty', () => {
//   LogIn('user', '').then(data => {
//     expect(data).toBe('Please input a password')
//   })
// })

// test('user login if username and password is invalid', () => {
//   LogIn('@dmin', '!@）#$').then(data => {
//     expect(data).toBe('Username and password are invalid.')
//   })
// })

// test('user login if username is invalid', () => {
//   LogIn('@dmin', 'password').then(data => {
//     expect(data).toBe('Please input a valid username')
//   })
// })

// test('user login if password is invalid', () => {
//   LogIn('admin', '!@）#$').then(data => {
//     expect(data).toBe('Please input a valid password')
//   })
// })

// test('user login if username does not exist', () => {
//   LogIn('dadadadada', 'wrongpassword').then(data => {
//     expect(data).toBe('Account does not exist.')
//   })
// })

// test('user login if password is incorrect', () => {
//   LogIn('dadadadada', 'wrongpassword').then(data => {
//     expect(data).toBe('Check username and password.')
//   })
// })
// //winner is a user in the database with password： password
// test('user login is sucessful', () => {
//   LogIn('winner', 'password').then(data => {
//     expect(data).toBe('User is now logged in')
//   })
// })
// //code above is for Login function
// //---------------------------------------
// //---------------------------------------
// //code below is for registeration function


// test('user login if username input empty and password is empty', () => {
//   registerUser('', '').then(data => {
//     expect(data).toBe('Please input a username and password')
//   })
// })

// test('user login if username input empty', () => {
//   registerUser('', 'password').then(data => {
//     expect(data).toBe('Please input a username')
//   })
// })

// test('user login if password input empty', () => {
//   registerUser('user', '').then(data => {
//     expect(data).toBe('Please input a password')
//   })
// })

// test('user login if username and password is invalid', () => {
//   registerUser('@dmin', '!@）#$').then(data => {
//     expect(data).toBe('Username and password are invalid.')
//   })
// })

// test('user login if username is invalid', () => {
//   registerUser('@dmin', 'password').then(data => {
//     expect(data).toBe('Please input a valid username')
//   })
// })

// test('user login if password is invalid', () => {
//   registerUser('admin', '!@）#$').then(data => {
//     expect(data).toBe('Please input a valid password')
//   })
// })

//new format
test('user login if username input empty and password is empty', async() => {
  const data = await LogIn('', '')
  await expect(data).toBe('Please input a username and password')
})

test('user login if username input empty', async() => {
  const data = await LogIn('', 'password')
  await expect(data).toBe('Please input a username')
})

test('user login if password input empty', async() => {
  const data = await LogIn('user', '')
  await expect(data).toBe('Please input a password')
})

test('user login if username and password is invalid', async() => {
  const data = await LogIn('@dmin', '!@）#$')
  await expect(data).toBe('Username and password are invalid.')
})

test('user login if username is invalid', async() => {
  const data = await LogIn('@dmin', 'password')
  await expect(data).toBe('Please input a valid username')
})

test('user login if password is invalid', async() => {
  const data = await LogIn('admin', '!@）#$')
  await expect(data).toBe('Please input a valid password')
})

// test('user login if username does not exist', async() => {
//   const data = await LogIn('dadadadada', 'wrongpassword')
//   await expect(data).toBe('Account does not exist.')
// })
// jest.setTimeout(10000)

// //winner is a user in the database with password： password
// test('user login if password is incorrect', async() => {
//   const data = await LogIn('winner', 'wrongpassword')
//   await expect(data).toBe('Check username and password.')
// })
// jest.setTimeout(10000)

// test('user login is sucessful', async() => {
//   const data = await LogIn('winner', 'password')
//   await expect(data).toBe('User is now logged in')
// })
// jest.setTimeout(10000)

//code above is for Login function
//---------------------------------------
//---------------------------------------
//code below is for registeration function

test('user login if username input empty and password is empty', async() => {
  const data = await registerUser('', '')
  await expect(data).toBe('Please input a username and password')
})

test('user login if username input empty', async() => {
  const data = await registerUser('', 'password')
  await expect(data).toBe('Please input a username')
})

test('user login if password input empty', async() => {
  const data = await registerUser('user', '')
  await expect(data).toBe('Please input a password')
})

test('user login if username and password is invalid', async() => {
  const data = await registerUser('@dmin', '!@）#$')
  await expect(data).toBe('Username and password are invalid.')
})

test('user login if username is invalid', async() => {
  const data = await registerUser('@dmin', 'password')
  await expect(data).toBe('Please input a valid username')
})

test('user login if password is invalid', async() => {
  const data = await registerUser('admin', '!@）#$')
  await expect(data).toBe('Please input a valid password')
})
