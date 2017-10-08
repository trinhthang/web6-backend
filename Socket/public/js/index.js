socket = io();
socket.on('connect', () => {
  socket.emit('welcomeMessage', 'user connect to the app');

  socket.on('serverWelcome', (message) => {
    console.log(message);
  })

  socket.on('chatAll', (messageObject) => {
    console.log(messageObject);
  })

  socket.on('broadcastMessage', (broadcastMessage) => {
    console.log('broadcast mess: ' + broadcastMessage);
  })
})

var buttonId = document.getElementById('submit_button');
var inputId = document.getElementById('room_name');

buttonId.onclick = () => {
  socket.emit('joinRoom', inputId.value);
}
