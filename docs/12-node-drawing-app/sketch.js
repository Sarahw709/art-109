// Shared canvas: many clients can draw; each gets a color from the server.

var socket;
var myColor = [220, 220, 220];
var BRUSH = 20;

function setup() {
  createCanvas(400, 400).parent('sketch-holder');
  background(0);

  socket = io();

  socket.on('you', function (profile) {
    myColor = profile.color;
  });

  socket.on('history', function (points) {
    noStroke();
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      fill(p.color[0], p.color[1], p.color[2]);
      ellipse(p.x, p.y, BRUSH, BRUSH);
    }
  });

  socket.on('mouse', function (data) {
    fill(data.color[0], data.color[1], data.color[2]);
    noStroke();
    ellipse(data.x, data.y, BRUSH, BRUSH);
  });
}

function draw() {}

function drawStroke(x, y) {
  fill(myColor[0], myColor[1], myColor[2]);
  noStroke();
  ellipse(x, y, BRUSH, BRUSH);
  sendmouse(x, y);
}

function mouseDragged() {
  drawStroke(mouseX, mouseY);
}

function touchMoved() {
  drawStroke(touchX, touchY);
  return false;
}

function sendmouse(xpos, ypos) {
  if (!socket || !socket.connected) return;
  socket.emit('mouse', { x: xpos, y: ypos });
}
