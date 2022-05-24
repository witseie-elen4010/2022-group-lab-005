'use strict'
const { get } = require('./poolManagement')

async function LogIn (username, password) {
  // future improvements
  // -----------------------------------------------
  // const queryUser = await pool.request().query("SELECT COUNT(*) As numUser FROM User_Details WHERE Username = '" + username +"';");
  // console.log(queryUser)
  // console.log("before query");
  // let list = JSON.stringify(queryUser.recordset[0])
  // let obj = JSON.parse(list);
  // const msg = parseInt(obj['numUser'])
  // console.log(msg);
  // if(obj < 1)
  // {
  //     console.log("is is ssmaller then ? ")
  //     return "The Username does not exist"
  // }
  // else
  // {
  // -------------------------------------

  // check inputs without the database
  if (username === '' & password === '') {
    return 'Please input a username and password'
  } else if (username === '') {
    return 'Please input a username'
  } else if (password === '') {
    return 'Please input a password'
  }

  if (/^[a-zA-Z]+$/.test(username) === false & /^[a-zA-Z]+$/.test(password) === false) {
    return 'Username and password are invalid.'
  } else if (/^[a-zA-Z]+$/.test(username) === false) {
    return 'Please input a valid username'
  } else if (/^[a-zA-Z]+$/.test(password) === false) { // Why can the password not contain numbers or special characters?
    return 'Please input a valid password'
  }

  const pool = await get('default')
  // query from the database , find the password where username = inputed username
  const queryResult = await pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username + "';")
  // convert the json into password that can be used
  const list = JSON.stringify(queryResult.recordset[0])

  try {
    if (list !== undefined) { // If this is true, then the username does not exist.
      const obj = JSON.parse(list)
      if (obj.Password === password) {
        return 'User is now logged in'
      } else {
        return 'Check username and password.'
      }
    } else {
      return 'Account does not exist.'
    }
    // }
    // return pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username +"';")
  } catch (err) {
    console.log(err)
  }
}
module.exports = LogIn
