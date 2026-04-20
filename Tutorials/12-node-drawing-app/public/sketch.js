// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman
// Video: https://www.youtube.com/watch?v=i6eP1Lw4gZk

var socket;

function setup() {
  createCanvas(400, 400).parent('sketch-holder');
  background(0);
  // Same as the video's io.connect('http://localhost:3000') when you open this site from that server.
  // Using io() follows whatever host/port you used in the browser (e.g. PORT=3456).
  socket = io();
  socket.on('mouse', function (data) {
    console.log('Got: ' + data.x + ' ' + data.y);
    fill(0, 0, 255);
    noStroke();
    ellipse(data.x, data.y, 20, 20);
  });
}

function draw() {}

function mouseDragged() {
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 20, 20);
  sendmouse(mouseX, mouseY);
}

function sendmouse(xpos, ypos) {
  console.log('sendmouse: ' + xpos + ' ' + ypos);
  var data = {
    x: xpos,
    y: ypos,
  };
  socket.emit('mouse', data);
}
