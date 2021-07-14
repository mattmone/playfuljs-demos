import { Interactable } from './Interactable.js';
import { Bitmap } from './Bitmap.js';
import { rollDice, clamp } from './utils.js';
import { generateItem } from './Items/generateItem.js';
import { Items } from './Items/Items.js';

export class Treasure extends Interactable {
  constructor(args) {
    super(args);
    this.type = 'treasure';
    this.distance = 1.5;
    this._texture = new Bitmap('assets/chest_closed.webp', 1024, 1024);
    this.interactedTexture = new Bitmap('assets/chest_open.webp', 1024, 1024);
  }

  async use({ player }) {
    super.use({ player });
    const { level } = player;
    const itemNumber = clamp(rollDice(Math.floor(level) / 2), 1, 4);
    const items = new Items(
      ...(await Promise.all(new Array(itemNumber).fill(0).map(async () => generateItem(level)))),
    );
    await import('./components/inventory-screen.js');
    const treasureNotifier = document.querySelector('inventory-screen');
    treasureNotifier.items = items;
    treasureNotifier.selection = items[0];
    treasureNotifier.open();
    treasureNotifier.addEventListener(
      'close',
      () => {
        player.inventory.push(...treasureNotifier.items);
      },
      { once: true },
    );
  }
}
