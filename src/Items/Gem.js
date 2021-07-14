import { Item } from './Item.js';

/**
 * A Gem type Item
 * @extends Item
 */
export class Gem extends Item {
  /**
   * Instantiates the Gem
   * @param {GemInitializer} initializer an Item initializer extended for Gems
   */
  constructor(initializer) {
    super(initializer);
    delete this.slots;
    delete this.totalSlots;
  }

  get category() {
    return 'gem';
  }

  get strengthDescription() {
    return 'power';
  }
}
