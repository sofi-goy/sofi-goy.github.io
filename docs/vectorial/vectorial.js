const MAX_PARTICLES = 7000;
var delta = 0.0001;
var particles = [];
var newx_input, newy_input, delta_input; //Controles de la animacion
var campoX, campoY;  //Las formulas compiladas por math.js
var max_magnitude;

//Para especificar distintas distribuciones aleatorias
function distribution(min, max) {
	return random(min, max);
}

//Devuelve vector aleatorio, usando distribution 1D
function randVector() {
	var x = distribution(-width / 2, width / 2);
	var y = distribution(-height / 2, height / 2);
	return new p5.Vector(x, y);
}

//Evalua el campo vectorial en un punto
function campoVect(point) {
	var scope = {
		x: point.x,
		y: point.y
	};
	var new_x = campoX.evaluate(scope);
	var new_y = campoY.evaluate(scope);
	var vect = new p5.Vector(new_x, new_y);
	return vect;
}

//Actualiza las formulas del campo
function updateCampo() {
	campoX = math.compile(newx_input.value());
	campoY = math.compile(newy_input.value());
	delta = float(delta_input.value());
}

//Controla que las particulas no se alejen mucho de la zona visible
function checkBoundaries(point) {
	if (point.mag() > max_magnitude)
		return randVector();

	return point;
}

//Aplicar movimiento a una particula
function update(point) {
	var velocidad = campoVect(point);
	velocidad.mult(delta);
	point.add(velocidad);
	point = checkBoundaries(point);
	return point;
}

function setParticles() {
	for (var i = 0; i < MAX_PARTICLES; i++) {
		particles[i] = randVector();
	}
}

//Prepara la funcionalidad de la interfaz
function setUI() {
	var myCanvas = createCanvas(800, 800);
	myCanvas.parent("canvas");

	newx_input = select("#campoX");
	newy_input = select("#campoY");
	delta_input = select("#delta");
	var rand_btn = document.getElementById("rand");

	newx_input.changed(updateCampo);
	newy_input.changed(updateCampo);
	delta_input.changed(updateCampo);
	rand_btn.onclick = setParticles;
}

function setup() {
	setUI();
	updateCampo();
	setParticles();

	max_magnitude = new p5.Vector(width, height).mag();
}

function draw() {
	background(0);
	stroke(128, 240, 255);

	translate(width / 2, height / 2);  //trasladar el origen al centro
	scale(1, -1) //Corrige el eje y apara coincidir con el cartesiano

	for (var i = 0; i < MAX_PARTICLES; i++) {
		particles[i] = update(particles[i]);
		point(particles[i].x, particles[i].y);
	}
}