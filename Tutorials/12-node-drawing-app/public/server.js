// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
// Matches Coding Train: https://github.com/CodingTrain/sockets-and-p5

var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
var server = app.listen(port, listen);
server.on('error', function (err) {
  console.error('Server error:', err.message);
});

function listen() {
  var addr = server.address();
  if (!addr) return;
  console.log('Example app listening at http://' + addr.address + ':' + addr.port);
}

app.use(express.static('public'));

var { Server } = require('socket.io');
var io = new Server(server);

io.on('connection', function (socket) {
  console.log('We have a new client: ' + socket.id);

  socket.on('mouse', function (data) {
    console.log("Received: 'mouse' " + data.x + ' ' + data.y);
    socket.broadcast.emit('mouse', data);
  });

  socket.on('disconnect', function () {
    console.log('Client has disconnected');
  });
});
