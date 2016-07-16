const Point = require('./point');
const Color = require('./color');
const Player = require('./player');

function Wave(canvas) {
  this.canvas = canvas;
  this.spacing = 100;
  this.points = Point.generatePoints(
    canvas.width,
    canvas.height,
    this.spacing
  );
}

Wave.prototype.render = function(tide) {
  const ctx = this.canvas.ctx;
  const width = this.canvas.width;
  const height = this.canvas.height;

  ctx.save();
  ctx.fillStyle = Color.wave();
  ctx.beginPath();
  ctx.moveTo(this.points[0].x, this.points[0].y);

  // split movement into separate function
  this.points.forEach( (point, i) => {
    point.move(tide);
    const nextPoint = this.points[i + 1];
    if (nextPoint) {
      ctx.lineTo(nextPoint.x, nextPoint.y);
    }
  });

  this.keepPointsInBounds();

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  ctx.restore();
};

Wave.prototype.keepPointsInBounds = function(){
  const points = this.points;
  const spacing = this.spacing;

  if(points[points.length-1].x > this.canvas.width + spacing * 2){
    const newPoint = new Point(
      points[0].x - spacing,
      points[points.length-1].y,
      points[points.length-1].oldY
    );
    points.unshift(newPoint);
    points.pop();

  } else if(points[0].x < (0 - spacing * 2)){
    const newPoint = new Point(
      points[points.length-1].x + spacing,
      points[0].y,
      points[0].oldY
    );
    points.push(newPoint);
    points.shift();
  }
};

Wave.prototype.addPlayer = function () {
  return null;
};

module.exports = Wave;
