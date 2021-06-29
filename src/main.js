import { Player } from './Player.js';
import { Map } from './Map.js';
import { Controls } from './Controls.js';
import { Camera } from './Camera.js';
import { GameLoop } from './GameLoop.js';
import { MOBILE, EFFECTS } from './constants.js';

const game = document.querySelector('#game');
const welcome = document.querySelector('#welcome-screen');

document.querySelector('#enter').addEventListener('click', async () => {
  welcome.toggleAttribute('hidden', true);
  game.removeAttribute('hidden');
  if (MOBILE) await game.requestFullscreen();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const gameCanvas = document.getElementById('gameCanvas');

      gameCanvas.width = game.innerWidth;
      gameCanvas.height = game.innerHeight;

      let map = new Map(32);
      const player = new Player(map.startingPosition);
      const controls = new Controls(gameCanvas);
      const camera = new Camera(gameCanvas, MOBILE ? 320 : 640, 0.8);
      const loop = new GameLoop();

      player.addEventListener('player-use', () => {
        if (map.near('exit', player)) {
          map = new Map(32);
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
  });
});
