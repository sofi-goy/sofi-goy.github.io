var myCanvas;
var trigs =[];
var size = 30;
var w = 800;
var h = 600;
var rows = h/size;
var cols = w/size;
var t = 0;
var wireframe_on, wire_input;
var light;  

function setup(){
	myCanvas = createCanvas(800,800,WEBGL);
	myCanvas.parent("#canvas");
	wire_input = select("#wireframe");
	wire_input.changed(update_anim_conf);

	noSmooth();

	for(let i=0; i<rows; i++){
		trigs.push([]);
		for(let j=0; j<cols;j++){
			pos = createVector(j*size-w/2, i*size, 0);
			trigs[i].push(pos);
		}
	}

	light = createVector(0,0.5,0.866);
}

function draw_trig(a,b,c){
	var p = p5.Vector.sub(a,b);
	var q = p5.Vector.sub(a,c);
	var normal = p5.Vector.cross(p,q).normalize();
	var bright = abs(p5.Vector.dot(light, normal));
	fill(bright*160,bright*161,bright*197);
	
	beginShape(TRIANGLES);
	vertex(a.x, a.y, a.z);
	vertex(b.x, b.y, b.z);
	vertex(c.x, c.y, c.z);
	endShape();
}

function update_anim_conf(){
	wireframe_on = wire_input.checked();
}

function draw(){
	clear();
	rotateX(PI/3);
	t -= 0.05;

 	for(let i=0; i<rows; i++){
		for(let j=0; j<cols;j++){
			trigs[i][j].z = 300*noise(i*2/size+t,j*2/size);
		}
	}

	if (wireframe_on)
		stroke(0);
	else
		noStroke();

	fill(120);

	for(let i=0; i<rows-1; i++){
		for(let j=0; j<cols-1;j++){
			pos  = trigs[i][j];
			pos2 = trigs[i+1][j];
			pos3 = trigs[i][j+1];
			pos4 = trigs[i+1][j+1];
			draw_trig(pos, pos2, pos3);
			draw_trig(pos2, pos4, pos3);
		}
	}
}