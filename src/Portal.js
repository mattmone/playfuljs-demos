import { Interactable } from './Interactable.js';
import { Map } from './Map.js';
import { EFFECTS } from './constants.js';
export class Portal extends Interactable {
  constructor(args) {
    super(args);
  }

  use({ player }) {
    player.setNewMap(new Map(player.map.size + 4));
    player.level++;
    player.addEffect({ effect: EFFECTS.TELEPORT, duration: 2000 });
  }
}
