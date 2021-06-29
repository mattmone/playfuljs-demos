import { TEXTURE, CIRCLE, MOBILE, SPRITES } from './constants.js';

export class Camera {
  constructor(canvas, resolution, focalLength) {
    this.ctx = canvas.getContext('2d');
    const gameBox = document.querySelector('#game').getBoundingClientRect();
    this.width = canvas.width = Math.floor(gameBox.width);
    this.height = canvas.height = Math.floor(gameBox.height);
    this.resolution = resolution;
    this.spacing = this.width / resolution;
    this.focalLength = focalLength || 0.8;
    this.range = 8;
    this.lightRange = 5;
    this.scale = (this.width + this.height) / 1200;
    this.zBuffer = new Array(this.width).fill(0);
  }

  render(player, map) {
    this.drawSky(player.direction, map.skybox, map.light);
    this.drawColumns(player, map);
    this.drawSprites(player, map);
    this.drawWeapon(player.weapon, player.paces);
    this.renderEffects(player);
    this.drawMinimap(player, map);
  }

  renderEffects(player) {
    if (!player.effects.length) return delete this.particles;
    if (!this.particles)
      this.particles = new Array(Math.ceil(Math.random() * 40) + 100).fill(0).map(() => ({
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height * 1.8),
        width: Math.ceil(Math.random() * 3),
        height: Math.ceil(Math.random() * 3 + 5),
        speed: Math.ceil(Math.random() * 20),
        opacity: Math.random(),
      }));
    for (let particle of this.particles) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      this.ctx.fillRect(
        particle.x,
        particle.y,
        particle.width * this.spacing,
        particle.height * this.spacing,
      );
      particle.y -= particle.speed;
    }
  }

  drawSky(direction, sky, ambient) {
    const width = sky.width * (this.height / sky.height) * 2;
    const left = (direction / CIRCLE) * -width;

    this.ctx.save();
    this.ctx.drawImage(sky.image, left, 0, width, this.height);
    if (left < width - this.width) {
      this.ctx.drawImage(sky.image, left + width, 0, width, this.height);
    }
    if (ambient > 0) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = ambient * 0.1;
      this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
    }
    this.ctx.restore();
  }

  drawColumns(player, map) {
    this.ctx.save();
    for (let column = 0; column < this.resolution; column++) {
      this.drawColumn(column, player, map);
    }
    this.ctx.restore();
  }

  drawWeapon(weapon, paces) {
    const bobX = Math.cos(paces * 2) * this.scale * 6;
    const bobY = Math.sin(paces * 4) * this.scale * 6;
    const left = this.width * 0.66 + bobX;
    const top = this.height * 0.6 + bobY;
    this.ctx.drawImage(
      weapon.image,
      left,
      top,
      weapon.width * this.scale,
      weapon.height * this.scale,
    );
  }

  drawColumn(column, player, map) {
    const cameraX = (2 * column) / this.resolution - 1;
    const rayDirection = {
      x: player.directionX + player.planeX * cameraX,
      y: player.directionY + player.planeY * cameraX,
    };
    const deltaDistance = {
      x: Math.abs(1 / rayDirection.x),
      y: Math.abs(1 / rayDirection.y),
    };
    let hit = 0;
    const mapPosition = {
      x: Math.floor(player.x),
      y: Math.floor(player.y),
    };
    let sideDistance = {},
      perpendicularWallDistance,
      step = {},
      side;

    if (rayDirection.x < 0) {
      step.x = -1;
      sideDistance.x = (player.x - mapPosition.x) * deltaDistance.x;
    } else {
      step.x = 1;
      sideDistance.x = (mapPosition.x + 1 - player.x) * deltaDistance.x;
    }
    if (rayDirection.y < 0) {
      step.y = -1;
      sideDistance.y = (player.y - mapPosition.y) * deltaDistance.y;
    } else {
      step.y = 1;
      sideDistance.y = (mapPosition.y + 1 - player.y) * deltaDistance.y;
    }
    let range = 0;
    while (hit === 0 && range <= this.range) {
      range++;
      if (sideDistance.x < sideDistance.y) {
        sideDistance.x += deltaDistance.x;
        mapPosition.x += step.x;
        side = 0;
      } else {
        sideDistance.y += deltaDistance.y;
        mapPosition.y += step.y;
        side = 1;
      }
      if (map.getPoint(mapPosition.x, mapPosition.y) > 0) hit = 1;
      map.setMiniMapPoint(mapPosition.x, mapPosition.y);
    }
    if (side === 0)
      perpendicularWallDistance = (mapPosition.x - player.x + (1 - step.x) / 2) / rayDirection.x;
    else perpendicularWallDistance = (mapPosition.y - player.y + (1 - step.y) / 2) / rayDirection.y;

    const lineHeight = Math.floor(this.height / perpendicularWallDistance);
    const draw = {
      start: -lineHeight / 2 + this.height / 2,
      end: lineHeight / 2 + this.height / 2,
    };
    draw.height = draw.end - draw.start;

    const wallX =
      (side === 0
        ? player.y + perpendicularWallDistance * rayDirection.y
        : player.x + perpendicularWallDistance * rayDirection.x) % 1;

    const texture = map.wallTexture;
    let textureX = Math.floor(wallX * texture.width);
    if (side === 0 && rayDirection.x > 0) textureX = texture.width - textureX - 1;
    if (side === 1 && rayDirection.y < 0) textureX = texture.width - textureX - 1;

    let drawStep = (1 * texture.height) / lineHeight;
    let texturePosition = (draw.start - this.height / 2 + lineHeight / 2) * drawStep;

    this.ctx.globalAlpha = 1;

    const textureColumn = texture.width * Math.floor(texturePosition) + textureX;
    const left = Math.floor(column * this.spacing);

    this.ctx.drawImage(
      texture.image,
      textureColumn,
      0,
      1,
      texture.height,
      left,
      draw.start,
      Math.ceil(this.spacing),
      draw.height,
    );

    this.ctx.fillStyle = `rgba(0,0,0,${Math.max(
      perpendicularWallDistance / this.lightRange - map.light,
      0,
    )})`;
    this.ctx.fillRect(left, draw.start, Math.ceil(this.spacing), draw.height);
    this.zBuffer[column] = perpendicularWallDistance;
    // if (sprites.length) sprites.forEach(sprite => this.drawSprite(...sprite));
  }

  drawSprites(player, map) {
    for (let sprite of map.sprites) {
      const spriteTexture = sprite.texture;
      //translate sprite position to relative to camera
      const spriteX = sprite.x - player.x;
      const spriteY = sprite.y - player.y;

      //transform sprite with the inverse camera matrix
      // [ planeX   dirX ] -1                                       [ dirY      -dirX ]
      // [               ]       =  1/(planeX*dirY-dirX*planeY) *   [                 ]
      // [ planeY   dirY ]                                          [ -planeY  planeX ]

      const invDet = 1.0 / (player.planeX * player.directionY - player.directionX * player.planeY); //required for correct matrix multiplication

      const transformX = invDet * (player.directionY * spriteX - player.directionX * spriteY);
      const transformY = invDet * (-player.planeY * spriteX + player.planeX * spriteY); //this is actually the depth inside the screen, that what Z is in 3D, the distance of sprite to player, matching sqrt(spriteDistance[i])

      const spriteScreenX = Math.floor((this.resolution / 2) * (1 + transformX / transformY));

      //parameters for scaling and moving the sprites
      const uDiv = 1;
      const vDiv = 1;
      const vMove = 50;
      const vMoveScreen = Math.floor(vMove / transformY);

      //calculate height of the sprite on screen
      const spriteHeight = Math.abs(Math.floor(this.height / transformY)) / vDiv; //using "transformY" instead of the real distance prevents fisheye
      //calculate lowest and highest pixel to fill in current stripe
      const drawStartY = -spriteHeight / 2 + this.height / 2 + vMoveScreen;
      // if(drawStartY < 0) drawStartY = 0;
      const drawEndY = spriteHeight / 2 + this.height / 2 + vMoveScreen;
      // if(drawEndY >= h) drawEndY = h - 1;

      //calculate width of the sprite
      const spriteWidth = Math.abs(Math.floor(this.height / transformY)) / uDiv;
      const drawStartX = -spriteWidth / 2 + spriteScreenX;
      // if(drawStartX < 0) drawStartX = 0;
      const drawEndX = spriteWidth / 2 + spriteScreenX;
      // if (drawEndX >= this.width) drawEndX = this.width - 1;

      //loop through every vertical stripe of the sprite on screen
      for (let stripe = drawStartX || -1; stripe < drawEndX || 0; stripe++) {
        const texX = Math.floor(
          ((stripe - (-spriteWidth / 2 + spriteScreenX)) * spriteTexture.width) / spriteWidth,
        );
        //the conditions in the if are:
        //1) it's in front of camera plane so you don't see things behind you
        //2) it's on the screen (left)
        //3) it's on the screen (right)
        //4) ZBuffer, with perpendicular distance
        const closer = transformY < this.zBuffer[Math.floor(stripe)];
        if (transformY > 0 && stripe > 0 && stripe < this.resolution && closer) {
          const left = stripe * this.spacing;
          const width = this.spacing;
          const drawHeight = drawEndY - drawStartY;
          this.ctx.globalAlpha = 1 / (transformY - this.lightRange / 4);
          this.ctx.drawImage(
            spriteTexture.image,
            texX,
            0,
            1,
            spriteTexture.height,
            left,
            drawStartY,
            width,
            drawHeight,
          );
          this.ctx.globalAlpha = 1;
        }
      }
    }
  }

  drawMinimap(player, { size, minimap, getPoint, portalIn, portalOut, indexToCoordinates }) {
    this.ctx.save();
    const mapSizeModifier = 5;
    const width = size * mapSizeModifier;
    const height = size * mapSizeModifier;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.fillRect(this.width - width, 0, width, height);
    minimap.forEach((cell, index) => {
      const cellCoordinates = indexToCoordinates(index);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      if ([TEXTURE.WALL, 255].includes(cell)) this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      if (cellCoordinates.x === portalIn.x && cellCoordinates.y === portalIn.y)
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
      if (cellCoordinates.x === portalOut.x && cellCoordinates.y === portalOut.y && cell !== 254)
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      this.ctx.fillRect(
        this.width - mapSizeModifier - (index % size) * mapSizeModifier,
        Math.floor(index / size) * mapSizeModifier,
        mapSizeModifier,
        mapSizeModifier,
      );
    });
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    this.ctx.fillRect(
      this.width - mapSizeModifier / 2 - player.x * mapSizeModifier,
      (player.y - 0.5) * mapSizeModifier,
      mapSizeModifier,
      mapSizeModifier,
    );
    this.ctx.restore();
  }

  sprite(height, angle, distance) {
    const invDet = 1.0 / (planeX * dirY - dirX * planeY); //required for correct matrix multiplication

    const transformX = invDet * (dirY * spriteX - dirX * spriteY);
    const transformY = invDet * (-planeY * spriteX + planeX * spriteY); //this is actually the depth inside the screen, that what Z is in 3D
    const z = distance * Math.cos(angle);
    return {
      top: bottom - wallHeight,
      height: wallHeight,
    };
  }
}
