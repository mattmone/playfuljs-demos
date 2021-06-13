import { Terrain } from './Terrain.js';
import { Player } from './Player.js';
import { Map } from './Map.js';
import { Controls } from './Controls.js';
import { Camera } from './Camera.js';
import { GameLoop } from './GameLoop.js';
import { MOBILE } from './constants.js';

const display = document.getElementById('gameCanvas');
const ctx = display.getContext('2d');
const width = (display.width = window.innerWidth);
const height = (display.height = window.innerHeight);

const terrain = new Terrain(9);
terrain.generate(0.7);
terrain.draw(ctx, width, height);

const player = new Player(15.3, -1.2, Math.PI * 0.3);
const map = new Map(32);
const controls = new Controls();
const camera = new Camera(display, MOBILE ? 160 : 320, 0.8);
const loop = new GameLoop();

map.randomize();

loop.start(function frame(seconds) {
  map.update(seconds);
  player.update(controls.states, map, seconds);
  camera.render(player, map);
});
