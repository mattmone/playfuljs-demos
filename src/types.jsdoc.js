/**
 * @typedef {Object} Point
 * @property {Number} x the x value
 * @property {Number} y the y value
 * @property {Number} [direction] the direction in radians
 */

/**
 * @typedef {Object} ItemInitializer
 * @property {String} name the name of the item
 * @property {String} category the higher category the item falls under weapon|armor|ring|gem
 * @property {String} type the type of the item one-handed|two-handed|ranged|helm|body|boots|gloves|ring|gem
 * @property {Number} strength the strength of the item i.e weapon damage equals {strength}d{power} or armor defense absorbs {strength} damage, to a maximum of {power} points
 * @property {Number} power the overall power of the item i.e. weapon damage equals {strength}d{power} or armor defense absorbs {strength} damage, to a maximum of {power} points
 * @property {Array<Effect>=} effects the Effects on the Item
 * @property {Array<gems>} slots the slots available for gems
 * @property {Number} totalSlots the total number of slots available
 * @property {Number} availableSlots the unused number of slots the item has
 */

/**
 * @typedef {ItemInitializer} WeaponInitializer
 * @property {Number} speed the speed of the weapon
 */

/**
 * @typedef {ItemInitializer} ArmorInitializer
 */

/**
 * @typedef {ItemInitializer} RingInitializer
 */

/**
 * @typedef {ItemInitializer} GemInitializer
 */

/**
 * @typedef
 */

/**
 * @typedef {Object} Effect
 * @property {String} name the name of the effect
 * @property {Number} strength the strength of the effect
 * @property {String} prefix the prefix to add to the item name
 * @property {String} suffix the suffix to add to the item name
 */
