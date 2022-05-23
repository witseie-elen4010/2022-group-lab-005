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

  // check inputs without the databse
  if (username === '') {
    return 'Please input a username'
  } else if (password === '') {
    return 'Please input a password'
  }
  if (/^[a-zA-Z]+$/.test(username) === false) {
    return 'Please input a valid username'
  } else if (/^[a-zA-Z]+$/.test(password) === false) {
    return 'Please input a valid password'
  }

  const pool = await get('default')
  // query from the database , find the password where username = inputed username
  const queryResult = await pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username + "';")
  // convert the json into password that can be used
  list = JSON.stringify(queryResult.recordset[0])
  obj = JSON.parse(list)
  if (obj.Password === password) {
    return 'User is now logged in'
  } else {
    return 'Password is incorrect'
  }
  // }
  // return pool.request().query("SELECT Password FROM User_Details WHERE Username = '" + username +"';")
}
module.exports = LogIn
