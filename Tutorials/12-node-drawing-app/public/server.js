var http = require('http');
var express = require('express');
var path = require('path');
var fs = require('fs');
var { Server } = require('socket.io');

var app = express();

var publicDir = __dirname;
var indexPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Cannot find index.html — expected at:', indexPath);
}

app.use(express.static(publicDir));

app.get('/', function (req, res) {
  res.sendFile(indexPath);
});

var server = http.createServer(app);
var io = new Server(server);

// Shared canvas state so a second browser sees what the first person already drew
var DRAW_CAP = 15000;
var drawHistory = [];

var PALETTE = [
  [255, 120, 120],
  [100, 200, 255],
  [120, 255, 140],
  [255, 220, 80],
  [200, 120, 255],
  [80, 255, 240],
  [255, 160, 200],
];
var nextPaletteIndex = 0;

io.on('connection', function (socket) {
  var color = PALETTE[nextPaletteIndex % PALETTE.length];
  nextPaletteIndex++;
  socket.data.color = color;

  socket.emit('you', { color: color });
  socket.emit('history', drawHistory);

  console.log('Client connected: ' + socket.id + ' color ' + color.join(','));

  socket.on('mouse', function (data) {
    var x = Number(data.x);
    var y = Number(data.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    var payload = { x: x, y: y, color: socket.data.color };
    drawHistory.push(payload);
    if (drawHistory.length > DRAW_CAP) drawHistory.shift();

    socket.broadcast.emit('mouse', payload);
  });

  socket.on('disconnect', function () {
    console.log('Client has disconnected');
  });
});

var envPort = process.env.PORT;
var startPort = envPort ? Number(envPort) : 3000;
var port = startPort;
var maxPort = envPort ? startPort : startPort + 50;

var announcedListen = false;

function onListening() {
  if (announcedListen) return;
  announcedListen = true;
  var addr = server.address();
  if (!addr) return;
  console.log('Serving files from:', publicDir);
  console.log('Open http://127.0.0.1:' + addr.port + '/');
  if (!envPort && addr.port !== startPort) {
    console.log('(Port ' + startPort + ' was in use — using ' + addr.port + '.)');
  }
}

server.on('error', function (err) {
  if (err.code !== 'EADDRINUSE') {
    console.error('Server error:', err.message);
    process.exit(1);
  }
  if (envPort) {
    console.error('Port ' + port + ' is already in use.');
    console.error('Stop the other process (e.g. lsof -i :' + port + ') or run: PORT=3333 npm start');
    process.exit(1);
  }
  var prev = port;
  port++;
  if (port > maxPort) {
    console.error('No free port found between ' + startPort + ' and ' + maxPort + '.');
    process.exit(1);
  }
  console.log('Port ' + prev + ' in use, trying ' + port + '…');
  announcedListen = false;
  server.close(function () {
    server.listen(port, onListening);
  });
});

server.listen(port, onListening);
