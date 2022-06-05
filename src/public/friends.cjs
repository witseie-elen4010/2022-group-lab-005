'use strict'
const request = new XMLHttpRequest()
window.onload = getFriends()

//Display friends the logged in user have
function getFriends(){
    request.open('POST', 'post/friends', true)
    request.setRequestHeader('Content-type', 'application/json')
    const username = document.cookie
    request.send(JSON.stringify({ usernameInput: username}))
    request.addEventListener('load', recieveFriends)
}

// Recieves query from the database
function recieveFriends(){
    let temp = "";
    const response = JSON.parse(this.responseText)
    for(let i = 0; i < response.recordset.length; i++){
        const response = JSON.parse(this.responseText)
        temp += response.recordset[i].Friend + '<br>';
    }

    const displayedOutput = document.getElementById('output')
 
    displayedOutput.innerHTML = temp
}

