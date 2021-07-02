import { Bitmap } from './Bitmap.js';
import { TEXTURE } from './constants.js';
import { oneOf, removeFromArray, rollDice } from './utils.js';
import { sprites } from './Sprites.js';
import { Sprite } from './Sprite.js';
import { Portal } from './Portal.js';
import { Treasure } from './Treasure.js';

const DEV_MODE = location.href.includes('localhost');
export class Map {
  /**
   * A Map
   * @param {Number} size the size of a side for a square map
   */
  constructor(size) {
    sprites.reset();
    this.size = size;
    this.wallGrid = new Uint8Array(size * size);
    this.wallGrid.fill(255);
    this.minimap = new Uint8Array(size * size);
    this.minimap.fill(254);
    this.skybox = new Bitmap('assets/deathvalley_panorama.jpg', 2000, 750);
    this.wallTexture = new Bitmap('assets/wall_texture.jpg', 1024, 1024);
    this.light = 0;
    this.build();
    this.indexToCoordinates = this.indexToCoordinates.bind(this);
  }

  /**
   * the direction appropriate room to access the beginning stairs
   */
  get startingPosition() {
    if (!this.portalIn) throw new Error('Map not built yet.');
    return {
      x: this.portalIn.x + 0.5,
      y: this.portalIn.y + 0.5,
      direction: Math.PI * Math.random() * 2,
    };
  }

  /**
   * the direction appropriate room to access the exit stairs
   */
  get endingPosition() {
    if (!this.portalOut) throw new Error('Map not built yet.');
    return {
      x: this.portalOut.x,
      y: this.portalOut.y,
    };
  }

  indexToCoordinates(index) {
    return {
      x: Math.floor(index % this.size),
      y: Math.floor(index / this.size),
    };
  }

  /**
   * determine the exit/entrance point of stairs at the given point
   * @param {Point} stairs the stairs point
   * @param {Object} possibleDirections an object of enumerated possible directions
   * @returns {Point}
   */
  _directionedPosition(stairs, possibleDirections) {
    if (stairs.direction === possibleDirections.NORTH)
      return {
        x: stairs.x + 0.5,
        y: stairs.y - 0.5,
        direction: (270 * Math.PI) / 180,
      };
    if (stairs.direction === possibleDirections.EAST)
      return { x: stairs.x + 1.5, y: stairs.y + 0.5, direction: (0 * Math.PI) / 180 };
    if (stairs.direction === possibleDirections.SOUTH)
      return {
        x: stairs.x + 0.5,
        y: stairs.y + 1.5,
        direction: (90 * Math.PI) / 180,
      };
    if (stairs.direction === possibleDirections.WEST)
      return {
        x: stairs.x - 0.5,
        y: stairs.y + 0.5,
        direction: (180 * Math.PI) / 180,
      };
  }

  /**
   * get the value of the wallGrid at the given coordinates
   * @param {Number} x the x coordinate
   * @param {Number} y the y coordinate
   * @returns {Number}
   */
  getPoint(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    return this.wallGrid[y * this.size + x];
  }

  /**
   * Get the room north of the current point
   * @param {Point} point the map point
   * @returns {Point|false}
   */
  getNorth({ x, y }) {
    if (y <= 0) return false;
    return { x, y: y - 1 };
  }

  /**
   * Get the room east of the current point
   * @param {Point} point the map point
   * @returns {Point|false}
   */
  getEast({ x, y }) {
    if (x >= this.size) return false;
    return { x: x + 1, y };
  }

  /**
   * Get the room south of the current point
   * @param {Point} point the map point
   * @returns {Point|false}
   */
  getSouth({ x, y }) {
    if (y >= this.size) return false;
    return { x, y: y + 1 };
  }

  /**
   * Get the room west of the current point
   * @param {Point} point the map point
   * @returns {Point|false}
   */
  getWest({ x, y }) {
    if (x <= 0) return false;
    return { x: x - 1, y };
  }

