import { rollDice, oneOf } from '../utils.js';
import { CATEGORIES, TYPES, NAMES, ITEM_EFFECTS } from './item.constants.js';
const itemClass = async type => {
  switch (type) {
    case 'armor':
      const { Armor } = await import('./Armor.js');
      return Armor;
    case 'body':
      const { Body } = await import('./Body.js');
      return Body;
    case 'boots':
      const { Boots } = await import('./Boots.js');
      return Boots;
    case 'gem':
      const { Gem } = await import('./Gem.js');
      return Gem;
    case 'gloves':
      const { Gloves } = await import('./Gloves.js');
      return Gloves;
    case 'helm':
      const { Helm } = await import('./Helm.js');
      return Helm;
    case 'two-handed':
      const { TwoHanded } = await import('./TwoHanded.js');
      return TwoHanded;
    case 'one-handed':
      const { OneHanded } = await import('./OneHanded.js');
      return OneHanded;
    case 'ranged':
      const { Ranged } = await import('./Ranged.js');
      return Ranged;
    case 'ring':
      const { Ring } = await import('./Ring.js');
      return Ring;
  }
};

const generateNameAndImage = (category, type, effects = []) => {
  const baseName = oneOf(NAMES[type]);
  const itemEffects = effects.map(effect => ITEM_EFFECTS.find(item => item.effect === effect));
  const prefix = itemEffects
    .map(
      effect =>
        (effect[category][type]
          ? effect[category][type].prefix
          : effect[category].default?.prefix) ?? '',
    )
    .join(' ');
  const suffix = itemEffects
    .map(
      effect =>
        (effect[category][type]
          ? effect[category][type].suffix
          : effect[category].default?.suffix) ?? '',
    )
    .filter(suffix => suffix);
  if (suffix.length > 1) suffix[suffix.length - 1] = `and ${suffix[suffix.length - 1]}`;
  return {
    name: `${prefix} ${baseName} ${suffix.length ? 'of' : ''} ${suffix.join(', ')}`.trim(),
    image:
      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081',
  };
};

export async function generateItem(level) {
  const category = CATEGORIES.find(category => category.chance >= rollDice(100)).category;
  const type = oneOf(TYPES[category]);
  let strength = rollDice(level, rollDice(20) === 20 ? 2 : 1);
  const power = rollDice(level, rollDice(20) === 20 ? 2 : 1);
  const effects = {};
  for (let e = 0; e < level; e++)
    if (rollDice(20) + Math.floor(level / 5) >= 20) {
      const itemEffect = oneOf(ITEM_EFFECTS);
      const { effect } = itemEffect;
      if (!effects[effect])
        effects[effect] = {
          power: 0,
          level: rollDice(Math.ceil(level / 2)),
          description:
            itemEffect[category][type]?.description ?? itemEffect[category].default.description,
        };
      effects[effect].power++;
    }
  const { name, image } = generateNameAndImage(category, type, Object.keys(effects));
  let totalSlots = category === 'ring' ? 1 : 0;
  while (rollDice(20) + level / 2 >= 20 && totalSlots <= level / 4) totalSlots++;
  let speed;
  if (category === 'weapon') {
    if (type === 'one-handed') speed = rollDice(2, 2);
    if (type === 'two-handed') {
      speed = rollDice(2, 2) + 4;
      strength = Math.floor(1.5 * strength);
    }
    if (type === 'ranged') speed = rollDice(3, 4);
  }
  const itemConstructor = await itemClass(type);
  return new itemConstructor({ name, image, strength, power, effects, totalSlots, speed });
}
