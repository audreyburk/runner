function Color(){
    this.lIncreasing = true;

    this.h = Math.random() * 360;
    this.s = 100;
    this.l = 30;
}

Color.prototype.step = function(){
  this.h >= 360 ? this.h = 0 : this.h += .5;

  if(this.lIncreasing){
    if(this.l >= 50){
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
  const hsla = `hsla(${this.h}, ${this.s}%, ${this.l + 50}%, 1)`;
  return hsla;
};

Color.prototype.wave = function () {
  const hsla = `hsla(${this.h}, ${this.s}%, ${this.l}%, 1)`;
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