  /**
   * get all the directions from the given point
   * @param {Point} point the map point
   * @returns {Object}
   */
  getAllDirections(point) {
    return {
      north: this.getNorth(point),
      east: this.getEast(point),
      south: this.getSouth(point),
      west: this.getWest(point),
    };
  }

  /**
   *
   * @param {Number} x the x coordinate
   * @param {Number} y the y coordinate
   * @param {Number} value the value to be set
   */
  setPoint(x, y, value) {
    x = Math.floor(x);
    y = Math.floor(y);
    this.wallGrid[y * this.size + x] = value;
  }

  /**
   * get the value of the wallGrid at the given coordinates
   * @param {Number} x the x coordinate
   * @param {Number} y the y coordinate
   * @returns {Number}
   */
  getMiniMapPoint(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    return this.minimap[y * this.size + x];
  }

  /**
   * Set the point on the minimap to its coordiantes in the wallGrid
   * @param {Number} x the x coordinate
   * @param {Number} y the y coordinate
   */
  setMiniMapPoint(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    this.minimap[y * this.size + x] = this.wallGrid[y * this.size + x];
  }

  /**
   * randomly build the floor plan for the map
   */
  build() {
    for (let i = 0; i < this.size; i++) {
      this.setPoint(i, 0, TEXTURE.WALL);
      this.setPoint(i, this.size - 1, TEXTURE.WALL);
      this.setPoint(0, i, TEXTURE.WALL);
      this.setPoint(this.size - 1, i, TEXTURE.WALL);
    }
    let x = rollDice(this.size - 2, 1);
    let y = rollDice(this.size - 2, 1);
    this.portalIn = {
      x,
      y,
    };
    this.setMiniMapPoint(this.portalIn.x, this.portalIn.y);

    const endx = rollDice(this.size - 2, 1);
    const endy = rollDice(this.size - 2, 1);

    this.portalOut = { x: endx, y: endy };

    this.setPoint(this.portalIn.x, this.portalIn.y, 0);
    sprites.collection.push(
      new Sprite({
        type: 'entrance',
        x: this.portalIn.x + 0.5,
        y: this.portalIn.y + 0.5,
        texture: new Bitmap('assets/portal-in.webp', 1024, 1024),
      }),
    );
    this.setPoint(this.portalOut.x, this.portalOut.y, 0);
    sprites.collection.push(
      new Portal({
        x: this.portalOut.x + 0.5,
        y: this.portalOut.y + 0.5,
      }),
    );

    this.rooms = new Array(rollDice(3, Math.round(this.size / 10)))
      .fill(0)
      .map((room, index, rooms) => {
        return {
          x: rollDice(this.size) - 1,
          y: rollDice(this.size) - 1,
          size: rollDice(2, 2),
        };
      });

    let current = { ...this.portalIn };
    this.rooms
      .sort((a, b) => rollDice(3, 1) - 2)
      .forEach(room => {
        if (!this._checkPath(room, 255)) return;
        this.setPoint(room.x, room.y, 0);

        this._empathen(current, room);

        for (let xCoordinate = room.x - room.size; xCoordinate < room.x + room.size; xCoordinate++)
          for (
            let yCoordinate = room.y - room.size;
            yCoordinate < room.y + room.size;
            yCoordinate++
          )
            if (this._checkPath({ x: xCoordinate, y: yCoordinate }))
              this.setPoint(xCoordinate, yCoordinate, 0);
      });
    this._empathen(current, this.portalOut);
    for (let room of this.rooms) {
      const treasures = rollDice(3) - 1;
      const { x, y } = {
        x: rollDice(room.size) + (room.x - room.size),
        y: rollDice(room.size) + (room.y - room.size),
      };
      sprites.collection.push(
        new Treasure({
          x: x + 0.5,
          y: y + 0.5,
        }),
      );
    }

    if (DEV_MODE) this.minimap = this.wallGrid;
  }

