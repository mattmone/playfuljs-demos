import { Weapon } from './Weapon.js';

export class TwoHanded extends Weapon {
  constructor(initializer) {
    super(initializer);
  }
  get type() {
    return 'two-handed';
  }
}
