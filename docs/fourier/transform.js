var time = 0;
var vals_x = [];
var vals_y = [];
var path_x = [];
var path_y = [];
var dt;
var drawing = [[0, 0]];
var fourier_coef = [];

var size_slider;

function discrete_fourier(x, y) {
	const N = x.length;
	var X = [];
	for (var i = 0; i < N; i++) {
		var re = 0;
		var im = 0;
		for (var j = 0; j < N; j++) {
			var phi = (TWO_PI * i * j) / N;
			re += x[j] * cos(phi) + y[j] * sin(phi);
			im += y[j] * cos(phi) - x[j] * sin(phi);
		}
		re /= N;
		im /= N;

		freq = i;
		ampl = sqrt(re * re + im * im);
		phase = atan2(im, re);

		X[i] = { re, im, freq, ampl, phase };
	}

	return X;
}

async function readFile(filename) {
	let response = await fetch(filename);

	if (response.status != 200) {
		throw new Error("Server Error");
	}

	// read response stream as text
	text_data = await response.text();
	return text_data;
}

function loadDrawing(drawing) {
	console.log(drawing);
	// drawing = santos;
	for (var i = 0; i < drawing.length; i++) {
		vals_x[i] = drawing[i][0];
		vals_y[i] = drawing[i][1];
	}
	console.log(vals_x);
	fourier_coef = discrete_fourier(vals_x, vals_y);
	fourier_coef.sort((a, b) => b.ampl - a.ampl);
	dt = TWO_PI / fourier_coef.length;
}

function setup() {
	var myCanvas = createCanvas(800, 800);
	myCanvas.parent("#canvas");
	size_slider = select("#size");

	smooth();
	drawing = [[0, 0]];
	loadDrawing(drawing);

	filename = "pi.svg";
	text_data = readFile(filename).then(data => { loadDrawing(generatePointsFromSvg(data)) });

}

function arrow(x1, y1, x2, y2) {
	stroke(255, 120);
	strokeWeight(2);
	line(x1, y1, x2, y2);
}

function draw() {
	background(0);
	translate(width / 2, height / 2);

	var x = 0;
	var y = 0;

	for (var n = 1; n < fourier_coef.length; n++) {
		var prevx = x;
		var prevy = y;

		var freq = fourier_coef[n].freq;
		var ampl = fourier_coef[n].ampl;
		var phase = fourier_coef[n].phase;

		var radius = ampl * size_slider.value();
		var angle = freq * time + phase;

		if (ampl < 0.02)
			break;

		x += radius * cos(angle);
		y += radius * sin(angle);

		stroke(255, 100);
		noFill();
		strokeWeight(1);
		ellipse(prevx, prevy, radius * 2);

		arrow(prevx, prevy, x, y);
	}
	path_x.unshift(x);
	path_y.unshift(y);

	if (path_x.length > vals_x.length * 19 / 20) {
		path_x.pop();
		path_y.pop();
	}

	stroke(128, 240, 255);
	strokeWeight(2);
	beginShape();
	noFill();
	for (var i = 0; i < vals_x.length; i++) {
		vertex(path_x[i], path_y[i]);
	}
	endShape();

	time += dt;
}
