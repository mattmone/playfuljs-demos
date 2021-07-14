export class Item {
  /**
   * the initialization of a new Item
   * @param {ItemInitializer} initializer the parameters to initialize an Item
   */
  constructor({ name, type, image, strength, power, effects = [], slots = [], totalSlots = 0 }) {
    this.name = name;
    this.image = image;
    this.strength = strength;
    this.power = power;
    this.effects = effects;
    this.slots = slots;
    this.totalSlots = totalSlots;
  }

  /**
   * @returns {Number} the number of slots available
   */
  get availableSlots() {
    return this.totalSlots - this.slots.length;
  }
}
