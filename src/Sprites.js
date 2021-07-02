class Sprites {
  collection = [];

  getSprite(x, y) {
    return this.collection.find(
      sprite => Math.floor(sprite.x) === Math.floor(x) && Math.floor(sprite.y) === Math.floor(y),
    );
  }

  nearBy({ x, y }) {
    const sprite = this.collection.find(sprite => {
      const distance = Math.sqrt((Math.floor(sprite.x) - x) ** 2 + (Math.floor(sprite.y) - y) ** 2);
      if ((distance <= sprite.distance ?? 1) && !sprite.used) return true;
      return false;
    });
    return sprite;
  }

  reset() {
    this.collection = [];
  }
}

export const sprites = new Sprites();
