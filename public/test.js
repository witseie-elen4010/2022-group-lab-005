'use strict'
/* This code will be run when the send button (inside test.html) is pressed. 
   It'll take the text from the textbox and send it to the server.
*/
function sendWordToServer() {
    let word = document.getElementById("wordID").value
    let msgFmServer = document.getElementById("msgFmServer")

    let xhr = new XMLHttpRequest()
    xhr.open("POST", "/myWord")

    // Set the request header
    xhr.setRequestHeader("Content-Type", "application/json")

    // Converting JSON data to string
    let data = JSON.stringify({ wordField: word })
    xhr.send(data)

    // Create a state change callback
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            msgFmServer.innerHTML = xhr.responseText
        }
    }
}