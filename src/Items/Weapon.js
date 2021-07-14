import { Item } from './Item.js';

/**
 * A Weapon type Item
 * @extends Item
 */
export class Weapon extends Item {
  /**
   * Instantiates the Weapon
   * @param {WeaponInitializer} initializer an Item initializer extended for Weapons
   */
  constructor(initializer) {
    super(initializer);
    this.speed = initializer.speed;
  }

  get category() {
    return 'weapon';
  }

  get strengthDescription() {
    return 'damage';
  }
}
