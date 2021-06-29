import { Player } from './Player.js';
import { Map } from './Map.js';
import { Controls } from './Controls.js';
import { Camera } from './Camera.js';
import { GameLoop } from './GameLoop.js';
import { MOBILE, EFFECTS } from './constants.js';

const game = document.querySelector('#game');
const welcome = document.querySelector('#welcome-screen');
const doubleRaf = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

document.querySelector('#enter').addEventListener('click', async () => {
  welcome.toggleAttribute('hidden', true);
  game.removeAttribute('hidden');
  if (MOBILE) await game.requestFullscreen();
  await doubleRaf();
  const gameCanvas = document.getElementById('gameCanvas');

  gameCanvas.width = game.innerWidth;
  gameCanvas.height = game.innerHeight;
  let mapSize = 32;

  let map = new Map(mapSize);
  const player = new Player(map.startingPosition);
  const controls = new Controls(gameCanvas);
  const camera = new Camera(gameCanvas, MOBILE ? 160 : 320, 0.8);
  const loop = new GameLoop();

  player.addEventListener('player-use', () => {
    if (map.near('exit', player)) {
      mapSize += 4;
      map = new Map(mapSize);
      player.setNewMap(map.startingPosition);
      player.addEffect({ effect: EFFECTS.TELEPORT, duration: 2000 });
    }
  });
  player.addEventListener('player-position-change', () => {
    const nearby = map.nearBy(player);
    player.notify(nearby);
  });

  loop.start(seconds => {
    map.update(seconds);
    player.update(controls.states, map, seconds);
    camera.render(player, map);
  });
});