  /**
   * make a path from the start to the end
   * @param {Point} start the starting point
   * @param {Point} end the ending point
   */
  _empathen(start, end) {
    while (start.x !== end.x || start.y !== end.y) {
      const axisPossibilities = [];
      if (start.x !== end.x) axisPossibilities.push('x');
      if (start.y !== end.y) axisPossibilities.push('y');
      const axis = oneOf(axisPossibilities);
      const length = rollDice(Math.abs(end[axis] - start[axis]));
      const direction = end[axis] - start[axis] > 0 ? 1 : -1;

      let possiblePath = { ...start };
      for (let step = 0; step < length; step++) {
        possiblePath[axis] += direction;
        if (this._checkPath(possiblePath)) this.setPoint(possiblePath.x, possiblePath.y, 0);
        else {
          possiblePath = { ...start };
          const opposingAxis = axis === 'x' ? 'y' : 'x';
          possiblePath[opposingAxis] += direction * (rollDice(2, 1) - 1 || -1);
          if (this._checkPath(possiblePath)) this.setPoint(possiblePath.x, possiblePath.y, 0);
        }
      }
      start.x = possiblePath.x;
      start.y = possiblePath.y;
    }
  }

  /**
   * Checks that path point
   * @param {Point} point the point
   * @param {String|Array} value value to check against
   * @returns Boolean of whether the point value matches
   */
  _checkPath(point, value = [0, 255]) {
    if (!Array.isArray(value)) value = [value];
    return value.includes(this.getPoint(point.x, point.y));
  }

  /**
   * determine the door direction from its point and possible directions
   * @param {Point} point the Point of the door
   * @param {Object} selections possible selections for direction
   * @returns Number
   */
  _determineDoorDirection({ x, y }, selections) {
    let possibilities = [...Object.values(selections)];
    if (x <= 1) removeFromArray(possibilities, selections.EAST);
    if (x >= this.size - 1) removeFromArray(possibilities, selections.WEST);
    if (y <= 1) removeFromArray(possibilities, selections.NORTH);
    if (y >= this.size - 1) removeFromArray(possibilities, selections.SOUTH);
    return oneOf(possibilities);
  }

  /**
   * cast a ray from a point and see what hits you get out to a certain range
   * @param {Point} point the starting point
   * @param {Number} angle the angle to cast the ray in radians
   * @param {Number} range how far the ray should cast
   * @returns {Array} an array of hits
   */
  cast(point, angle, range) {
    const self = this;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const noWall = { length2: Infinity };

    return ray({ x: point.x, y: point.y, height: 0, distance: 0 });

    function ray(origin) {
      const stepX = step(sin, cos, origin.x, origin.y);
      const stepY = step(cos, sin, origin.y, origin.x, true);
      const nextStep =
        stepX.length2 < stepY.length2
          ? inspect(stepX, 1, 0, origin.distance, stepX.y)
          : inspect(stepY, 0, 1, origin.distance, stepY.x);

      if (nextStep.distance > range) return [origin];
      return [origin].concat(ray(nextStep));
    }

    function step(rise, run, x, y, inverted) {
      if (run === 0) return noWall;
      const dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
      const dy = dx * (rise / run);
      return {
        x: inverted ? y + dy : x + dx,
        y: inverted ? x + dx : y + dy,
        length2: dx * dx + dy * dy,
      };
    }

    function inspect(step, shiftX, shiftY, distance, offset) {
      const dx = cos < 0 ? shiftX : 0;
      const dy = sin < 0 ? shiftY : 0;
      const x = step.x - dx;
      const y = step.y - dy;
      const pointValue = self.getPoint(x, y);
      step.height = [1, 255].includes(pointValue) ? 1 : 0;
      step.texture = pointValue;
      step.sprite = self.sprites.find(
        sprite => Math.floor(sprite.x) === Math.floor(x) && Math.floor(sprite.y) === Math.floor(y),
      );
      step.distance = distance + Math.sqrt(step.length2);
      if (shiftX) step.shading = cos < 0 ? 2 : 0;
      else step.shading = sin < 0 ? 2 : 1;
      step.offset = offset - Math.floor(offset);
      return step;
    }
  }

  /**
   * update the lighting
   * @param {Number} seconds the distance out of the light
   */
  update(seconds) {
    this.light = Math.max(this.light - 10 * seconds, 0);
  }
}
