export class Sprite {
  constructor({ x, y, distance = 0, type, texture, frames = [] }) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.distance = distance;
    this._texture = texture;
    this.frames = frames;
    this.frame = 0;
    this.duration = 8;
  }

  get texture() {
    let texture = this._texture;
    if (this.frames.length) {
      texture = this.frames[Math.floor(this.frame)];
      this.frame += 1 / this.duration;
      this.frame %= this.frames.length;
    }
    return texture;
  }
}
