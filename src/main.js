import { Terrain } from './Terrain.js';
import { Player } from './Player.js';
import { Map } from './Map.js';
import { Controls } from './Controls.js';
import { Camera } from './Camera.js';
import { GameLoop } from './GameLoop.js';
import { MOBILE } from './constants.js';

const gameCanvas = document.getElementById('gameCanvas');

gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

let map = new Map(32);
const player = new Player(map.startingPosition);
const controls = new Controls(gameCanvas);
const camera = new Camera(gameCanvas, MOBILE ? 160 : 320, 0.8);
const loop = new GameLoop();

player.addEventListener('player-use', () => {
  if (map.near('exit', player)) {
    map = new Map(32);
    player.setNewMap(map.startingPosition);
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
