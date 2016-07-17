const Mass = require('./mass');
const Color = require('./color');

function Scape(canvas, level) {
  this.dif = level * 60;
  this.canvas = canvas;
  this.spacing = 300;
  this.speed = 3 + .5 * level;
  this.masses = Mass.generateMasses(
    canvas.width,
    canvas.height,
    level,
    this.spacing
  );
}

Scape.prototype.move = function () {
  this.masses.forEach( mass => {
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

  if(masses[0].points[2].x < (0 - spacing * 2)){
    let randomOffset = Math.random() * 300;
    const mass = new Mass(
      masses[masses.length-1].points[2].x + spacing + (Math.random() * 120 - 60),
      this.canvas.height / 2 + randomOffset
    );
    masses.push(mass);
    masses.shift();
  }
};

module.exports = Scape;
