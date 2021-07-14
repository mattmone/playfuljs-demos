import { Weapon } from './Weapon.js';

export class Ranged extends Weapon {
  constructor(initializer) {
    super(initializer);
  }
  get type() {
    return 'ranged';
  }
}
