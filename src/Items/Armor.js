import { Item } from './Item.js';

/**
 * A Armor type Item
 * @extends Item
 */
export class Armor extends Item {
  /**
   * Instantiates the Armor
   * @param {ArmorInitializer} initializer an Item initializer extended for Armors
   */
  constructor(initializer) {
    super(initializer);
  }

  get category() {
    return 'armor';
  }

  get strengthDescription() {
    return 'defense';
  }
}
