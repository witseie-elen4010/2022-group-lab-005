/* //NO TOUCHY!!
'use strict'

window.onload = function () {
  io_.on('connection', socket => {
    socket.join('some room')
  })

  document.getElementById('joingame').addEventListener('click', function (evt) {
    io_.emit('hi')
  })
}
*/