'use strict'
const request = new XMLHttpRequest()
$(function () {
  checkUser(document.cookie).then(
    (result) => {
      if (result === false) {
        window.location.href = '/login'
      }
    }
  ).catch()
})
// All the commented out functions will work once Jquery is implemented
window.onload = function () {
  // getFriends()
  const username = getFromCookie('username', document.cookie)
  // getPendingFriends(username)
  getFriendRequests(username)
  document.getElementById('addButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    addFriend(username)
  })
}

// Display friends the logged in user have
function getFriends (username) {
  request.open('POST', 'post/friends', true)
  request.setRequestHeader('Content-type', 'application/json')
  request.send(JSON.stringify({ usernameInput: username }))
  request.addEventListener('load', recieveFriends)
}

// Recieves query from the database
function recieveFriends () {
  let temp = ''
  const response = JSON.parse(this.responseText)
  for (let i = 0; i < response.recordset.length; i++) {
    const response = JSON.parse(this.responseText)
    temp += response.recordset[i].Invitee + '<br>'
  }
  const friendList = document.getElementById('Friend list')
  friendList.innerHTML = temp
}

function getPendingFriends (username) {
  request.open('POST', 'post/pending', true)
  request.setRequestHeader('Content-type', 'application/json')
  request.send(JSON.stringify({ usernameInput: username }))
  request.addEventListener('load', recievePendingFriends)
}

function recievePendingFriends () {
  let temp = ''
  const response = JSON.parse(this.responseText)
  for (let i = 0; i < response.recordset.length; i++) {
    const response = JSON.parse(this.responseText)
    temp += response.recordset[i].Invitee + '<br>'
  }
  const friendPending = document.getElementById('pending')
  friendPending.innerHTML = temp
}

function getFriendRequests (username) {
  request.open('POST', 'post/friendRequest', true)
  request.setRequestHeader('Content-type', 'application/json')
  request.send(JSON.stringify({ usernameInput: username }))
  request.addEventListener('load', receiveFriendRequests)
}

function receiveFriendRequests () {
  const response = JSON.parse(this.responseText)
  if (response.recordset.length > 0) {
    document.getElementById('friend').innerHTML = ''
  }
  for (let i = 0; i < response.recordset.length; i++) {
    const response = JSON.parse(this.responseText)
    const inviter = response.recordset[i].Inviter

    // create the lables and buttons
    const label = document.createElement('label')
    label.innerHTML = inviter
    const acceptBtn = document.createElement('button')
    acceptBtn.className = ('w-20 btn btn-primary col-3 ')
    const declineBtn = document.createElement('button')
    declineBtn.className = ('w-20 btn btn-primary col-3 ')

    // button functions
    acceptBtn.innerHTML = 'Accept'
    acceptBtn.setAttribute('user', inviter)
    acceptBtn.onclick = function () {
      acceptDeclineFriend(getFromCookie('username', document.cookie), acceptBtn.getAttribute('user'), 'accept')
    }
    declineBtn.innerHTML = 'Decline'
    declineBtn.onclick = function () {
      acceptDeclineFriend(getFromCookie('username', document.cookie), acceptBtn.getAttribute('user'), 'decline')
    }
    // adding buttons to screen
    document.getElementById('friend').appendChild(label)
    document.getElementById('friend').appendChild(document.createTextNode(' '))
    document.getElementById('friend').appendChild(acceptBtn)
    document.getElementById('friend').appendChild(document.createTextNode(' '))
    document.getElementById('friend').appendChild(declineBtn)
    document.getElementById('friend').appendChild(document.createElement('br'))
  }
}

function addFriend (username) {
  request.open('POST', 'post/addFriend', true)
  request.setRequestHeader('Content-type', 'application/json')
  const friend = document.getElementById('Friend').value
  request.send(JSON.stringify({ usernameInput: username, friendInput: friend }))
  request.addEventListener('load', recieveAddedFriends)
}

function recieveAddedFriends () {
  const response = JSON.parse(this.responseText)
  const msg = response.Status
  alert(msg)
  document.location.reload()
}

function acceptDeclineFriend (username, friend, acceptOrDecline) {
  request.open('POST', 'post/updateFriend', true)
  request.setRequestHeader('Content-type', 'application/json')
  request.send(JSON.stringify({ usernameInput: username, friendInput: friend, acceptInput: acceptOrDecline }))
  request.addEventListener('load', receiveAcceptDeclineFriend)
}

function receiveAcceptDeclineFriend () {
  const response = JSON.parse(this.responseText)
  const msg = response.updateFriendRequest
  alert(msg)
  document.location.reload()
}
