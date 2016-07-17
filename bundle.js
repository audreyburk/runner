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
	const Wave = __webpack_require__(5);
	const Color = __webpack_require__(4);
	
	// global singleton canvas, or too dangerous?
	
	function Game(){
	  this.canvas = new Canvas;
	  const wave = new Wave(this.canvas);
	  this.wave = wave;
	  this.player = new Player(wave);
	}
	
	Game.init = function(){
	  const game = new Game;
	  game.run();
	};
	
	Game.prototype.render = function(){
	  this.canvas.render();
	  this.wave.render();
	  this.player.render(this.canvas.ctx);
	};
	
	Game.prototype.move = function () {
	  this.wave.move();
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
	
	function Player(wave){
	  this.wave = wave;
	  this.x = 400;
	  this.y = 400;
	  this.speed = 1.5;
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
	  if(this.grounded){
	    this.accelerate(waveData);
	  } else {
	    this.fall(waveData);
	  }
	
	  this.x += this.speed;
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
	
	Player.prototype.accelerate = function (waveData) {
	  if(this.speed < 2) this.speed += .1;
	
	
	  if(waveData[1] > .4){
	    // actually, we want to check slope vs slope
	    // HWratio vs ratio of fallspeed to speed
	
	    this.grounded = false;
	  } else {
	    this.y = waveData[0];
	    if(this.speed > this.wave.speed) this.speed += .2 * waveData[1];
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Point = __webpack_require__(6);
	const Color = __webpack_require__(4);
	
	function Wave(canvas) {
	  this.canvas = canvas;
	  this.spacing = 100;
	  this.speed = -3;
	  this.points = Point.generatePoints(
	    canvas.width,
	    canvas.height,
	    this.spacing
	  );
	}
	
	Wave.prototype.move = function () {
	  this.points.forEach( (point, i) => {
	    point.move(this.speed);
	  });
	  this.keepPointsInBounds();
	};
	
	Wave.prototype.render = function() {
	  const ctx = this.canvas.ctx;
	  const width = this.canvas.width;
	  const height = this.canvas.height;
	
	  ctx.save();
	  ctx.fillStyle = Color.wave();
	  ctx.beginPath();
	  ctx.moveTo(this.points[0].x, this.points[0].y);
	
	  this.points.forEach( (point, i) => {
	    const nextPoint = this.points[i + 1];
	    if (nextPoint) {
	      ctx.lineTo(nextPoint.x, nextPoint.y);
	    }
	  });
	
	  ctx.lineTo(width, height);
	  ctx.lineTo(0, height);
	  ctx.fill();
	
	  ctx.restore();
	};
	
	Wave.prototype.keepPointsInBounds = function(){
	  const points = this.points;
	  const spacing = this.spacing;
	
	  if(points[0].x < (0 - spacing * 2)){
	    const newPoint = new Point(
	      points[points.length-1].x + spacing,
	      points[0].y,
	      points[0].oldY
	    );
	    points.push(newPoint);
	    points.shift();
	  }
	};
	
	module.exports = Wave;


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map