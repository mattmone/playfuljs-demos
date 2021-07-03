import { Interactable } from './Interactable.js';
import { Map } from './Map.js';
import { EFFECTS } from './constants.js';
import { Bitmap } from './Bitmap.js';
export class Portal extends Interactable {
  constructor(args) {
    super(args);
    this.type = 'exit';
    this.texture = new Bitmap('assets/portal-out.webp', 1024, 1024);
  }

  use({ player }) {
    player.setNewMap(new Map(player.map.size + 4));
    player.level++;
    player.addEffect({ effect: EFFECTS.TELEPORT, duration: 2000 });
  }
}
