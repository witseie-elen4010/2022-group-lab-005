'use strict'
const { LogIn, registerUser, getUser, validateInput } = require('../src/services/loginDb')

test('user input if username input empty and password is empty', () => {
  const data = validateInput('', '')
  expect(data).toBe('Please input a username and password')
})

test('user input if username input empty', async () => {
  const data = validateInput('', 'password')
  expect(data).toBe('Please input a username')
})

test('user input if password input empty', async () => {
  const data = validateInput('user', '')
  expect(data).toBe('Please input a password')
})

test('user input if username is invalid', () => {
  const data = validateInput('@dmin', 'password')
  expect(data).toBe('Please input a valid username')
})

test('user input if everthing is valid', () => {
  const data = validateInput('winner', 'fbe789cb41b2fc32df9b89cacff9830d85ac62de09ca48395ebcef69e069160a')
  expect(data).toBe('valid')
})

test('user login if username does not exist', async () => {
  const data = await LogIn('dadadadada', 'wrongpassword')
  await expect(data).toBe('Account does not exist.')
})
jest.setTimeout(10000)

// winner is a user in the database with password：fbe789cb41b2fc32df9b89cacff9830d85ac62de09ca48395ebcef69e069160a
test('user login if password is incorrect', async () => {
  const data = await LogIn('winner', 'wrongpassword')
  await expect(data).toBe('Check username and password.')
})
jest.setTimeout(10000)

test('user login is sucessful', async () => {
  const data = await LogIn('winner', 'fbe789cb41b2fc32df9b89cacff9830d85ac62de09ca48395ebcef69e069160a')
  await expect(data).toBe('User is now logged in')
})
jest.setTimeout(10000)

// code above is for Login function
// ---------------------------------------
// ---------------------------------------
// code below is for registeration function
// did not test for insertion as it will only work once
// validation for registration is already tested above
test('user registration if username exist already', async () => {
  const data = await registerUser('winner', 'wrongpassword')
  await expect(data).toBe('Account exists already.')
})

// getUser test
test('Check if the user exists', async () => {
  const data = await getUser('winner')
  await expect(data.recordset.length).toBe(1)
})
jest.setTimeout(10000)

test('Check if the user exists', async () => {
  const data = await getUser('use')
  await expect(data.recordset.length).toBe(0)
})

jest.setTimeout(10000)
