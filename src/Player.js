import { Bitmap } from './Bitmap.js';
import { CIRCLE } from './constants.js';
import { Map } from './Map.js';
export class Player extends EventTarget {
  constructor({ x, y, direction }) {
    super();
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.weapon = new Bitmap('assets/knife_hand.png', 319, 320);
    this.paces = 0;
    this.usePress = this.usePress.bind(this);
    document.addEventListener('keydown', this.usePress);
  }

  get USE() {
    return this._use ?? 'e';
  }

  set USE(use) {
    this._use = use;
  }

  get perpendicular() {
    return this.direction + Math.PI / 2;
  }

  setNewMap({ x, y, direction }) {
    this.x = x;
    this.y = y;
    this.direction = direction;
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

  usePress(event) {
    if (event.key === this.USE) {
      this.dispatchEvent(new CustomEvent('player-use'));
    }
  }
}
