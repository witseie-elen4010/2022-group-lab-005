'use strict'
const request = new XMLHttpRequest()
request.addEventListener('error', onError)

// import { nacl } from '../../node_modules/tweetnacl'

window.onload = function () {
  document.getElementById('loginbutton').addEventListener('click', function (evt) {
    evt.preventDefault()
    // open the post request to the server with url of log
    request.open('POST', '/log', true)
    request.setRequestHeader('Content-type', 'application/json')

    //check if user have inputed anything
    if (document.getElementById('username').value === '') {
      document.getElementById('username').className = 'form-control is-invalid'
      document.getElementById('password').className = 'form-control'
      document.getElementById('output').innerHTML = 'Please input your username'
      console.log(document.getElementById('username').value)
    } 
    else if (document.getElementById('password').value === '') {
      document.getElementById('username').className = 'form-control'
      document.getElementById('password').className = 'form-control is-invalid'
      document.getElementById('output').innerHTML = 'Please input your password'
    } else {
      // get username and password
      const username = document.getElementById('username').value
      const password = document.getElementById('password').value
      const encryptPassword = encryptWithPublicKey(password)
      // send username and password to the server via json
      request.send(JSON.stringify({ usernameInput: username, passwordInput: encryptPassword }))
      // wait for server to respond back
      request.addEventListener('load', receivedValue)
    }
  })

  document.getElementById('registerButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    // open the post request to the server with url of log
    request.open('POST', '/register', true)
    request.setRequestHeader('Content-type', 'application/json')

    //check if user have inputed anything
    if (document.getElementById('username').value === '') {
      document.getElementById('username').className = 'form-control is-invalid'
      document.getElementById('password').className = 'form-control'
      document.getElementById('output').innerHTML = 'Please input your username'
    } 
    else if (document.getElementById('password').value === '') {
      document.getElementById('username').className = 'form-control'
      document.getElementById('password').className = 'form-control is-invalid'
      document.getElementById('output').innerHTML = 'Please input your password'
    } else {
      // get username and password
      const username = document.getElementById('username').value
      const password = document.getElementById('password').value
      const encryptPassword = encryptWithPublicKey(password)
      // send username and password to the server via json
      request.send(JSON.stringify({ usernameInput: username, passwordInput: encryptPassword }))
      // wait for server to respond back
      request.addEventListener('load', receivedValue)
    }
  })
}

function receivedValue () {
  // parse the data received from server
  const response = JSON.parse(this.responseText)
  // get the msg of the json (get the value of a field loggedInOrNot)
  const msg = response.loggedInOrNot
  console.log(msg)
  // out put the value
  document.getElementById('output').innerHTML = msg


  if (msg === 'Please input a valid username') {
    document.getElementById('username').className = 'form-control is-invalid'
    document.getElementById('password').className = 'form-control'
  } else if(msg === "User is now logged in" || msg === "Registration completed"){
    //the code below is to set a cookie value, the only issue with this cookie is that it will 
    //store a new cookie everytime the user logs in or registers, until the browser is closed
    const username = document.getElementById('username').value
    document.cookie = username
    // Let's reset everything
    document.getElementById('username').className = 'form-control'
    document.getElementById('password').className = 'form-control'
    window.location.href = "/loginRedirect"
  }
}

function onError () {
  // Let's tell the user that something wrong happened.
  document.getElementById('output').innerHTML = 'Status: Error communicating with server.'
}

function encryptWithPublicKey(password){
  var public_key = '-----BEGIN PUBLIC KEY-----'
  public_key += 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9/sIkCl5JcgxrkeAUOIjSYR4o'
  public_key += 'ZQmsxKF2oKYxpExb2fafvxUv3ZdXwCLmsjMkvO0gctHaajLKdqLah9TgioMOhrGX'
  public_key += 'a2p8LJIROvd63KJ5Y5Wa5ZCCRa3Nx3pCFY0rKz18OB/1rZ1TJPJnlLOo36+Cq7dm/OIgy6aNFaIFa2MQYQIDAQAB'
  public_key += '-----END PUBLIC KEY-----'
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(public_key)
  const encrypted = encrypt.encrypt(password)
  return encrypted
}