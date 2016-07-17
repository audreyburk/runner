function Point(x, y, oldY){
  this.x = x;
  this.y = y;
  this.oldY = oldY;

  this.angle = Math.random() * 360;
  this.speed = 0.0175 + Math.random()*0.0175;
  this.amplitude = Math.random() * 15 + 15;
}

Point.generatePoints = function(width, height, spacing){
  const yCenter = height / 2;
  const points = [];

  for (let x = -(spacing * 2); x <= width + spacing * 2; x += spacing) {
    let randomOffset = Math.random() * 175;
    const point = new Point(
      x + (Math.random()*50 - 25),
      yCenter + randomOffset,
      yCenter + randomOffset
    );
    points.push(point);
  }
  return points;
};

Point.prototype.move = function (speed) {
  this.y = this.oldY + Math.sin(this.angle) * this.amplitude;
  this.x += speed;
  this.angle += this.speed;
};

module.exports = Point;
