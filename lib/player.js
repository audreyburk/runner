const Color = require('./color');
const Listener = require('./listener');

function Player(wave){
  this.wave = wave;
  this.x = 400;
  this.y = 400;
  this.grounded = true;
  this.fallSpeed = 0;
  this.fallTime = 0;
}

Player.prototype.render = function (ctx) {
  ctx.fillStyle = Color.wave();
  ctx.beginPath();
  ctx.ellipse(this.x, this.y, 20, 20, 0, 0, Math.PI * 2, false);
  ctx.fill();
};

Player.prototype.move = function () {
  if(this.grounded && Listener.pressed(38)){
    this.grounded = false;
    this.fallSpeed = -8;
  }
  const waveData = this.waveData();
  if(!this.grounded){
    this.fall(waveData);
  }
};

Player.prototype.fall = function (waveData) {
  this.fallTime += .05;
  this.fallSpeed += this.fallTime;
  this.y += this.fallSpeed;

  if(this.y > waveData[0]){
    this.y = waveData[0];
    this.grounded = true;
    this.fallSpeed = 0;
    this.fallTime = 0;
  }
};

Player.prototype.waveData = function () {
  for(let i = 0; i < this.wave.points.length; i++){
    const point = this.wave.points[i];
    if(point.x > this.x){
      const prevPoint = this.wave.points[i-1];

      const total = Math.abs(point.x - prevPoint.x)
      const left = Math.abs(this.x - prevPoint.x);
      const right = Math.abs(this.x - point.x);
      const leftWeight = right / total; // opposite on purpose
      const rightWeight = left / total; // closer should mean bigger, not smaller

      // this.tilt = (Math.PI / 2) * heightWidthRatio * (leftWeight < rightWeight ? leftWeight : rightWeight);

      // negaative HWR means uphill
      const heightWidthRatio = (point.y - prevPoint.y) / (point.x - prevPoint.x);
      const y = (prevPoint.y * leftWeight + point.y * rightWeight);

      return [y, heightWidthRatio];
    }
  }
};

module.exports = Player;
