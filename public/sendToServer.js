'use strict'

let request = new XMLHttpRequest();
request.addEventListener('error', onError);

function sendModeToServer(darkModeBool) {

    let darkMode = darkModeBool;
    request.open('POST', '/changeMode', true);

    //send request to server
    request.setRequestHeader("Content-type", "application/json");

    // convert the dark mode setting to a JSON object and send it to the server.
    request.send(JSON.stringify({ darkMode: darkMode }));

    request.addEventListener('load', dataReceived);

    let statusTag = document.getElementById("status")
    statusTag.innerHTML = 'Status: Sent word to server'
}

function dataReceived() {
    // Let's get parse the data we just received.
    const response = JSON.parse(this.responseText);

    const msg = response['message'];

    let msgFmServer = document.getElementById("msgFmServer")
    msgFmServer.innerHTML = msg

    let statusTag = document.getElementById("status")
    statusTag.innerHTML = 'Status: mode is being logged.'
}

function onError() {
    let statusTag = document.getElementById("status")
    statusTag.innerHTML = 'Status: Error communicating with server.'
}