import { pointerTracker } from '../pointerTracker.js';
import { clamp } from '../utils.js';

class OnscreenControls extends HTMLElement {
  #joysticks = {};
  constructor() {
    super();
  }

  connectedCallback() {
    this.leftJoy = this.shadowRoot.querySelector('#left-joy');
    this.rightJoy = this.shadowRoot.querySelector('#right-joy');
    const leftBox = this.leftJoy.getBoundingClientRect();
    const rightBox = this.rightJoy.getBoundingClientRect();
    this.#joysticks[this.leftJoy.id] = {
      start: {
        x: leftBox.left + leftBox.width / 2,
        y: leftBox.top + leftBox.height / 2,
      },
    };
    this.#joysticks[this.rightJoy.id] = {
      start: {
        x: rightBox.left + rightBox.width / 2,
        y: rightBox.top + rightBox.height / 2,
      },
    };
    this.inventory = this.shadowRoot.querySelector('#inventory');

    pointerTracker(this.leftJoy, this.#tracker.bind(this));
    pointerTracker(this.rightJoy, this.#tracker.bind(this));
    this.inventory.addEventListener('click', this.#inventory, { capture: true, passive: true });
  }

  #tracker({ target: joyElement, detail: { state, x, y } }) {
    const { id: joyId } = joyElement;
    const joyState = this.#joysticks[joyId];
    if (state === 'end') {
      joyElement.style.setProperty('--x', 0);
      joyElement.style.setProperty('--y', 0);
      this.dispatchEvent(
        new CustomEvent(`${joyId}-change`, {
          detail: { joyId, dx: 0, dy: 0 },
        }),
      );
      return;
    }
    // now we are moving
    const dx = clamp(x - joyState.start.x, this.getAttribute('min'), this.getAttribute('max'));
    const dy = clamp(y - joyState.start.y, this.getAttribute('min'), this.getAttribute('max'));
    joyElement.style.setProperty('--x', `${dx}px`);
    joyElement.style.setProperty('--y', `${dy}px`);
    this.dispatchEvent(
      new CustomEvent(`${joyId}-change`, {
        detail: { joyId, dx, dy },
      }),
    );
  }

  #inventory() {
    this.dispatchEvent(new CustomEvent('toggle-inventory', { bubbles: true, composed: true }));
  }
}
customElements.define('onscreen-controls', OnscreenControls);
