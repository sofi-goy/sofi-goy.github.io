const DEFINITION = 250;
const SPEED = 2;

var controlPoints = [];
var filledIn;
var selectedControlPoint = -1;

function lerpV(a, b, t) {
    var x = p5.Vector.mult(a, 1 - t);
    var y = p5.Vector.mult(b, t);
    return p5.Vector.add(x, y);
}

function bezierAt(t) {
    var a = lerpV(controlPoints[0], controlPoints[1], t);
    var b = lerpV(controlPoints[1], controlPoints[2], t);
    var c = lerpV(controlPoints[2], controlPoints[3], t);
    var d = lerpV(a, b, t);
    var e = lerpV(b, c, t);
    return lerpV(d, e, t);
}

function velAt(t) {
    var ans = p5.Vector.mult(controlPoints[0], -3 * t * t + 6 * t - 3);
    ans.add(p5.Vector.mult(controlPoints[1], 9 * t * t - 12 * t + 3));
    ans.add(p5.Vector.mult(controlPoints[2], -9 * t * t + 6 * t));
    ans.add(p5.Vector.mult(controlPoints[3], 3 * t * t));
    return ans;
}

function accelAt(t) {
    var ans = p5.Vector.mult(controlPoints[0], -6 * t + 6);
    ans.add(p5.Vector.mult(controlPoints[1], 18 * t - 12));
    ans.add(p5.Vector.mult(controlPoints[2], -18 * t + 6));
    ans.add(p5.Vector.mult(controlPoints[3], 6 * t));
    return ans;
}

function curvatureRadiusAt(t) {
    var vel = velAt(t);
    var accel = accelAt(t);
    return (vel.mag() ** 3) / (vel.x * accel.y - vel.y * accel.x);
}

function setup() {
    var myCanvas = createCanvas(800, 800);
    myCanvas.parent("#canvas");
    myCanvas.mouseMoved(updateControlPoints);
    myCanvas.mousePressed(mouseClicked);
    controlPoints = [createVector(100, 100), createVector(250, 300), createVector(650, 300), createVector(200, 100)];
    filledIn = 0;
}

function drawArrow(from, to) {
    stroke(255, 127, 0);
    strokeWeight(2);
    var temp = p5.Vector.add(from, to);
    line(from.x, from.y, temp.x, temp.y);
    temp = p5.Vector.sub(from, to);
    line(from.x, from.y, temp.x, temp.y);
}

function findNearestControl () {
    var nearestIndex = 0;
    var nearest = dist(controlPoints[0].x, controlPoints[0].y, mouseX, mouseY);
    for (var i = 1; i < controlPoints.length; i++){
        var currDist = dist(controlPoints[i].x, controlPoints[i].y, mouseX, mouseY);
        if (currDist < nearest){
            nearest = currDist;
            nearestIndex = i;
        }
    }
    return nearestIndex;
}

function mouseClicked(pressed) {
    if (!pressed)
        return;

    if (selectedControlPoint != -1) {
        selectedControlPoint = -1;
        return;
    }

    for (var i = 0; i < controlPoints.length; i++) {
        if (isSelectable(i)) {
            selectedControlPoint = i;
            return;
        }
    }
}

function updateControlPoints() {
    if (selectedControlPoint != -1)
        controlPoints[selectedControlPoint] = createVector(mouseX, mouseY);
}

function isSelectable(index) {
    if (selectedControlPoint != -1)
        return false;

    var nearestIndex = findNearestControl();
    var nearest = controlPoints[nearestIndex];
    return (index == nearestIndex && dist(nearest.x, nearest.y, mouseX, mouseY) < 40);
}

function draw() {
    background(0);

    // Draw control points
    strokeWeight(1);
    fill(0, 100, 100);
    stroke(0, 127, 127);
    beginShape(LINES);
    for (var i = 0; i < controlPoints.length; i++) {
        vertex(controlPoints[i].x, controlPoints[i].y);
        if (isSelectable(i)) {
        // if (false) {
            fill(255, 255, 0);
            circle(controlPoints[i].x, controlPoints[i].y, 15);
            fill(0, 100, 100);
        } else {
            circle(controlPoints[i].x, controlPoints[i].y, 10);
        }
    }
    endShape();

    // Draw full curve
    stroke(0, 200, 200);
    noFill();
    beginShape();
    for (var j = 0; j <= DEFINITION; j++) {
        var p = bezierAt(j / DEFINITION);
        vertex(p.x, p.y);
    }
    endShape();

    // Draw filled-curve
    stroke(0, 255, 255);
    strokeWeight(3);
    beginShape();
    var p;
    for (var j = 0; j <= filledIn; j += SPEED) {
        p = bezierAt(j / DEFINITION);
        vertex(p.x, p.y);
    }
    endShape();

    // Draw particle
    fill(255);
    circle(p.x, p.y, 10);

    // Draw velocity vector
    var tip = velAt(filledIn / DEFINITION);
    drawArrow(p, p5.Vector.div(tip, 5));

    // Draw oscullating circle
    noFill();
    stroke(127, 0, 127);
    tip.normalize();
    var normal = createVector(-tip.y, tip.x);
    var radius = curvatureRadiusAt(filledIn / DEFINITION);
    normal.mult(radius).add(p);
    circle(normal.x, normal.y, abs(radius) * 2);

    filledIn = (filledIn + 1) % (DEFINITION + 1);
}