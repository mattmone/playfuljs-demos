export const CATEGORIES = [
  { category: 'weapon', chance: 50 },
  { category: 'armor', chance: 90 },
  { category: 'ring', chance: 99 },
  { category: 'gem', chance: 100 },
];
export const TYPES = {
  weapon: ['one-handed', 'two-handed', 'ranged'],
  armor: ['helm', 'body', 'boots', 'gloves'],
  ring: ['ring'],
  gem: ['gem'],
};
export const NAMES = {
  'one-handed': ['broadsword', 'shortsword'],
  'two-handed': ['claymore', 'greatsword'],
  ranged: ['longbow', 'shortbow'],
  helm: ['helmet', 'helm'],
  body: ['plate', 'mail'],
  boots: ['greaves', 'boots'],
  gloves: ['gauntlets', 'gloves'],
  ring: ['ring'],
  gem: ['gem'],
};

export const ITEM_EFFECTS = [
  {
    effect: 'damage',
    weapon: {
      default: {
        prefix: 'sharp',
        description: ' damage',
      },
      ranged: {
        prefix: 'fine',
      },
    },
    armor: {
      default: {
        prefix: 'spiked',
        description: ' reflected damage',
      },
    },
    ring: {
      default: {
        suffix: 'force',
        description: ' damage',
      },
    },
    gem: {
      default: {
        suffix: 'force',
        description: '',
      },
    },
  },
  {
    effect: 'fire',
    weapon: {
      default: {
        prefix: 'burning',
        description: ' fire damage',
      },
      ranged: {
        suffix: 'flames',
      },
    },
    armor: {
      default: {
        prefix: 'smoldering',
        description: ' heat damage',
      },
    },
    ring: {
      default: {
        suffix: 'fire',
        description: '% fire resistance',
      },
    },
    gem: {
      default: {
        suffix: 'fire',
        description: '',
      },
    },
  },
];
