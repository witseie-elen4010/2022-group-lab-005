'use strict'
const { get } = require('./poolManagement.cjs')
const { resolve } = require('path')

async function LogIn (username, password) {
  const sqlCode = `SELECT Password FROM Users WHERE Username = '${username}'`
  return new Promise((resolve, reject) => {
    const validInput = validateInput(username, password)
    if (validInput === 'valid') {
      get('default').then(
        (pool) => pool.request().query(sqlCode).then(
          (result) => {
            const list = JSON.stringify(result.recordset[0])
            try {
              if (list !== undefined) { // If this is true, then the username does not exist.
                const obj = JSON.parse(list)
                if (obj.Password === password) {
                  resolve('User is now logged in')
                } else {
                  resolve('Check username and password.')
                }
              } else {
                resolve('Account does not exist.')
              }
            } catch (err) {
              console.log(err)
              reject(err)
            }
          }
        ).catch(reject)
      ).catch(reject)
    } else {
      resolve(validInput)
    }
  })
}

async function registerUser (username, password) {
  const sqlCodeCheckUserExist = `SELECT Password FROM Users WHERE Username = '${username}'`
  const sqlCode = `INSERT INTO Users (Username, Password)
  VALUES ('${username}','${password}');
  INSERT INTO Settings (Username, Background, isDarkmode)
  VALUES ('${username}', 'None', 'false');`
  return new Promise((resolve, reject) => {
    const validInput = validateInput(username, password)
    if (validInput === 'valid') {
      get('default').then(
        (pool) => pool.request().query(sqlCodeCheckUserExist).then( // first query to see if the inputed username exists
          (result) => {
            const list = JSON.stringify(result.recordset[0])
            try {
              if (list === undefined) { // undefined list shows that username does not exist
                get('default').then(
                  (pool) => pool.request().query(sqlCode).then(
                    () => {
                      resolve()
                    }
                  ).catch(reject)
                ).catch(reject)

                resolve('Registration completed')
              } else {
                resolve('Account exists already.')
              }
            } catch (err) {
              console.log(err)
              reject(err)
            }
          }
        ).catch(reject)
      ).catch(reject)
    } else {
      resolve(validInput)
    }
  })
}

async function getUser (username) {
  // Returns whether the user exists
  const sqlCode = `SELECT * FROM [dbo].[Users]
  WHERE [dbo].[Users].Username = '${username}';`
  return new Promise((resolve, reject) => {
    get('default').then(
      (pool) => pool.request().query(sqlCode).then(
        (result) => {
          resolve(result)
        }
      ).catch(reject)
    ).catch(reject)
  })
}

function validateInput (username, password) {
  // validate username input, password does not need to be validated due to hashing
  if (username === '' & password === '') {
    return 'Please input a username and password'
  } else if (username === '') {
    return 'Please input a username'
  } else if (password === '') {
    return 'Please input a password'
  } else if (/^[a-zA-Z0-9]+$/.test(username) === false) {
    return 'Please input a valid username'
  } else {
    return 'valid'
  }
}

module.exports = { LogIn, registerUser, getUser , validateInput }
