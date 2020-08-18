let time = 0;
let vals_x = [];
let vals_y = [];
let path_x = [];
let path_y = [];

let slider;

function setup() {
	createCanvas(800, 800);
	slider = createSlider(1,10,1);
	
	for(let i=0; i<drawing.length; i++){
		vals_x[i] = drawing[i].x;
		vals_y[i] = drawing[i].y;
	}
	fourierY = dft(vals_x, vals_y);
	fourierY.sort((a,b) => b.ampl - a.ampl);
}

function draw() {
	background(0);
	translate(width/2, height/2);
	
	let x = 0;
	let y = 0;

	for (let n=1; n < fourierY.length; n++){
		let prevx = x;
		let prevy = y;

		let freq = fourierY[n].freq;
		let ampl = fourierY[n].ampl;
		let phase = fourierY[n].phase;
		let radius = ampl * slider.value();
		let angle = freq*time+phase;

		if (radius > 0){
			stroke(255, 100);
			noFill();
			ellipse(prevx, prevy, radius*2);

			x += radius*cos(angle);
			y += radius*sin(angle);
		
			stroke(255, 120);
			line(prevx, prevy, x, y);
		}
	}
	path_x.unshift(x);
	path_y.unshift(y);

	if (path_x.length>1000){
		path_x.pop();
		path_y.pop();
	}

	stroke(0,255,0);
	beginShape();
	noFill();
	for (let i = 0; i < vals_x.length; i++){
		vertex(path_x[i], path_y[i]);
	}
	endShape();

	let dt = TWO_PI / fourierY.length;
	time += dt;
}
