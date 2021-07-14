import { MOBILE } from './constants.js';
export class Controls extends EventTarget {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.canvas.onclick = async () => {
      document.addEventListener(
        'pointerlockchange',
        () => {
          this.locked = true;
          document.addEventListener(
            'pointerlockchange',
            () => {
              this.locked = false;
              this.resetStates();
            },
            { capture: false, once: true },
          );
        },
        { capture: false, once: true },
      );
      await this.canvas.requestPointerLock();
    };

    this.codes = {
      ArrowLeft: 'left',
      a: 'left',
      ArrowRight: 'right',
      d: 'right',
      ArrowUp: 'forward',
      w: 'forward',
      ArrowDown: 'backward',
      s: 'backward',
    };
    this.states = {
      left: false,
      right: false,
      forward: false,
      backward: false,
      rotate: false,
      inventory: false,
    };
    this.modifiers = {
      left: -1,
      right: 1,
      forward: -1,
      backward: 1,
    };
    if (MOBILE) {
      import('./components/onscreen-controls.js');
      const onscreenControls = document.querySelector('onscreen-controls');
      onscreenControls.toggleAttribute('hidden');
      onscreenControls.addEventListener(
        'right-joy-change',
        ({ detail: { joyId, dx, dy } }) => {
          this.onMouseMove({ movementX: dx / 4, skipLockCheck: true });
        },
        { capture: true, passive: true },
      );
      onscreenControls.addEventListener(
        'left-joy-change',
        ({ detail: { joyId, dx, dy } }) => {
          this.states.forward = false;
          this.states.backward = false;
          this.states.right = false;
          this.states.left = false;
          if (dy < 0) {
            this.states.forward = dy / 10;
          }
          if (dy > 0) {
            this.states.backward = dy / 10;
          }
          if (dx < 0) {
            this.states.left = dx / 10;
          }
          if (dx > 0) {
            this.states.right = dx / 10;
          }
        },
        { capture: true, passive: true },
      );
      onscreenControls.addEventListener('toggle-inventory', () => {
        this.dispatchEvent(new CustomEvent('toggle-inventory'));
      });
    }

    document.addEventListener('keydown', this.onKey.bind(this, 3), false);
    document.addEventListener('keyup', this.onKey.bind(this, false), false);
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  resetStates() {
    for (let state of Object.keys(this.states)) this.states[state] = false;
  }

  onMouseMove({ movementX, skipLockCheck = false }) {
    if (!this.locked && !skipLockCheck) return;
    const negative = movementX < 0 ? -1 : 1;
    this.states.rotate = negative * (Math.min(Math.abs(movementX), 25) * 0.3);
    requestAnimationFrame(() => {
      this.states.rotate = false;
    });
  }

  onKey(val, event) {
    if (event.key === 'i' && event.type === 'keyup') {
      this.dispatchEvent(new CustomEvent('toggle-inventory'));
      return;
    }
    if (!this.locked) return;
    const state = this.codes[event.key];
    if (typeof state === 'undefined') return;
    this.states[state] = val * this.modifiers[state];
    if (event.preventDefault) event.preventDefault();
  }
}
