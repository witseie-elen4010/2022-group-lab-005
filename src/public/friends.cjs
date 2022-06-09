'use strict'
// redirect if user is not logged in
$(function () {
  checkUser(document.cookie).then(
    (result) => {
      if (result === false) {
        window.location.href = '/login'
      }
    }
  ).catch()
})

window.onload = function () {
  const username = getFromCookie('username', document.cookie)
  // first two get will together return Friends of the user
  $.get('/user/get/friends', { usernameInput: username }).done(
    function (friendResponse) {
      recieveFriends(friendResponse)
      $.get('/user/get/friendUser', { usernameInput: username }).done(
        function (friendResponse) {
          recieveFriendUser(friendResponse)
          // next two get will return the friend request send and recieved
          $.get('/user/get/pending', { usernameInput: username }).done(
            function (pendingResponse) {
              recievePendingFriends(pendingResponse)
              $.get('/user/get/friendRequest', { usernameInput: username }).done(
                function (acceptResponse) {
                  receiveFriendRequests(acceptResponse)
                }
              ).fail(
                function (serverResponse) {
                  alert(serverResponse)
                })
            }
          ).fail(
            function (serverResponse) {
              alert(serverResponse)
            })
        }
      ).fail(
        function (serverResponse) {
          alert(serverResponse)
        })
    }
  ).fail(
    function (serverResponse) {
      alert(serverResponse)
    })
  // accept or decline friend request on click
  document.getElementById('addButton').addEventListener('click', function (evt) {
    evt.preventDefault()
    const friend = document.getElementById('Friend').value
    $.get('/user/get/addFriend', { usernameInput: username, friendInput: friend }).done(
      function (addFriendResponse) {
        recieveAddedFriends(addFriendResponse)
      }
    ).fail(
      function (serverResponse) {
        alert(serverResponse)
      })
  })
}

// display friends where user first sent request
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

// display friends where friend first sent request
function recieveFriendUser (response) {
  let temp = ''
  for (let i = 0; i < response.recordset.length; i++) {
    temp += response.recordset[i].Inviter + '<br>'
  }
  const friendList = document.getElementById('Friend list')
  if (temp !== '') {
    friendList.innerHTML += temp
  }
}

// display all sent pending frient request
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
// display all incoming friend request and generate button to accept and decline them
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
      ).fail(
        function (serverResponse) {
          alert(serverResponse)
        })
    }
    declineBtn.innerHTML = 'Decline'
    declineBtn.onclick = function () {
      $.get('/user/get/updateFriend', { usernameInput: getFromCookie('username', document.cookie), friendInput: acceptBtn.getAttribute('user'), acceptInput: 'decline' }).done(
        function (addFriendResponse) {
          receiveAcceptDeclineFriend(addFriendResponse)
        }
      ).fail(
        function (serverResponse) {
          alert(serverResponse)
        })
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
// response to show if friend requested
function recieveAddedFriends (response) {
  const msg = response.Status
  alert(msg)
  document.location.reload()
}
// response to show if declined friend or accepted friend
function receiveAcceptDeclineFriend (response) {
  const msg = response.updateFriendRequest
  alert(msg)
  document.location.reload()
}
