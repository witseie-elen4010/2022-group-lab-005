// const { get } = require('./poolManagement')

// const { format } = require("mysql");

var form = document.getElementById("form-id");


document.getElementById("output").style.display = "None";//switch this output off until button is clicked

document.getElementById("LoginButton").addEventListener("click", function () 
{
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if(username == "")
  {
    document.getElementById("output").innerHTML = "Please enter a username";
    document.getElementById("output").style.display = "initial";//initial is on
  }
  else if(password == "")
  {
    document.getElementById("output").innerHTML = "Please enter a password";
    document.getElementById("output").style.display = "initial";//initial is on
  }
  else
  {
    var form = document.getElementById('login')
    form.submit();
    console.log("Submit ???")
  }
});