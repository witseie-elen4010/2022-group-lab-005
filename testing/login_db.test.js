const LogIn = require('../services/login_db')

test('user login if username input empty', () => {
  LogIn('', '').then(data => {
    expect(data).toBe('Please input a username')
  })
})

test('user login if password input empty', () => {
  LogIn('admin', '').then(data => {
    expect(data).toBe('Please input a password')
  })
})

test('user login if username is invalid', () => {
  LogIn('!@#$', 'test').then(data => {
    expect(data).toBe('Please input a valid username')
  })
})

test('user login if password is invalid', () => {
  LogIn('admin', '!@#$').then(data => {
    expect(data).toBe('Please input a valid password')
  })
})
