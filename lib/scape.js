const Mass = require('./mass');
const Color = require('./color');

function Scape(canvas, dif) {
  this.dif = dif;
  this.canvas = canvas;
  this.spacing = 200;
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
  ctx.fillStyle = Color.mass(this.dif);

  this.masses.forEach( mass => {
    mass.render(ctx);
  });

  ctx.restore();
};

Scape.prototype.keepMassesInBounds = function(){
  const masses = this.masses;
  const spacing = this.spacing;

  if(masses[0].x3 < (0 - spacing * 2)){
    const newMass = new Mass(
      masses[masses.length-1].x3 + spacing,
      masses[0].y1 - Math.random() * 20
    );
    masses.push(newMass);
    masses.shift();
  }
};

module.exports = Scape;
