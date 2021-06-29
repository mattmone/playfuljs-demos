import { MOBILE } from './constants.js';
export class Controls {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.onclick = async () => {
      document.addEventListener(
        'pointerlockchange',
        () => {
          this.locked = true;
          console.log('locked');
          document.addEventListener(
            'pointerlockchange',
            () => {
              this.locked = false;
              console.log('unlocked');
            },
            { capture: false, once: true },
          );
        },
        { capture: false, once: true },
      );
      await this.canvas.requestPointerLock();
    };

    this.codes = {
      65: 'left',
      37: 'left',
      68: 'right',
      39: 'right',
      87: 'forward',
      38: 'forward',
      83: 'backward',
      40: 'backward',
    };
    this.states = {
      left: false,
      right: false,
      forward: false,
      backward: false,
      rotate: false,
    };
    // if (MOBILE) {
    import('./onscreen-controls.js');
    const onscreenControls = document.querySelector('onscreen-controls');
    onscreenControls.toggleAttribute('hidden');
    onscreenControls.addEventListener(
      'right-joy-change',
      ({ detail: { joyId, dx, dy } }) => {
        this.onMouseMove({ movementX: dx / 2, skipLockCheck: true });
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

    // }

    document.addEventListener('keydown', this.onKey.bind(this, 3), false);
    document.addEventListener('keyup', this.onKey.bind(this, false), false);
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
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
    if (!this.locked) return;
    const state = this.codes[event.keyCode];
    if (typeof state === 'undefined') return;
    this.states[state] = val;
    if (event.preventDefault) event.preventDefault();
    // if (event.stopPropagation) event.stopPropagation();
  }
}
