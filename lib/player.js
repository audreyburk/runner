const Color = require('./color');
const Listener = require('./listener');

function Player(scapes){
  this.scapes = scapes;
  this.state = 0;

  this.maxSpeed = 5;
  this.speed = 0;

  this.radius = 20;
  this.angle = 0;
  this.x = 300;
  this.y = 200;

  this.grounded = true;
  this.fallSpeed = 0;
  this.fallTime = 0;
  this.canJump = true;
  this.jumping = false;
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
  } else {
    if(true){}
  }

  // may want a jump toggle on key release
  if(Listener.pressed(38)){
    if(this.canJump){
      this.jump();
    }
  } else {
    this.jumping = false;
    if(this.grounded) this.canJump = true;
  }
};

Player.prototype.scape = function () {
  return this.scapes[this.state];
};

Player.prototype.jump = function () {
  this.grounded = false;
  this.fallSpeed = -8 - .5 * (this.scape().speed - this.speed) * this.massSlope(); // + this.speed * mass.slope
  this.jumping = true;
  this.canJump = false;
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
      this.speed -= .15;
      if(this.speed < drag) this.speed = drag;
    } else if (this.speed < drag){
      this.speed += .15;
      if(this.speed > drag) this.speed = drag;
    }
    this.speed += this.massSlope();
  }
  const massY = this.massY();
  console.log(this.massSlope());
  if(!this.grounded){
    this.canJump = false;
    this.fall(massY);
  } else {
    // need to track current mass?
    // see if we fell off of it?
    if(massY === 0){
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
  const delta = (this.jumping ? .02 : .05)
  this.fallTime += delta;
  this.fallSpeed += this.fallTime;
  this.y += this.fallSpeed;

  const dif = massY - this.y
  if(dif < 0 && Math.abs(dif) < this.fallSpeed * 2){
    this.y = massY;
    this.grounded = true;
    this.fallSpeed = 0;
    this.fallTime = 0;
  }
};

Player.prototype.mass = function () {
  let closestMass = null;
  this.scape().masses.forEach( mass => {
    if(mass.left.x < this.x && mass.right.x > this.x){
      const y = mass.y(this.x);

      // TODO: turn the "5" into a sensible number
      //       prevents slipping through when mass shifts y
      if(y + 10 >= this.y && (!closestMass || y < closestMass.y(this.x))){
        closestMass = mass;
      }
    }
  });
  return closestMass;
};

Player.prototype.massY = function () {
  const mass = this.mass();
  return (mass ? mass.y(this.x) : 0);
};

Player.prototype.massSlope = function () {
  const mass = this.mass();
  return (mass ? mass.slope() : 0);
};


module.exports = Player;
