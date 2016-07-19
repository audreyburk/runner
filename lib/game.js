const Player = require('./player');
const Canvas = require('./canvas');
const Scape = require('./scape');
const Color = require('./color');

// global singleton canvas, or too dangerous?

function Game(){
  this.canvas = new Canvas;
  const scape1 = new Scape(this.canvas, -1, -3);
  const scape2 = new Scape(this.canvas, 1, -3);
  this.scapes = [scape1, scape2];
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
  Color.step();
  this.move();
  this.render();
  window.requestAnimationFrame(td => this.run(td));
};

module.exports = Game;
