'use strict'

const request = new XMLHttpRequest()

//Checks if the user is logged in
window.onload = function() {
    let redirect = false
    if(document.cookie === undefined){
        redirect = true
    }
    else{
        const username = getCookie("username")
        if(username === ""){
            // createFakeUser()
            redirect = true
        }
        else{
            console.log("Sending")
            request.open('POST', '/get/user', true)
            request.addEventListener('load', checkUserExists)
            request.setRequestHeader('Content-type', 'application/json')
            request.send(JSON.stringify({ user: username }))
        }
    }
    if(redirect === true){
        window.location.href = "/login"
    }
}

//Gets an attribute in the cookie
function getCookie(cname) {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
}

function checkUserExists(){
    // Checks if the user in the cookie exists
    console.log(this)
    const response = JSON.parse(this.responseText)
    if(response.recordset.length !== 1){
        window.location.href = "/login"
    }
}

// function createFakeUser(){
//     // Used to check if a fake user is added to the cookie
//     console.log("Creating FakeUser")
//     let fakeUser = "FakerUser"
//     fakeUser = 'username=' + "FakerUser"
//     document.cookie = fakerUser
//     console.log(fakeUser)
// }
