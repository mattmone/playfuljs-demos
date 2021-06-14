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
    document.addEventListener('keydown', this.onKey.bind(this, true), false);
    document.addEventListener('keyup', this.onKey.bind(this, false), false);
    document.addEventListener('touchstart', this.onTouch.bind(this), false);
    document.addEventListener('touchmove', this.onTouch.bind(this), false);
    document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  onTouch(event) {
    const t = event.touches[0];
    this.onTouchEnd(event);
    if (t.pageY < window.innerHeight * 0.5) this.onKey(true, { keyCode: 38 });
    else if (t.pageX < window.innerWidth * 0.5) this.onKey(true, { keyCode: 37 });
    else if (t.pageY > window.innerWidth * 0.5) this.onKey(true, { keyCode: 39 });
  }

  onTouchEnd(event) {
    this.states = { left: false, right: false, forward: false, backward: false };
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();
  }

  onMouseMove({ movementX }) {
    if (!this.locked) return;
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
    if (event.stopPropagation) event.stopPropagation();
  }
}
