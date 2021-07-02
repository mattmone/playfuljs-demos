export class Sprite {
  constructor({ x, y, distance = 0, type, texture }) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.distance = distance;
    this.texture = texture;
  }
}
