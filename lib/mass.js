const Color = require('./color');
const Point = require('./point');

function Mass(x, y){
  const x1 = x + (Math.random() * 30 + 40);
  const y1 = y + Math.random() * 30;
  const x2 = x - (Math.random() * 30 + 40);
  const y2 = y + Math.random() * 30;
  const x3 = x;
  const y3 = y + Math.random() * 100 + 75;
  const speed = 0.0175 + Math.random()*0.0175;

  this.points = [];
  this.points.push(new Point(x1, y1, speed));
  this.points.push(new Point(x2, y2, speed));
  this.points.push(new Point(x3, y3, speed, true));
}

Mass.prototype.render = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);
  ctx.lineTo(this.points[1].x, this.points[1].y);
  ctx.lineTo(this.points[2].x, this.points[2].y);
  ctx.fill();
};

Mass.prototype.move = function (speed) {
  this.points.forEach( point => {
    point.move(speed);
  });
};

Mass.generateMasses = function(width, height, level, spacing){
  const yCenter = height / 2;
  const masses = [];

  for (let x = -(spacing * 2 + level * spacing / 3); x <= width + spacing * 2; x += spacing) {
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
