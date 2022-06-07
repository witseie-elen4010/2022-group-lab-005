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
// Window.onload will not work with the jquery from the user check, this can be added after the user check with jquery tho
window.onload = function () {
  // getFriends()
  const username = getFromCookie('username', document.cookie)
  getPendingFriends(username) // i think this got something to do with the load,

  // when this is used tog ether the output becomes the same for friend list and pending friend list
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
  const addFriendResult = document.getElementById('output')
  alert(msg)
  addFriendResult.innerHTML = msg
  document.location.reload()
}
