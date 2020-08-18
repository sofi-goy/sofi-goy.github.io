var myCanvas;
var trigs =[];
var size = 20;
var w = 1000;
var h = 800;
var rows = h/size;
var cols = w/size;
var t = 0;
var wireframe_on;

function setup(){
	myCanvas = createCanvas(800,800,WEBGL);
	myCanvas.parent("#canvas");

	for(let i=0; i<rows; i++){
		trigs.push([]);
		for(let j=0; j<cols;j++){
			pos = createVector(j*size-w/2, i*size-h/2, 0);
			trigs[i].push(pos);
		}
	}
}

function drawTrig(a,b,c){
	var p = p5.Vector.sub(a,b);
	var q = p5.Vector.sub(a,c);
	var light  = createVector(0,0.5,0.866);
	var normal = p5.Vector.cross(p,q).normalize();
	var bright = abs(p5.Vector.dot(light, normal))*255 - 70;
	fill(10+normal.y*255,bright/2,bright);
	// stroke(0);
	noStroke();
	beginShape(TRIANGLES);
	vertex(a.x, a.y, a.z);
	vertex(b.x, b.y, b.z);
	vertex(c.x, c.y, c.z);
	endShape();
}

function draw(){
	background(0);
	stroke(255);
	rotateX(PI/3);
	translate(0,200);
	t -= 0.05;
 	for(let i=0; i<rows; i++){
		for(let j=0; j<cols;j++){
			trigs[i][j].z = 300*noise(i/20+t,j/20);
		}
	}
	for(let i=0; i<rows-1; i++){
		for(let j=0; j<cols-1;j++){
			pos  = trigs[i][j];
			pos2 = trigs[i+1][j];
			pos3 = trigs[i][j+1];
			pos4 = trigs[i+1][j+1];
			drawTrig(pos, pos2, pos3);
			drawTrig(pos2, pos4, pos3);
		}
	}
}