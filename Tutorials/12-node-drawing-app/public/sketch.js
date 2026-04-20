let brushSize = 4;

function setup() {
    createCanvas(800, 600).parent('sketch-holder');
    background(255);
}

function draw() {
    // Leave empty: do NOT call background() here every frame — it would erase the drawing.
}

function mouseDragged() {
    stroke(30);
    strokeWeight(brushSize);
    line(pmouseX, pmouseY, mouseX, mouseY);
}

function mousePressed() {
    // So a single click without dragging still leaves a dot
    stroke(30);
    strokeWeight(brushSize);
    point(mouseX, mouseY);
}

function keyPressed() {
    if (key === 'c' || key === 'C') {
        background(255);
    }
    if (key === '[') {
        brushSize = max(1, brushSize - 1);
    }
    if (key === ']') {
        brushSize = min(40, brushSize + 1);
    }
}
