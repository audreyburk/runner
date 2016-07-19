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
