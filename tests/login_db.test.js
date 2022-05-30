'use strict'
const {LogIn,registerUser} = require('../src/services/login_db')

//------------------------------------------------
//code below is for login function
test('user login if username input empty and password is empty', () => {
  LogIn('', '').then(data => {
    expect(data).toBe('Please input a username and password')
  })
})

test('user login if username input empty', () => {
  LogIn('', 'password').then(data => {
    expect(data).toBe('Please input a username')
  })
})

test('user login if password input empty', () => {
  LogIn('user', '').then(data => {
    expect(data).toBe('Please input a password')
  })
})

test('user login if username and password is invalid', () => {
  LogIn('@dmin', '!@）#$').then(data => {
    expect(data).toBe('Username and password are invalid.')
  })
})

test('user login if username is invalid', () => {
  LogIn('@dmin', 'password').then(data => {
    expect(data).toBe('Please input a valid username')
  })
})

test('user login if password is invalid', () => {
  LogIn('admin', '!@）#$').then(data => {
    expect(data).toBe('Please input a valid password')
  })
})

test('user login if username does not exist', () => {
  LogIn('dadadadada', 'wrongpassword').then(data => {
    expect(data).toBe('Account does not exist.')
  })
})

test('user login if password is incorrect', () => {
  LogIn('dadadadada', 'wrongpassword').then(data => {
    expect(data).toBe('Check username and password.')
  })
})
//winner is a user in the database with password： password
test('user login is sucessful', () => {
  LogIn('winner', 'password').then(data => {
    expect(data).toBe('User is now logged in')
  })
})
//code above is for Login function
//---------------------------------------
//---------------------------------------
//code below is for registeration function


test('user login if username input empty and password is empty', () => {
  registerUser('', '').then(data => {
    expect(data).toBe('Please input a username and password')
  })
})

test('user login if username input empty', () => {
  registerUser('', 'password').then(data => {
    expect(data).toBe('Please input a username')
  })
})

test('user login if password input empty', () => {
  registerUser('user', '').then(data => {
    expect(data).toBe('Please input a password')
  })
})

test('user login if username and password is invalid', () => {
  registerUser('@dmin', '!@）#$').then(data => {
    expect(data).toBe('Username and password are invalid.')
  })
})

test('user login if username is invalid', () => {
  registerUser('@dmin', 'password').then(data => {
    expect(data).toBe('Please input a valid username')
  })
})

test('user login if password is invalid', () => {
  registerUser('admin', '!@）#$').then(data => {
    expect(data).toBe('Please input a valid password')
  })
})