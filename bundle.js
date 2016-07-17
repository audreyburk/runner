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
	const Canvas = __webpack_require__(3);
	const Scape = __webpack_require__(8);
	const Color = __webpack_require__(4);
	
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
	
	Game.prototype.run = function(){
	  Color.step();
	  this.move();
	  this.render();
	  window.requestAnimationFrame(() => this.run());
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Color = __webpack_require__(4);
	const Listener = __webpack_require__(7);
	
	function Player(scapes){
	  this.scapes = scapes;
	  this.x = 400;
	  this.y = 200;
	  this.grounded = true;
	  this.fallSpeed = 0;
	  this.fallTime = 0;
	}
	
	Player.prototype.render = function (ctx) {
	  ctx.fillStyle = Color.main();
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
	
	      // negative HWR means uphill
	      const heightWidthRatio = (point.y - prevPoint.y) / (point.x - prevPoint.x);
	      const y = (prevPoint.y * leftWeight + point.y * rightWeight);
	
	      return [y, heightWidthRatio];
	    }
	  }
	};
	
	module.exports = Player;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Color = __webpack_require__(4);
	
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
/* 4 */
/***/ function(module, exports) {

	function Color(){
	    this.lIncreasing = true;
	
	    this.h = Math.random() * 360;
	    this.s = 100;
	    this.l = 20;
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
	  const hsla = `hsla(${this.h}, ${this.s}%, ${this.l}%, 1)`;
	  return hsla;
	};
	
	Color.prototype.mass = function (dif) {
	  const hsla = `hsla(${this.h + 135 + dif}, ${this.s}%, ${40}%, 1)`;
	  return hsla;
	};
	
	module.exports = new Color;


/***/ },
/* 5 */,
/* 6 */
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
	  this.x -= speed;
	  this.oldX -= speed;
	  this.angle += this.speed;
	};
	
	module.exports = Point;


/***/ },
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Mass = __webpack_require__(9);
	const Color = __webpack_require__(4);
	
	function Scape(canvas, level) {
	  this.dif = level * 60;
	  this.canvas = canvas;
	  this.spacing = 300;
	  this.speed = 3 + .5 * level;
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
	
	  if(masses[0].points[2].x < (0 - spacing * 2)){
	    let randomOffset = Math.random() * 300;
	    const mass = new Mass(
	      masses[masses.length-1].points[2].x + spacing + (Math.random() * 120 - 60),
	      this.canvas.height / 2 + randomOffset
	    );
	    masses.push(mass);
	    masses.shift();
	  }
	};
	
	module.exports = Scape;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Color = __webpack_require__(4);
	const Point = __webpack_require__(6);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map