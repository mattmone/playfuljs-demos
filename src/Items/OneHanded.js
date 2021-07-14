import { Weapon } from './Weapon.js';

export class OneHanded extends Weapon {
  constructor(initializer) {
    super(initializer);
  }
  get type() {
    return 'one-handed';
  }
}
