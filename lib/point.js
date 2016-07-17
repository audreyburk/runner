function Point(x, y, speed, pendulum){
  this.x = x;
  this.y = y;
  this.oldY = y;
  this.oldX = x;

  this.pendulum = pendulum || false;
  this.angle = Math.random() * 60;
  this.speed = speed;
  this.amplitude = Math.random() * 30;
}

Point.prototype.swing = function () {
  this.x = this.oldX + Math.sin(this.angle) * this.amplitude / 2;
};

Point.prototype.move = function (speed) {
  this.y = this.oldY + Math.sin(this.angle) * this.amplitude;
  if(this.pendulum) this.swing();
  this.x -= speed;
  this.oldX -= speed;
  this.angle += this.speed;
};

module.exports = Point;
