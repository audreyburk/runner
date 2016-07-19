const Mass = require('./mass');
const Color = require('./color');

function Scape(canvas, level, speed) {
  this.dif = level * 60;
  this.canvas = canvas;
  this.spacing = 200;

  this.speed = speed; // -3 is good with slow music!
  this.masses = Mass.generateMasses(
    canvas.width,
    canvas.height,
    level,
    this.spacing
  );
}

Scape.prototype.spread = function () {
  return Math.random() * 600 - 600;
};

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

  if(masses[0].bottom.x < (0 - spacing * 2)){
    const mass = new Mass(
      masses[masses.length-1].bottom.x + spacing + (Math.random() * 120 - 60),
      this.canvas.height / 2 + this.spread()
    );
    masses.push(mass);
    masses.shift();
  }

  if(masses[masses.length-1].bottom.x > (this.canvas.width + spacing * 2)){
    const mass = new Mass(
      masses[0].bottom.x - spacing - (Math.random() * 120 - 60),
      this.canvas.height / 2 + this.spread()
    );
    masses.unshift(mass);
    masses.pop();
  }
};

module.exports = Scape;
