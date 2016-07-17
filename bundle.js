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
	  const scape = new Scape(this.canvas);
	  this.scape = scape;
	  // this.player = new Player(scape);
	}
	
	Game.init = function(){
	  const game = new Game;
	  game.run();
	};
	
	Game.prototype.render = function(){
	  this.canvas.render();
	  this.scape.render();
	  // this.player.render(this.canvas.ctx);
	};
	
	Game.prototype.move = function () {
	  this.scape.move();
	  // this.player.move();
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
	    this.l = 30;
	}
	
	Color.prototype.step = function(){
	  this.h >= 360 ? this.h = 0 : this.h += .5;
	
	  if(this.lIncreasing){
	    if(this.l >= 15){
	      this.lIncreasing = false;
	      this.l -= .05;
	    } else this.l += .05;
	  } else {
	    if(this.l <= 0){
	      this.lIncreasing = true;
	      this.l += .05;
	    } else this.l -= .05;
	  }
	
	  // lightness could depend on how well we're doing
	};
	
	Color.prototype.main = function () {
	  const hsla = `hsla(${this.h}, ${this.s}%, ${this.l}%, 1)`;
	  return hsla;
	};
	
	Color.prototype.wave = function () {
	  const hsla = `hsla(${this.h}, ${this.s}%, ${this.l + this.l + 10}%, 1)`;
	  return hsla;
	};
	
	Color.prototype.hull = function () {
	  const hsla = `hsla(${this.h}, 15%, 2%, 1)`;
	  return hsla;
	};
	
	Color.prototype.sail = function (dif) {
	  // stands out too much on light bg as is
	  // alter lightness/opacity based on base lightness??
	  // return "white";
	  const hsla = `hsla(${this.h + 135 + dif}, 50%, 80%, 1)`;
	  return hsla;
	};
	
	module.exports = new Color;


/***/ },
/* 5 */,
/* 6 */,
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
	
	function Scape(canvas) {
	  this.canvas = canvas;
	  this.spacing = 100;
	  this.speed = 3;
	  this.masses = Mass.generateMasses(
	    canvas.width,
	    canvas.height,
	    this.spacing
	  );
	}
	
	Scape.prototype.move = function () {
	  this.masses.forEach( (mass, i) => {
	    mass.move(this.speed);
	  });
	  this.keepMassesInBounds();
	};
	
	Scape.prototype.render = function() {
	  const ctx = this.canvas.ctx;
	  ctx.save();
	  ctx.fillStyle = Color.wave();
	
	  this.masses.forEach( mass => {
	    mass.render(ctx);
	  });
	
	  ctx.restore();
	};
	
	Scape.prototype.keepMassesInBounds = function(){
	  const masses = this.masses;
	  const spacing = this.spacing;
	
	  if(masses[0].x < (0 - spacing * 2)){
	    const newMass = new Mass(
	      masses[masses.length-1].x + spacing,
	      masses[0].y,
	      masses[0].oldY
	    );
	    masses.push(newMass);
	    masses.shift();
	  }
	};
	
	module.exports = Scape;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Color = __webpack_require__(4);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map