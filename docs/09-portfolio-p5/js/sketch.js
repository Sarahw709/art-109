let canvas;

function setup (){
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(10, -150);
    canvas.style("z-index", -2);
    // background(300);
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

// function setup() {
//   createCanvas(400, 400);
// }

function draw() {
//   background(220);
  for (let i=0; i<6; i++){
  strokeWeight(0);
  fill(250*(i/5));
  ellipse(width/2, height/2, 300-(i*50), 300-(i*50));
  }
}