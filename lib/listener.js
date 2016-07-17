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
