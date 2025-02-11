import { Player } from './Player.js';
import { Map } from './Map.js';
import { Controls } from './Controls.js';
import { Camera } from './Camera.js';
import { GameLoop } from './GameLoop.js';
import { MOBILE } from './constants.js';
import { sprites } from './Sprites.js';
import { doubleRaf } from './utils.js';

const game = document.querySelector('#game');
const welcome = document.querySelector('#welcome-screen');

document.querySelector('#enter').addEventListener('click', async () => {
  welcome.toggleAttribute('hidden', true);
  game.removeAttribute('hidden');
  if (MOBILE) await game.requestFullscreen();
  await doubleRaf();
  const gameCanvas = document.getElementById('gameCanvas');

  gameCanvas.width = game.innerWidth;
  gameCanvas.height = game.innerHeight;

  const player = new Player(new Map(32));
  const controls = new Controls(gameCanvas);
  const camera = new Camera(gameCanvas, MOBILE ? 160 : 320, 0.8);
  const loop = new GameLoop();

  document.body.player = player;

  const inventoryScreen = document.querySelector('inventory-screen');
  inventoryScreen.addEventListener('equip-item', ({ detail: item }) => player.equipItem(item));
  inventoryScreen.addEventListener('unequip-item', ({ detail: item }) => player.unequipItem(item));

  controls.addEventListener('toggle-inventory', () => {
    player.toggleInventory();
  });

  player.addEventListener('equipment-change', () => {
    inventoryScreen.requestUpdate();
  });

  player.addEventListener('player-use', () => {
    const sprite = sprites.nearBy({ x: Math.floor(player.x), y: Math.floor(player.y) });
    if (!sprite) return;
    if (sprite.isInteractable) sprite.use({ player });
    const nearby = sprites.nearBy({ x: Math.floor(player.x), y: Math.floor(player.y) });
    player.notify(nearby);
  });
  player.addEventListener('player-position-change', ({ detail: { x, y } }) => {
    const nearby = sprites.nearBy({ x, y });
    player.notify(nearby);
  });

  loop.start(seconds => {
    player.map.update(seconds);
    player.update(controls.states, seconds);
    camera.render(player, player.map);
  });
});
