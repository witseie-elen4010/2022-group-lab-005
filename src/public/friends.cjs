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
  const username = getFromCookie('username', document.cookie)
  $.get('/user/get/friends', { usernameInput: username }).done(
    function (friendResponse) {
      recieveFriends(friendResponse)
      $.get('/user/get/pending', { usernameInput: username }).done(
        function (pendingResponse) {
          recievePendingFriends(pendingResponse)
          $.get('/user/get/friendRequest', { usernameInput: username }).done(
            function (acceptResponse) {
              receiveFriendRequests(acceptResponse)
            }
          )
        }
      )
    }
  )

  document.getElementById('addButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    const friend = document.getElementById('Friend').value
    $.get('/user/get/addFriend', { usernameInput: username, friendInput: friend }).done(
      function (addFriendResponse) {
        recieveAddedFriends(addFriendResponse)
      }
    )
  })
}

// Recieves query from the database
function recieveFriends (response) {
  let temp = ''
  for (let i = 0; i < response.recordset.length; i++) {
    temp += response.recordset[i].Invitee + '<br>'
  }
  const friendList = document.getElementById('Friend list')
  if (temp !== '') {
    friendList.innerHTML = temp
  }
}

function recievePendingFriends (response) {
  let temp = ''
  for (let i = 0; i < response.recordset.length; i++) {
    temp += response.recordset[i].Invitee + '<br>'
  }
  const friendPending = document.getElementById('pending')
  if (temp !== '') {
    friendPending.innerHTML = temp
  }
}

function receiveFriendRequests (response) {
  if (response.recordset.length > 0) {
    document.getElementById('friend name').innerHTML = ''
  }
  for (let i = 0; i < response.recordset.length; i++) {
    const inviter = response.recordset[i].Inviter

    // create the lables and buttons
    const label = document.createElement('label')
    label.innerHTML = inviter
    label.style.height = '40px'
    const acceptBtn = document.createElement('button')
    acceptBtn.className = ('btn btn-primary ')
    acceptBtn.style.height = '40px'
    const declineBtn = document.createElement('button')
    declineBtn.className = ('btn btn-primary ')
    declineBtn.style.height = '40px'

    // button functions
    acceptBtn.innerHTML = 'Accept'
    acceptBtn.setAttribute('user', inviter)
    acceptBtn.onclick = function () {
      $.get('/user/get/updateFriend', { usernameInput: getFromCookie('username', document.cookie), friendInput: acceptBtn.getAttribute('user'), acceptInput: 'accept' }).done(
        function (addFriendResponse) {
          receiveAcceptDeclineFriend(addFriendResponse)
        }
      )
      // acceptDeclineFriend(getFromCookie('username', document.cookie), acceptBtn.getAttribute('user'), 'accept')
    }
    declineBtn.innerHTML = 'Decline'
    declineBtn.onclick = function () {
      $.get('/user/get/updateFriend', { usernameInput: getFromCookie('username', document.cookie), friendInput: acceptBtn.getAttribute('user'), acceptInput: 'decline' }).done(
        function (addFriendResponse) {
          receiveAcceptDeclineFriend(addFriendResponse)
        }
      )
      // acceptDeclineFriend(getFromCookie('username', document.cookie), acceptBtn.getAttribute('user'), 'decline')
    }
    // append the buttons while adding space to make it look neat
    document.getElementById('friend name').appendChild(label)
    document.getElementById('requestButtons').appendChild(acceptBtn)
    document.getElementById('requestButtons').appendChild(document.createTextNode(' '))
    document.getElementById('requestButtons').appendChild(declineBtn)
    document.getElementById('friend name').appendChild(document.createElement('br'))
    document.getElementById('friend name').appendChild(document.createElement('br'))
    document.getElementById('requestButtons').appendChild(document.createElement('br'))
    document.getElementById('requestButtons').appendChild(document.createElement('br'))
  }
}

function recieveAddedFriends (response) {
  const msg = response.Status // there is only 1 possible response so record set at 0 is used
  alert(msg)
  document.location.reload()
}

function receiveAcceptDeclineFriend (response) {
  const msg = response.updateFriendRequest
  alert(msg)
  document.location.reload()
}
