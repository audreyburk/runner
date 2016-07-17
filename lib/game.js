const Player = require('./player');
const Canvas = require('./canvas');
const Scape = require('./scape');
const Color = require('./color');

// global singleton canvas, or too dangerous?

function Game(){
  this.canvas = new Canvas;
  this.scapes = [];
  for(let i = 0; i < 3; i++){
    const scape = new Scape(this.canvas, i*20);
    this.scapes.push(scape);
  }
  // this.player = new Player(scape);
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
  // this.player.render(this.canvas.ctx);
};

Game.prototype.move = function () {
  this.scapes.forEach( scape => {
    scape.move();
  });
  // this.player.move();
};

Game.prototype.run = function(){
  Color.step();
  this.move();
  this.render();
  window.requestAnimationFrame(() => this.run());
};

module.exports = Game;
