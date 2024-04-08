const MAX_PARTICLES = 7000;
var epsilon = 0.0001;
var particles = [];
var newx_input, newy_input, epsilon_input; //Controles de la animacion
var campoX, campoY;  //Las formulas compiladas por math.js
var max_magnitude;

//Para especificar distintas distribuciones aleatorias
function distribution(min, max) {
	return random(min, max);
}

// Standard Normal variate using Box-Muller transform.
// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

//Devuelve vector aleatorio, usando distribution 1D
function randParticula() {
	var x = distribution(-width * 5 / 8, width * 5 / 8);
	var y = distribution(-height * 5 / 8, height * 5 / 8);
	var lifetime = randn_bm() + 3;
	return {
		pos: new p5.Vector(x,y),
		lifetime: lifetime
	};
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
	epsilon = float(epsilon_input.value());
}

//Controla que las particulas no se alejen mucho de la zona visible
//y que tampoco vivan infinitamente
function checkBoundaries(particula) {
	if (particula.pos.mag() > max_magnitude || particula.lifetime <= 0)
		return randParticula();

	return particula;
}

//Aplicar movimiento a una particula
function update(particula) {
	var velocidad = campoVect(particula.pos);
	velocidad.mult(epsilon);
	particula.pos.add(velocidad);
	particula.lifetime -= epsilon * 8;
	particula = checkBoundaries(particula)

	return particula;
}

function setParticles() {
	for (var i = 0; i < MAX_PARTICLES; i++) {
		particles[i] = randParticula();
	}
}

//Prepara la funcionalidad de la interfaz
function setUI() {
	var myCanvas = createCanvas(800, 800);
	myCanvas.parent("canvas");

	newx_input = select("#campoX");
	newy_input = select("#campoY");
	epsilon_input = select("#epsilon");
	var rand_btn = document.getElementById("rand");

	newx_input.changed(updateCampo);
	newy_input.changed(updateCampo);
	epsilon_input.changed(updateCampo);
	rand_btn.onclick = setParticles;
}

function setup() {
	setUI();
	updateCampo();
	setParticles();

	max_magnitude = new p5.Vector(width, height).mag() * 9 /8;
}

function draw() {
	background(0);
	stroke(128, 240, 255);

	translate(width / 2, height / 2);  //trasladar el origen al centro
	scale(1, -1) //Corrige el eje y apara coincidir con el cartesiano

	for (var i = 0; i < MAX_PARTICLES; i++) {
		particles[i] = update(particles[i]);
		point(particles[i].pos.x, particles[i].pos.y);
	}
}
