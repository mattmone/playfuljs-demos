import { Armor } from './Armor.js';

/**
 * A Helm type Armor
 * @extends Armor
 */
export class Helm extends Armor {
  /**
   * Instantiates the Armor
   * @param {ArmorInitializer} initializer an Item initializer extended for Armors
   */
  constructor(initializer) {
    super(initializer);
  }

  get type() {
    return 'helm';
  }

  get playerSlot() {
    return 'head';
  }
}
