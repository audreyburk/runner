const Color = require('./color');

function Mass(x, y){
  this.x1 = x + (Math.random() * 40 + 20);
  this.y1 = y + Math.random() * 40;
  this.x2 = x - (Math.random() * 40 + 20);
  this.y2 = y + Math.random() * 40;
  this.x3 = x;
  this.y3 = y + Math.random() * 100 + 75;
}

Mass.prototype.render = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.lineTo(this.x3, this.y3);
  ctx.fill();
};

Mass.prototype.move = function (speed) {
  this.x1 -= speed;
  this.x2 -= speed;
  this.x3 -= speed;
};

Mass.generateMasses = function(width, height, spacing){
  const yCenter = height / 2;
  const masses = [];

  for (let x = -(spacing * 2); x <= width + spacing * 2; x += spacing) {
    let randomOffset = Math.random() * 300;
    const mass = new Mass(
      x + (Math.random() * 120 - 60),
      yCenter + randomOffset
    );
    masses.push(mass);
  }
  return masses;
};

module.exports = Mass;
