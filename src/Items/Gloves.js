import { Armor } from './Armor.js';

/**
 * A Gloves type Armor
 * @extends Armor
 */
export class Gloves extends Armor {
  /**
   * Instantiates the Armor
   * @param {ArmorInitializer} initializer an Item initializer extended for Armors
   */
  constructor(initializer) {
    super(initializer);
  }

  get type() {
    return 'gloves';
  }

  get playerSlot() {
    return 'hands';
  }
}
