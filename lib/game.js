const Player = require('./player');
const Canvas = require('./canvas');
const Wave = require('./wave');
const Color = require('./color');

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
