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

'use strict'
import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

export default socket;