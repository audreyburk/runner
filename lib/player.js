const Color = require('./color');
const Listener = require('./listener');

function Player(scapes){
  this.scapes = scapes;

  this.radius = 20;
  this.angle = 0;
  this.maxSpeed = 6;
  this.speed = 0;
  this.state = 0;
  this.x = 300;
  this.y = 200;
  this.grounded = true;
  this.fallSpeed = 0;
  this.fallTime = 0;
}

Player.prototype.render = function (ctx) {
  const speedRatio = Math.abs(this.speed) / this.maxSpeed;
  const grow = (1 + speedRatio * .15);
  const shrink = (1 - speedRatio * .15);

  ctx.fillStyle = Color.player();
  ctx.beginPath();
  ctx.ellipse(
    this.x,
    this.y - this.radius * shrink,
    this.radius * grow,
    this.radius * shrink,
    0, 0 + this.angle,
    Math.PI + this.angle);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.ellipse(
    this.x,
    this.y - this.radius * shrink,
    this.radius * grow,
    this.radius * shrink,
    0, Math.PI + this.angle,
    Math.PI * 2 + this.angle);
  ctx.fill();
};

Player.prototype.checkInput = function () {
  const drag = this.scape().speed;
  const max = this.maxSpeed;
  const delta = (this.grounded ? .8 : .4);
  // allow higher/lower max when on slant!

  if(Listener.pressed(37)) {
    this.speed -= delta;
    if(this.speed < drag - max) this.speed = drag - max;
  } else if(Listener.pressed(39)){
    this.speed += delta;
    if(this.speed > max) this.speed = max;
    debugger
  } else {
    if(true){}
  }

  // may want a jump toggle on key release
  if(this.grounded && Listener.pressed(38)){
    this.grounded = false;
    this.fallSpeed = -8;
  }
};

Player.prototype.scape = function () {
  return this.scapes[this.state];
};

Player.prototype.turn = function () {
  this.angle += 0.05 * (this.speed - this.scape().speed);
};

Player.prototype.move = function () {
  this.checkInput();
  this.turn();
  const drag = this.scape().speed;

  // let player be carried by masses
  // maybe should not multiply by drag, just keep low?
  if(this.grounded){
    if(this.speed > drag){
      this.speed -= .1;
      if(this.speed < drag) this.speed = drag;
    } else if (this.speed < drag){
      this.speed += .1;
      if(this.speed > drag) this.speed = drag;
    }
  }
  const massY = this.massY();
  if(!this.grounded){
    this.fall(massY);
  } else {
    // need to track current mass?
    // see if we fell off of it?
    if(massY === 99999){
      this.grounded = false;
    } else {
      this.y = massY;
    }
  }

  this.x += this.speed;

  // const scape()Data = this.waveData();
  // if(!this.grounded){
  //   this.fall(waveData);
  // }
};

Player.prototype.fall = function (massY) {
  this.fallTime += .03;
  this.fallSpeed += this.fallTime;
  this.y += this.fallSpeed;

  console.log(massY);
  const dif = massY - this.y
  if(dif < 0 && Math.abs(dif) < this.fallSpeed * 2){
    this.y = massY;
    this.grounded = true;
    this.fallSpeed = 0;
    this.fallTime = 0;
  }
};

Player.prototype.massY = function () {
  let y = 99999;
  this.scape().masses.forEach( mass => {
    if(mass.left.x < this.x && mass.right.x > this.x){
      const total = Math.abs(mass.right.x - mass.left.x)
      const left = Math.abs(this.x - mass.left.x);
      const right = Math.abs(this.x - mass.right.x);
      const leftWeight = right / total; // opposite on purpose
      const rightWeight = left / total; // closer should mean bigger, not smaller

      // this.tilt = (Math.PI / 2) * heightWidthRatio * (leftWeight < rightWeight ? leftWeight : rightWeight);

      // negative HWR means uphill
      // const heightWidthRatio = (point.y - prevPoint.y) / (point.x - prevPoint.x);

      // needs to return all in case of overlap!
      y = (mass.left.y * leftWeight + mass.right.y * rightWeight);
    }
  });
  return y;
};

module.exports = Player;
