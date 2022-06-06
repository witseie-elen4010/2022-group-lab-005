'use strict'
const request = new XMLHttpRequest()
window.onload = function () {
  // getFriends()
  // getPendingFriends() //i think this got something to do with the load,
  // when this is used tog ether the output becomes the same for friend list and pending friend list
  document.getElementById('addButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    addFriend()
  })
}

// Display friends the logged in user have
function getFriends () {
  request.open('POST', 'post/friends', true)
  request.setRequestHeader('Content-type', 'application/json')
  const username = document.cookie
  request.send(JSON.stringify({ usernameInput: username }))
  request.addEventListener('load', recieveFriends)
}

// Recieves query from the database
function recieveFriends () {
  let temp = ''
  const response = JSON.parse(this.responseText)
  for (let i = 0; i < response.recordset.length; i++) {
    const response = JSON.parse(this.responseText)
    temp += response.recordset[i].Friend + '<br>'
  }

  const friendList = document.getElementById('Friend list')

  friendList.innerHTML = temp
}

function getPendingFriends () {
  request.open('POST', 'post/pending', true)
  request.setRequestHeader('Content-type', 'application/json')
  const username = document.cookie
  request.send(JSON.stringify({ usernameInput: username }))
  request.addEventListener('load', recievePendingFriends)
}

function recievePendingFriends () {
  let temp = ''
  const response = JSON.parse(this.responseText)
  for (let i = 0; i < response.recordset.length; i++) {
    const response = JSON.parse(this.responseText)
    temp += response.recordset[i].Friend + '<br>'
  }

  const friendPending = document.getElementById('pending')

  friendPending.innerHTML = temp
}

function addFriend () {
  request.open('POST', 'post/addFriend', true)
  request.setRequestHeader('Content-type', 'application/json')
  const username = document.cookie
  const friend = document.getElementById('Friend').value
  request.send(JSON.stringify({ usernameInput: username, friendInput: friend }))
  request.addEventListener('load', recieveAddedFriends)
}

function recieveAddedFriends () {
  const response = JSON.parse(this.responseText)
  const msg = response.addedOrNot
  const addFriendResult = document.getElementById('output')
  addFriendResult.innerHTML = msg
}
