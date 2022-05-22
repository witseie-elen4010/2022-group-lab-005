// const { get } = require('./poolManagement')

// const { format } = require("mysql");

var form = document.getElementById("form-id");


document.getElementById("output").style.display = "None";//switch this output off until button is clicked
document.getElementById("LoginButton").onclick = function()
{
  document.getElementById("output").style.display = "initial";//initial is on
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if(username == "")
  {
    document.getElementById("output").innerHTML = "Please enter a username";
  }
  else if(password == "")
  {
    document.getElementById("output").innerHTML = "Please enter a password";
  }
  var form = document.getElementById("LogIn-Form")
  document.getElementById("your-id").addEventListener("click", function () {
    form.submit();
  });
}