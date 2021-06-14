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
console.log(window.innerHeight);

const player = new Player(15.3, -1.2, Math.PI * 0.3);
const map = new Map(32);
const controls = new Controls(gameCanvas);
const camera = new Camera(gameCanvas, MOBILE ? 160 : 320, 0.8);
const loop = new GameLoop();

map.randomize();

loop.start(seconds => {
  map.update(seconds);
  player.update(controls.states, map, seconds);
  camera.render(player, map);
});
