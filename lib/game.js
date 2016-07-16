const Canvas = require('./canvas');
const Wave = require('./wave');
const Color = require('./color');

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
