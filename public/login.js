// const { get } = require('./poolManagement')

// const { format } = require("mysql");
let request = new XMLHttpRequest();


document.getElementById("output").style.display = "None";//switch this output off until button is clicked

function loggingIn()
{

  request.open('POST', '/log', true);

  request.setRequestHeader("Content-type", "application/json");

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  // if(username === "")
  // {
  //   document.getElementById("output").innerHTML = "Please enter a username";

  // }
  // else if(password === "")
  // {
  //   document.getElementById("output").innerHTML = "Please enter a password";
  // }
  // else
  // 
  request.send(JSON.stringify({ usernameInput: username , passwordInput: password }));

  request.addEventListener('load', recievedValue);

  document.getElementById("output").style.display = "initial";//initial is on
}
function recievedValue()
{
    const response = JSON.parse(this.responseText);
    const msg = response['loggedInOrNot'];
    document.getElementById("output").innerHTML = msg;
};