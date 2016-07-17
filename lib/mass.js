const Color = require('./color');

function Mass(x, y){
  this.x = x;
  this.y = y;
}

Mass.prototype.render = function (ctx) {
  ctx.fillStyle = Color.wave();
  ctx.beginPath();
  ctx.ellipse(this.x, this.y, 20, 20, 0, 0, Math.PI * 2, false);
  ctx.fill();
};

Mass.prototype.move = function (speed) {
  this.x -= speed;
};

Mass.generateMasses = function(width, height, spacing){
  const yCenter = height / 2;
  const masses = [];

  for (let x = -(spacing * 2); x <= width + spacing * 2; x += spacing) {
    let randomOffset = Math.random() * 175;
    const mass = new Mass(
      x + (Math.random()*50 - 25),
      yCenter + randomOffset
    );
    masses.push(mass);
  }
  return masses;
};

module.exports = Mass;
