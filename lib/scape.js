const Mass = require('./mass');
const Color = require('./color');

function Scape(canvas) {
  this.canvas = canvas;
  this.spacing = 100;
  this.speed = 3;
  this.masses = Mass.generateMasses(
    canvas.width,
    canvas.height,
    this.spacing
  );
}

Scape.prototype.move = function () {
  this.masses.forEach( (mass, i) => {
    mass.move(this.speed);
  });
  this.keepMassesInBounds();
};

Scape.prototype.render = function() {
  const ctx = this.canvas.ctx;
  ctx.save();
  ctx.fillStyle = Color.wave();

  this.masses.forEach( mass => {
    mass.render(ctx);
  });

  ctx.restore();
};

Scape.prototype.keepMassesInBounds = function(){
  const masses = this.masses;
  const spacing = this.spacing;

  if(masses[0].x < (0 - spacing * 2)){
    const newMass = new Mass(
      masses[masses.length-1].x + spacing,
      masses[0].y,
      masses[0].oldY
    );
    masses.push(newMass);
    masses.shift();
  }
};

module.exports = Scape;
