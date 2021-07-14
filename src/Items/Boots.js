import { Armor } from './Armor.js';

/**
 * A Boots type Armor
 * @extends Armor
 */
export class Boots extends Armor {
  /**
   * Instantiates the Armor
   * @param {ArmorInitializer} initializer an Item initializer extended for Armors
   */
  constructor(initializer) {
    super(initializer);
  }

  get type() {
    return 'boots';
  }

  get playerSlot() {
    return 'feet';
  }
}
