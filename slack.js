const express = require('express');
const socketio = require('socket.io');

const namespaces = require('./data/namespaces');
const Room = require('./classes/Room');

const app = express();
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);

const io = socketio(expressServer, {
  // default
  // path: '/socket.io',
  // serveClient: true,
  // transports: ['polling', 'websocket'],
  // allowUpgrades: true,
}); //

app.get('/change-ns', (req, res) => {
  namespaces[0].addRoom(new Room(0, 'Deleted Articles', 0));
  io.of(namespaces[0].endpoint).emit('ns-change', namespaces[0]);
  res.json(namespaces[0]);
});

io.of('/').on('connection', (socket, _request) => {
  socket.emit('welcome', 'Welcome to the server.');
  socket.on('clientConnect', () => console.log(socket.id, ' has connected'));
  socket.emit('nsList', namespaces);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (socket) => {
    socket.on('join-room', async ({ roomTitle, nsID }, ackCallback) => {
      const thisNS = namespaces[nsID];
      const thisRoomObj = thisNS.rooms.find(
        (room) => room.roomTitle === roomTitle
      );
      const thisRoomHistory = thisRoomObj.history;

      const rooms = socket.rooms;
      let i = 0;
      rooms.forEach((room) => {
        if (i !== 0) socket.leave(room);
        i++;
      });

      socket.join(roomTitle);
      const sockets = await io
        .of(namespace.endpoint)
        .in(roomTitle)
        .fetchSockets();
      const socketCount = sockets.length;
      ackCallback({
        numUsers: socketCount,
        roomHistory: thisRoomHistory,
      });
    });
    socket.on('new-message-to-room', (messageObj) => {
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1];
      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit('message-to-room', messageObj);
      const thisNS = namespaces[messageObj.activeNSID];
      const thisRoom = thisNS.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      console.log(thisRoom);
      thisRoom.addMessage(messageObj);
    });
  });
});
