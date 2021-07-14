import { Bitmap } from './Bitmap.js';
import { EFFECTS, MOBILE } from './constants.js';
import { Items } from './Items/Items.js';
import { equipmentSort } from './utils.js';
export class Player extends EventTarget {
  /** @property {Number} #level */
  #level = 1;
  constructor(map) {
    super();
    this.map = map;
    const { x, y } = this.map.startingPosition;
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
    this.levelIndicator = document.querySelector('#level-indicator');
    this.effects = [];
    this.addEffect({ effect: EFFECTS.TELEPORT, duration: 1500 });
    document.addEventListener('keydown', this.usePress);
  }

  get level() {
    return this.#level;
  }

  set level(value) {
    this.#level = value;
    this.levelIndicator.textContent = value;
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
        new CustomEvent('player-position-change', {
          detail: { x: Math.floor(this._x), y: Math.floor(this._y) },
        }),
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
        new CustomEvent('player-position-change', {
          detail: { x: Math.floor(this._x), y: Math.floor(this._y) },
        }),
      );
      this._priorY = Math.floor(value);
    }
  }

  get perpendicular() {
    return this.direction + Math.PI / 2;
  }

  notify(nearBy = {}) {
    this.notifier.toggleAttribute('open', true);
    const notifyClick = () => this.usePress({ key: this.USE });
    if (nearBy.type === 'exit') {
      this.notifier.innerText = MOBILE
        ? 'Click to use the portal.'
        : "Press 'e' to use the portal.";
      this.notifier.addEventListener('click', notifyClick, {
        once: true,
        passive: true,
      });
      return;
    }
    if (nearBy.type === 'treasure') {
      this.notifier.innerText = MOBILE ? 'Click to open.' : "Press 'e' to open.";
      this.notifier.addEventListener('click', notifyClick, {
        once: true,
        passive: true,
      });
      return;
    }
    this.notifier.removeAttribute('open');
    this.notifier.removeEventListener('click', notifyClick);
  }

  setNewMap(map) {
    this.map = map;
    const { x, y } = map.startingPosition;
    this.x = x;
    this.y = y;
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

  walk(distance) {
    const dx = this.directionX * distance;
    const dy = this.directionY * distance;
    if (this.map.getPoint(this.x + dx, this.y) <= 0) this.x += dx;
    if (this.map.getPoint(this.x, this.y + dy) <= 0) this.y += dy;
    this.paces += distance;
  }

  strafe(distance) {
    const dx = this.directionY * distance;
    const dy = -this.directionX * distance;
    if (this.map.getPoint(this.x + dx, this.y) <= 0) this.x += dx;
    if (this.map.getPoint(this.x, this.y + dy) <= 0) this.y += dy;
    this.paces += distance;
  }

  update(controls, seconds) {
    if (controls.left) this.strafe(controls.left * seconds, this.map);
    if (controls.right) this.strafe(controls.right * seconds, this.map);
    if (controls.forward) this.walk(-controls.forward * seconds, this.map);
    if (controls.backward) this.walk(-controls.backward * seconds, this.map);
    if (controls.rotate)
      this.rotate(Math.abs(controls.rotate) * seconds, controls.rotate > 0 ? -1 : 1);
  }

  async toggleInventory() {
    await import('./components/inventory-screen.js');
    const inventoryScreen = document.querySelector('inventory-screen');
    if (inventoryScreen.isOpen) return inventoryScreen.close();
    inventoryScreen.items = this.inventory;
    inventoryScreen.selection = this.inventory[0] || {};
    inventoryScreen.open();
  }

  equipItem(item) {
    if (item.equipped) return this.#unequip(item);
    this.#equip[item.category](item);
  }

  unequipItem(item) {
    this.#unequip(item);
  }

  equipment = new Items();
  inventory = new Items();

  #equip = {
    weapon: item => {
      if (
        ['two-handed', 'ranged'].includes(item.type) ||
        ['two-handed', 'ranged'].includes(this.equipment.weapons[0]?.type)
      )
        this.equipment.weapons.forEach(weapon => this.#unequip(weapon));
      if (item.type === 'one-handed' && this.equipment.weapons.length > 1)
        this.#unequip(this.equipment.weapons[this.equipment.weapons.length - 1]);
      this.#equip.item(item);
    },
    armor: item => {
      this.#equip[item.type](item);
    },
    helm: item => {
      this.#unequip(this.equipment.helms[0]);
      this.#equip.item(item);
    },
    body: item => {
      this.#unequip(this.equipment.body[0]);
      this.#equip.item(item);
    },
    gloves: item => {
      this.#unequip(this.equipment.gloves[0]);
      this.#equip.item(item);
    },
    boots: item => {
      this.#unequip(this.equipment.boots[0]);
      this.#equip.item(item);
    },
    ring: item => {
      if (this.equipment.rings.length >= 2) this.#unequip(this.equipment.rings[0]);
      this.#equip.item(item);
    },
    item: item => {
      this.equipment.push(item);
      item.equipped = true;
      this.#equipmentChangeEvent(item.category);
    },
  };

  #unequip(item) {
    if (!item || !this.equipment.includes(item)) return;
    this.equipment.splice(this.equipment.indexOf(item), 1);
    item.equipped = false;
    this.#equipmentChangeEvent();
  }

  #equipmentChangeEvent(category) {
    this.inventory.sort(equipmentSort);
    this.dispatchEvent(new CustomEvent('equipment-change', { detail: category }));
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
