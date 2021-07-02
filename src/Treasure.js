import { Interactable } from './Interactable.js';

export class Treasure extends Interactable {
  constructor(args) {
    super(args);
  }

  use({ player }) {
    super.use({ player });
  }
}
