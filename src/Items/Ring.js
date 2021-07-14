import { Item } from './Item.js';

/**
 * A Ring type Item
 * @extends Item
 */
export class Ring extends Item {
  /**
   * Instantiates the Ring
   * @param {RingInitializer} initializer an Item initializer extended for Rings
   */
  constructor(initializer) {
    super(initializer);
  }

  get category() {
    return 'ring';
  }

  get strengthDescription() {
    return 'power';
  }
}
