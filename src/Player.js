import { Bitmap } from './Bitmap.js';
import { CIRCLE } from './constants.js';

export class Player {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.weapon = new Bitmap('./src/assets/knife_hand.png', 319, 320);
    this.paces = 0;
  }

  get perpendicular() {
    return this.direction + Math.PI / 2;
  }

  rotate(angle) {
    this.direction = (this.direction + (angle * Math.PI) / 180 + CIRCLE) % CIRCLE;
  }

  walk(distance, map) {
    const dx = Math.cos(this.direction) * distance;
    const dy = Math.sin(this.direction) * distance;
    if (map.getPoint(this.x + dx, this.y) <= 0) this.x += dx;
    if (map.getPoint(this.x, this.y + dy) <= 0) this.y += dy;
    this.paces += distance;
  }

  strafe(distance, map) {
    const dx = Math.cos(this.perpendicular) * distance;
    const dy = Math.sin(this.perpendicular) * distance;
    if (map.getPoint(this.x + dx, this.y) <= 0) this.x += dx;
    if (map.getPoint(this.x, this.y + dy) <= 0) this.y += dy;
    this.paces += distance;
  }

  update(controls, map, seconds) {
    if (controls.left) this.strafe(-3 * seconds, map);
    if (controls.right) this.strafe(3 * seconds, map);
    if (controls.forward) this.walk(3 * seconds, map);
    if (controls.backward) this.walk(-3 * seconds, map);
    if (controls.rotate) this.rotate(controls.rotate);
  }
}
