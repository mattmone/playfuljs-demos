import { Armor } from './Armor.js';

/**
 * A Body type Armor
 * @extends Armor
 */
export class Body extends Armor {
  /**
   * Instantiates the Armor
   * @param {ArmorInitializer} initializer an Item initializer extended for Armors
   */
  constructor(initializer) {
    super(initializer);
  }

  get type() {
    return 'body';
  }

  get playerSlot() {
    return 'body';
  }
}
