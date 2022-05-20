
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
  else
  {
    document.getElementById("output").innerHTML = "username " + username + "       password : " +password;
  }
}
// if(!(select name from YourTable where name == username))
// {
//     document.getElementById("output").innerHTML = "username does not exist";
// }
// else if ( !(select password from YourTable where name == username))
// {
//     document.getElementById("output").innerHTML = "password is incorrect";
// }
// else
// {
//     direct to another page 
//     set online = true;
// }