import { Bitmap } from './Bitmap.js';
import { EFFECTS, MOBILE } from './constants.js';
export class Player extends EventTarget {
  constructor({ x, y, direction }) {
    super();
    this.x = x;
    this.y = y;
    this.directionX = -1;
    this.directionY = 0;
    this.planeX = 0;
    this.planeY = 0.66;
    this.direction = Math.PI / 2;
    this.weapon = new Bitmap('assets/knife_hand.webp', 319, 320);
    this.paces = 0;
    this.usePress = this.usePress.bind(this);
    this.notifier = document.querySelector('#notifier');
    this.effects = [];
    this.addEffect({ effect: EFFECTS.TELEPORT, duration: 1500 });
    document.addEventListener('keydown', this.usePress);
  }

  get USE() {
    return this._use ?? 'e';
  }

  set USE(use) {
    this._use = use;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    if (Math.floor(value) !== this._priorX) {
      this.dispatchEvent(
        new CustomEvent('player-position-change', { detail: Math.floor(this._x) }),
      );
      this._priorX = Math.floor(value);
    }
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    if (Math.floor(value) !== this._priorY) {
      this.dispatchEvent(
        new CustomEvent('player-position-change', { detail: Math.floor(this._y) }),
      );
      this._priorY = Math.floor(value);
    }
  }

  get perpendicular() {
    return this.direction + Math.PI / 2;
  }

  notify(nearBy) {
    this.notifier.toggleAttribute('open', true);
    const notifyClick = () => this.usePress({ key: this.USE });
    if (nearBy === 'exit') {
      this.notifier.innerText = MOBILE
        ? 'Click to use the portal.'
        : "Press 'e' to use the portal.";
      this.notifier.addEventListener('click', notifyClick, {
        once: true,
        passive: true,
      });
      return;
    }
    this.notifier.removeAttribute('open');
    this.notifier.removeEventListener('click', notifyClick);
  }

  setNewMap({ x, y, direction }) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  rotate(rotationSpeed, direction) {
    const oldDirectionX = this.directionX;
    const oldPlaneX = this.planeX;

    // const radians = (angle * Math.PI) / 180;

    this.directionX =
      this.directionX * Math.cos(direction * rotationSpeed) -
      this.directionY * Math.sin(direction * rotationSpeed);
    this.directionY =
      oldDirectionX * Math.sin(direction * rotationSpeed) +
      this.directionY * Math.cos(direction * rotationSpeed);

    this.planeX =
      this.planeX * Math.cos(direction * rotationSpeed) -
      this.planeY * Math.sin(direction * rotationSpeed);
    this.planeY =
      oldPlaneX * Math.sin(direction * rotationSpeed) +
      this.planeY * Math.cos(direction * rotationSpeed);

    // this.direction = (this.direction + radians) % CIRCLE;
  }

  walk(distance, map) {
    const dx = this.directionX * distance;
    const dy = this.directionY * distance;
    if (map.getPoint(this.x + dx, this.y) <= 0) this.x += dx;
    if (map.getPoint(this.x, this.y + dy) <= 0) this.y += dy;
    this.paces += distance;
  }

  strafe(distance, map) {
    const dx = this.directionY * distance;
    const dy = -this.directionX * distance;
    if (map.getPoint(this.x + dx, this.y) <= 0) this.x += dx;
    if (map.getPoint(this.x, this.y + dy) <= 0) this.y += dy;
    this.paces += distance;
  }

  update(controls, map, seconds) {
    if (controls.left) this.strafe(controls.left * seconds, map);
    if (controls.right) this.strafe(controls.right * seconds, map);
    if (controls.forward) this.walk(-controls.forward * seconds, map);
    if (controls.backward) this.walk(-controls.backward * seconds, map);
    if (controls.rotate)
      this.rotate(Math.abs(controls.rotate) * seconds, controls.rotate > 0 ? -1 : 1);
  }

  usePress(event) {
    if (event.key === this.USE) {
      this.dispatchEvent(new CustomEvent('player-use'));
    }
  }

  addEffect({ effect, duration = 1000 }) {
    if (!effect || !duration) return;
    this.effects.push(effect);
    setTimeout(() => {
      this.effects.splice(this.effects.indexOf(effect), 1);
    }, duration);
  }
}
