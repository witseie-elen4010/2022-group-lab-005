 document.getElementById("output").style.display = "None";//switch this output off until button is clicked
 document.getElementById("LoginButton").onclick = function(){
    document.getElementById("output").style.display = "initial";//initial is on
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    document.getElementById("output").innerHTML = "username " + username + " --- password : " +password;
 }