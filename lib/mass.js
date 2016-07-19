const Color = require('./color');
const Point = require('./point');

function Mass(x, y){
  const rand1 = Math.random() * 180;
  const rand2 = Math.random() * 180;

  const x1 = x + (Math.random() * 100 + 50);
  const y1 = y + rand1;
  const x2 = x - (Math.random() * 100 + 50);
  const y2 = y + rand2;
  const x3 = x;
  const y3 = y + (rand1 + rand2) / 2 + Math.random() * 75 + 75;
  const speed = 0.0175 + Math.random()*0.0275;

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

  for (let x = -(spacing * 2 + level * spacing / 2); x <= width + spacing * 2; x += spacing) {
    const spread = Math.random() * 300 - 400;
    const mass = new Mass(
      x + (Math.random() * 120 - 60),
      yCenter + spread
    );
    masses.push(mass);
  }
  return masses;
};

Mass.prototype.y = function (playerX) {
  const total = Math.abs(this.right.x - this.left.x)
  const left = Math.abs(playerX - this.left.x);
  const right = Math.abs(playerX - this.right.x);

  const leftWeight = right / total; // opposite on purpose
  const rightWeight = left / total; // closer should mean bigger, not smaller

  return (this.left.y * leftWeight + this.right.y * rightWeight);
};

Mass.prototype.slope = function () {
  return (this.left.y - this.right.y) / (this.left.x - this.right.x);
};

module.exports = Mass;
