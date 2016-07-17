const Player = require('./player');
const Canvas = require('./canvas');
const Scape = require('./scape');
const Color = require('./color');

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
