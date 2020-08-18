let time = 0;
let wave = [];

let slidern;
let sliderrad;

function setup() {
	createCanvas(600, 400);
	slidern = createSlider(3, 50 ,1);
	sliderrad = createSlider(20,200,60);
}

function squared(n) {
	if (n%2==1){
		return (4 / (n*PI));
	} else {
		return 0;
	}
}

function trig(n){
	if (n==0){
		return 0;
	} else if (n%2==0){
		return (2 / (n*PI));
	} else {
		return ((-2) / (n*PI));
	}
}

function xsquared(n){
	if(n==0){
		return PI*PI/3;
	} else if (n%2==0){
		return (4 / (n*n));
	} else {
		return ((-4) / (n*n));
	}
}

function draw() {
	background(0);
	translate(150, 200);
	
	let x = 0;
	let y = 0;

	for (let n=0; n < slidern.value(); n++){
		let prevx = x;
		let prevy = y;
		let radius = sliderrad.value() * squared(n);

		if (radius > 0){
			stroke(255, 100);
			noFill();
			ellipse(prevx, prevy, radius*2);

			x += radius * cos(n * time);
			y += radius * sin(n * time);
		
			stroke(255);
			line(prevx, prevy, x, y);
		}
	}

	wave.unshift(y);
	translate(200, 0);
	stroke(200, 20, 20);
	line(x - 200, y, 0, wave[0]);
	
	if (wave.length>250){
		wave.pop();
	}
	
	beginShape();
	noFill();
	for (let i = 0; i < wave.length; i++){
		stroke(200, 200, 0);
		point(i, wave[i]);
	}
	endShape();

	time += 0.03;
}
