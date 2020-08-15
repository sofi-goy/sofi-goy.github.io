var MAX_PARTICLES = 5000;
var delta = 0.0001;
let particles = [];
var newx_input, newy_input, delta_input, max_part_input;
var campoX, campoY;

function distribution(min, max){
  return random(min, max);
}

function randVector(){
  let x = distribution(-width/2, width/2);
  let y = distribution(-height/2, height/2);
  return new p5.Vector(x,y);
}


function campoVect(point){
  let scope = {
    x: point.x,
    y: point.y 
  };
  let new_x = campoX.evaluate(scope);
  let new_y = campoY.evaluate(scope);
  let vect = new p5.Vector(new_x, new_y);
  return vect;
}

function updateCampo(){
  campoX = math.compile(newx_input.value());
  campoY = math.compile(newy_input.value());
  delta  = float(delta_input.value());
  MAX_PARTICLES = float(max_part_input.value());
}

function checkBoundaries(point){
  var corrected;
  let magni = point.mag();
  let max_magni = new p5.Vector(width,height).mag();
  if (magni > max_magni){
    corrected = randVector();
  } else {
    corrected = point;
  }
  return corrected;
}

function update(point){
  let velocidad = campoVect(point);
  velocidad.mult(delta);
  point.add(velocidad);
  point = checkBoundaries(point);
  return point;
}

function setup(){
  let x,y;
  createCanvas(800,800);
  var script = createElement("script");
  script.attribute("src", "math.js");
  newx_input = createInput("y^2");
  newy_input = createInput("-x^2");
  delta_input = createInput(str(delta));
  max_part_input = createInput(str(MAX_PARTICLES));
  newx_input.changed(updateCampo);
  newy_input.changed(updateCampo);
  delta_input.changed(updateCampo);
  max_part_input.changed(updateCampo);
  updateCampo();

  for(let i=0; i<MAX_PARTICLES; i++){
    particles[i] = randVector();
  }
}
function draw(){
  var part;
  background(0);
  stroke(124,243,255);
  translate(width/2, height/2);
  for(let i=0; i<MAX_PARTICLES; i++){
    part = particles[i];
    part = update(part);
    particles[i] = part;
    point(part.x, part.y);
  }
}