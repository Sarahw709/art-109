function setup() {
    // Put the canvas inside <main> so CSS that targets main / main canvas applies
    createCanvas(200, 200).parent('sketch-holder');
}

function draw() {
    background(51);
    ellipse(mouseX, mouseY, 60, 60);
}