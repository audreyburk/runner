const Color = require('./color');
const Point = require('./point');

function Mass(x, y){
  const x1 = x + (Math.random() * 50 + 50);
  const y1 = y + Math.random() * 50;
  const x2 = x - (Math.random() * 50 + 50);
  const y2 = y + Math.random() * 50;
  const x3 = x;
  const y3 = y + Math.random() * 100 + 100;
  const speed = 0.0175 + Math.random()*0.0175;

  this.right = new Point(x1, y1, speed);
  this.left = new Point(x2, y2, speed);
  this.bottom = new Point(x3, y3, speed, true);
}

Mass.prototype.render = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.right.x, this.right.y);
  ctx.lineTo(this.left.x, this.left.y);
  ctx.lineTo(this.bottom.x, this.bottom.y);
  ctx.fill();
};

Mass.prototype.move = function (speed) {
  this.right.move(speed);
  this.left.move(speed);
  this.bottom.move(speed);
};

Mass.generateMasses = function(width, height, level, spacing){
  const yCenter = height / 2;
  const masses = [];

  for (let x = -(spacing * 2 + level * spacing / 3); x <= width + spacing * 2; x += spacing) {
    let randomOffset = Math.random() * 150;
    const mass = new Mass(
      x + (Math.random() * 120 - 60),
      yCenter + randomOffset
    );
    masses.push(mass);
  }
  return masses;
};

module.exports = Mass;
