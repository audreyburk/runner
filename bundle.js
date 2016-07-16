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

	const Canvas = __webpack_require__(2);
	const Wave = __webpack_require__(4);
	const Color = __webpack_require__(3);
	
	// global singleton canvas, or too dangerous?
	
	function Game(){
	  this.canvas = new Canvas;
	  const wave = new Wave(this.canvas);
	  wave.addPlayer();
	  this.wave = wave;
	}
	
	Game.init = function(){
	  const game = new Game;
	  game.run();
	};
	
	Game.prototype.render = function(){
	  this.canvas.render();
	  this.wave.render();
	};
	
	Game.prototype.run = function(){
	  Color.step();
	  this.render();
	  window.requestAnimationFrame(() => this.run());
	};
	
	module.exports = Game;


/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports) {

	function Color(){
	    this.lIncreasing = true;
	
	    this.h = Math.random() * 360;
	    this.s = 100;
	    this.l = 30;
	}
	
	Color.prototype.step = function(){
	  this.h >= 360 ? this.h = 0 : this.h += 2;
	
	  if(this.lIncreasing){
	    if(this.l >= 75){
	      this.lIncreasing = false;
	      this.l -= .2;
	    } else this.l += .2;
	  } else {
	    if(this.l <= 5){
	      this.lIncreasing = true;
	      this.l += .2;
	    } else this.l -= .2;
	  }
	
	  // lightness could depend on how well we're doing
	};
	
	Color.prototype.main = function () {
	  const hsla = `hsla(${this.h}, ${this.s}%, ${this.l}%, 1)`;
	  return hsla;
	};
	
	Color.prototype.wave = function () {
	  const hsla = `hsla(${this.h + 180}, ${this.s}%, ${this.l}%, 1)`;
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Point = __webpack_require__(5);
	const Color = __webpack_require__(3);
	const Player = __webpack_require__(6);
	
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


/***/ },
/* 5 */
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
	
	Point.prototype.move = function (tide) {
	  this.y = this.oldY + Math.sin(this.angle) * this.amplitude;
	  this.x -= 5;
	  this.angle += this.speed;
	};
	
	module.exports = Point;


/***/ },
/* 6 */
/***/ function(module, exports) {

	function Player(){
	  
	}
	
	module.exports = Player;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map