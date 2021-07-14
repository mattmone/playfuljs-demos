import { LitElement, html, css } from 'https://unpkg.com/lit-dist/dist/lit.js';

class TreasureNotifier extends LitElement {
  /**
   * the currently selected Item
   * @type {Item}
   * @public
   */
  selection = {};

  items = [
    {
      name: 'things',
    },
  ];

  static get styles() {
    return css`
      :host {
        display: grid;
        place-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      #container {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 44px 1fr;
        height: 80vh;
        width: 85vw;
        border-radius: 8px;
      }
      #preview,
      #inventory {
        display: grid;
        height: 100%;
        width: 100%;
        background-color: rgba(100, 100, 100, 1);
        border-radius: 0 0 0 8px;
      }
      #inventory {
        border-radius: 0 0 8px 0;
        border-left: 1px solid black;
      }
      #header {
        display: flex;
        flex-direction: row-reverse;
        grid-column: 1 / 3;
        background-color: black;
        border-radius: 8px 8px 0 0;
      }
      #close {
        background: none;
        border: 1px solid green;
        color: green;
        border-radius: 8px;
        height: 44px;
        width: 44px;
        font-family: 'VT323';
        font-size: 40px;
        padding: 0;
        margin: 0;
        display: grid;
        line-height: 35px;
        cursor: pointer;
      }
    `;
  }

  static get properties() {
    return {
      hidden: { type: Boolean, reflect: true },
      selection: { type: Object },
      items: { type: Array },
    };
  }

  open() {
    this.removeAttribute('hidden');
  }

  close() {
    this.player.inventory.push(...this.items);
    this.toggleAttribute('hidden', true);
  }

  removeItem(removedItem) {
    this.items = this.items.filter(item => item !== removedItem);
  }

  render() {
    return html` <article id="container">
      <section id="header">
        <button id="close" @click="${this.close}">x</button>
      </section>
      <section id="selection" ${this.selection}>
        <h2>${this.selection.name ?? ''}</h2>
        <img src="${this.selection.image}" id="selection-image" />
        <div id="selection-stats"></div>
      </section>
      <section id="inventory">
        <ul id="item-list">
          ${this.items.map(
            item =>
              html`<li class="item">
                <button @click="${() => (this.selection = item)}">${item.name}</button>
                <button @click="${() => this.removeItem(item)}">x</button>
              </li>`,
          )}
        </ul>
      </section>
    </article>`;
  }
}
customElements.define('treasure-notifier', TreasureNotifier);
