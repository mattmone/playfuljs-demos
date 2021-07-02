import { Sprite } from './Sprite.js';

export class Interactable extends Sprite {
  constructor({ x, y, distance, type, texture, interactedTexture }) {
    super({ x, y, distance, type, texture });
    this.interactedTexture = interactedTexture;
    this.used = false;
  }

  get isInteractable() {
    return true;
  }

  use() {
    this.texture = this.interactedTexture;
    this.used = true;
  }
}
