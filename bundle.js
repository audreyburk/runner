/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
	document.addEventListener("DOMContentLoaded", Game.init);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Player = __webpack_require__(2);
	const Canvas = __webpack_require__(5);
	const Scape = __webpack_require__(6);
	const Color = __webpack_require__(3);
	
	// global singleton canvas, or too dangerous?
	
	function Game(){
	  this.canvas = new Canvas;
	  this.scapes = [];
	  for(let i = 0; i < 1; i++){
	    const scape = new Scape(this.canvas, i);
	    this.scapes.push(scape);
	  }
	  this.player = new Player(this.scapes);
	}
	
	Game.init = function(){
	  const game = new Game;
	  game.run();
	};
	
	Game.prototype.render = function(){
	  this.canvas.render();
	  this.scapes.forEach( scape => {
	    scape.render();
	  });
	  this.player.render(this.canvas.ctx);
	};
	
	Game.prototype.move = function () {
	  this.scapes.forEach( scape => {
	    scape.move();
	  });
	  this.player.move();
	};
	
	Game.prototype.run = function(td){
	  console.log(td);
	  Color.step();
	  this.move();
	  this.render();
	  window.requestAnimationFrame(td => this.run(td));
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Color = __webpack_require__(3);
	const Listener = __webpack_require__(4);
	
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
	  console.log(this.speed);
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
	  this.fallSpeed = -8;
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
	
	  }
	  const massY = this.massY();
	  if(!this.grounded){
	    this.canJump = false;
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
	  const delta = (this.jumping ? .01 : .05)
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Color(){
	  this.lIncreasing = true;
	
	  this.h = Math.random() * 360;
	  this.s = 100;
	  this.l = 40;
	}
	
	Color.prototype.step = function(){
	  this.h >= 360 ? this.h = 0 : this.h += .5;
	
	  // if(this.lIncreasing){
	  //   if(this.l >= 10){
	  //     this.lIncreasing = false;
	  //     this.l -= .05;
	  //   } else this.l += .05;
	  // } else {
	  //   if(this.l <= 0){
	  //     this.lIncreasing = true;
	  //     this.l += .05;
	  //   } else this.l -= .05;
	  // }
	
	  // lightness could depend on how well we're doing
	};
	
	Color.prototype.main = function () {
	  const hsla = `hsla(${this.h}, ${this.s}%, ${0}%, 1)`;
	  return hsla;
	};
	
	Color.prototype.mass = function (dif) {
	  const hsla = `hsla(${this.h + 135 + dif}, ${this.s}%, ${this.l}%, 1)`;
	  return hsla;
	};
	
	Color.prototype.player = function () {
	  const hsla = `hsla(${this.h}, ${this.s}%, ${this.l}%, 1)`;
	  return hsla;
	};
	
	module.exports = new Color;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const _viableKeys = [37, 38, 39, 40];
	
	function Listener(){
	  this.keys = {};
	
	  document.addEventListener("keydown", e => this._keyDown(e));
	  document.addEventListener("keyup", e => this._keyUp(e));
	}
	
	Listener.prototype._keyDown = function (e) {
	  const code = e.keyCode;
	  if(_viableKeys.includes(code)){
	    e.preventDefault();
	    this.keys[e.keyCode] = true;
	  }
	};
	
	Listener.prototype._keyUp = function (e) {
	  const code = e.keyCode;
	  if(_viableKeys.includes(code)){
	    e.preventDefault();
	    delete this.keys[code];
	  }
	};
	
	Listener.prototype.pressed = function (key) {
	  return this.keys[key];
	};
	
	module.exports = new Listener;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Color = __webpack_require__(3);
	
	function Canvas(){
	  this.self = document.getElementById("canvas")
	
	  this.self.width = window.innerWidth;
	  this.self.height = window.innerHeight;
	
	  this.width = this.self.width;
	  this.height = this.self.height;
	  this.ctx = this.self.getContext("2d");
	
	
	  this.ctx.globalAlpha = 0.7;
	}
	
	Canvas.prototype.render = function () {
	  this.self.style.background = Color.main();
	  this.ctx.clearRect(0, 0, this.width, this.height);
	};
	
	
	module.exports = Canvas;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Mass = __webpack_require__(7);
	const Color = __webpack_require__(3);
	
	function Scape(canvas, level) {
	  this.dif = level * 60;
	  this.canvas = canvas;
	  this.spacing = 500; // 250 ish?
	  this.speed = -5 - .5 * level; // -3 is good with slow music!
	  this.masses = Mass.generateMasses(
	    canvas.width,
	    canvas.height,
	    level,
	    this.spacing
	  );
	}
	
	Scape.prototype.move = function () {
	  this.masses.forEach( mass => {
	    mass.move(this.speed);
	  });
	  this.keepMassesInBounds();
	};
	
	Scape.prototype.render = function() {
	  const ctx = this.canvas.ctx;
	  ctx.save();
	  ctx.fillStyle = Color.mass(this.dif);
	
	  this.masses.forEach( mass => {
	    mass.render(ctx);
	  });
	
	  ctx.restore();
	};
	
	Scape.prototype.keepMassesInBounds = function(){
	  const masses = this.masses;
	  const spacing = this.spacing;
	
	  if(masses[0].bottom.x < (0 - spacing * 2)){
	    let randomOffset = Math.random() * 150;
	    const mass = new Mass(
	      masses[masses.length-1].bottom.x + spacing + (Math.random() * 120 - 60),
	      this.canvas.height / 2 + randomOffset
	    );
	    masses.push(mass);
	    masses.shift();
	  }
	};
	
	module.exports = Scape;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Color = __webpack_require__(3);
	const Point = __webpack_require__(8);
	
	function Mass(x, y){
	  const x1 = x + (Math.random() * 50 + 150);
	  const y1 = y + Math.random() * 50;
	  const x2 = x - (Math.random() * 50 + 150);
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


/***/ },
/* 8 */
/***/ function(module, exports) {

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
	  this.x += speed;
	  this.oldX += speed;
	  this.angle += this.speed;
	};
	
	module.exports = Point;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map