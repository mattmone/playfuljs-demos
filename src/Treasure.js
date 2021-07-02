import { Interactable } from './Interactable.js';
import { Bitmap } from './Bitmap.js';

export class Treasure extends Interactable {
  constructor(args) {
    super(args);
    this.type = 'treasure';
    this.distance = 1.5;
    this.texture = new Bitmap('assets/chest_closed.png', 1024, 1024);
    this.interactedTexture = new Bitmap('assets/chest_open.png', 1024, 1024);
  }

  use({ player }) {
    super.use({ player });
  }
}
