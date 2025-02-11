export class Terrain {
  constructor(detail) {
    this.size = Math.pow(2, detail) + 1;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
  }

  get(x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
    return this.map[x + this.size * y];
  }

  set(x, y, val) {
    this.map[x + this.size * y] = val;
  }

  generate(roughness) {
    const self = this;

    this.set(0, 0, self.max);
    this.set(this.max, 0, self.max / 2);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, self.max / 2);

    divide(this.max);

    function divide(size) {
      let x,
        y,
        half = size / 2;
      const scale = roughness * size;
      if (half < 1) return;

      for (y = half; y < self.max; y += size) {
        for (x = half; x < self.max; x += size) {
          square(x, y, half, Math.random() * scale * 2 - scale);
        }
      }
      for (y = 0; y <= self.max; y += half) {
        for (x = (y + half) % size; x <= self.max; x += size) {
          diamond(x, y, half, Math.random() * scale * 2 - scale);
        }
      }
      divide(size / 2);
    }

    function average(values) {
      const valid = values.filter(function (val) {
        return val !== -1;
      });
      const total = valid.reduce(function (sum, val) {
        return sum + val;
      }, 0);
      return total / valid.length;
    }

    function square(x, y, size, offset) {
      var ave = average([
        self.get(x - size, y - size), // upper left
        self.get(x + size, y - size), // upper right
        self.get(x + size, y + size), // lower right
        self.get(x - size, y + size), // lower left
      ]);
      self.set(x, y, ave + offset);
    }

    function diamond(x, y, size, offset) {
      var ave = average([
        self.get(x, y - size), // top
        self.get(x + size, y), // right
        self.get(x, y + size), // bottom
        self.get(x - size, y), // left
      ]);
      self.set(x, y, ave + offset);
    }
  }

  draw(ctx, width, height) {
    const self = this;
    const waterVal = this.size * 0.3;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const val = this.get(x, y);
        const top = project(x, y, val);
        const bottom = project(x + 1, y, 0);
        const water = project(x, y, waterVal);
        const style = brightness(x, y, this.get(x + 1, y) - val);

        rect(top, bottom, style);
        rect(water, bottom, 'rgba(50, 150, 200, 0.15)');
      }
    }

    function rect(a, b, style) {
      if (b.y < a.y) return;
      ctx.fillStyle = style;
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    }

    function brightness(x, y, slope) {
      if (y === self.max || x === self.max) return '#000';
      const b = ~~(slope * 50) + 128;
      return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
    }

    function iso(x, y) {
      return {
        x: 0.5 * (self.size + x - y),
        y: 0.5 * (x + y),
      };
    }

    function project(flatX, flatY, flatZ) {
      const point = iso(flatX, flatY);
      const x0 = width * 0.5;
      const y0 = height * 0.2;
      const z = self.size * 0.5 - flatZ + point.y * 0.75;
      const x = (point.x - self.size * 0.5) * 6;
      const y = (self.size - point.y) * 0.005 + 1;

      return {
        x: x0 + x / y,
        y: y0 + z / y,
      };
    }
  }
}
