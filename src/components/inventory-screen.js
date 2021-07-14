import { LitElement, html, css } from 'https://unpkg.com/lit-dist/dist/lit.js';
import { dieDisplay, clamp } from '../utils.js';
import { Items } from '../Items/Items.js';

class InventoryScreen extends LitElement {
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
      * {
        box-sizing: border-box;
      }
      #container {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 44px 1fr;
        height: 90vh;
        width: 95vw;
        border-radius: 8px;
        color: green;
      }
      #selection,
      #inventory {
        display: grid;
        height: 100%;
        width: 100%;
        background-color: rgba(10, 10, 10, 0.7);
        backdrop-filter: blur(8px);
        border-radius: 0 0 0 8px;
        overflow: auto;
      }
      #selection {
        grid-template-rows: 50px 1fr 35px 2fr;
        place-items: center;
        align-items: flex-start;
      }
      #selection-image {
        max-width: 40%;
      }
      #inventory {
        border-radius: 0 0 8px 0;
        border-left: 1px solid black;
        grid-template-rows: min-content 1fr;
      }
      #header {
        display: flex;
        flex-direction: row-reverse;
        grid-column: 1 / 3;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
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
      #selection-stats {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-auto-rows: 35px;
        font-size: 20px;
        gap: 0 16px;
      }
      #selection-stats div {
        white-space: nowrap;
      }
      #selection-name,
      #type {
        place-self: center;
        text-transform: uppercase;
      }
      #effects-title {
        grid-column: 1 / 3;
        place-self: center;
      }
      #equip {
        border-radius: 8px;
        border: 1px solid green;
        background: black;
        color: green;
        text-transform: uppercase;
        padding: 8px 16px;
        display: grid;
        place-items: center;
      }
      #filter {
        display: flex;
        justify-content: stretch;
        align-items: center;
        flex-wrap: wrap;
      }
      #filter button {
        display: grid;
        place-items: center;
        color: green;
        background: black;
        border: 1px solid green;
        flex: 1;
        height: 44px;
        cursor: pointer;
      }
      #filter button[selected] {
        color: black;
        background: green;
        font-weight: bold;
      }
      #filter button[disabled] {
        opacity: 0.6;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        padding: 0;
        margin: 0;
      }
      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        padding: 16px 32px;
        margin: 0;
      }
      li {
        display: flex;
      }
      .item-name,
      .item-delete {
        flex-grow: 1;
        font-size: 22px;
        font-family: 'VT323';
        color: green;
        background: black;
        border: 1px solid green;
        border-radius: 8px 0 0 8px;
        padding: 0;
        margin: 0;
        display: grid;
        place-items: center;
        cursor: pointer;
        height: 44px;
      }
      .item-delete {
        flex-grow: 0;
        padding: 8px;
        border-radius: 0 8px 8px 0;
        width: 44px;
      }
      .item[selected] .item-name,
      .item[selected] .item-delete {
        color: black;
        background-color: green;
        border-color: black;
      }
      .item[equipped] {
        font-weight: bold;
      }
      .item[equipped]:before {
        content: 'EQUIPPED';
        display: grid;
        place-items: center;
        padding: 0 4px;
        border: 1px solid green;
        border-radius: 8px;
        background-color: black;
        color: green;
      }
      .item[equipped][selected]:before {
        border: 1px solid black;
        border-radius: 8px;
        background-color: green;
        color: black;
      }
    `;
  }

  static get properties() {
    return {
      hidden: { type: Boolean, reflect: true },
      selection: { type: Object },
      items: { type: Items },
      view: { type: String },
    };
  }

  constructor() {
    super();
    /**
     * the currently selected Item
     * @type {Item}
     * @public
     */
    this.selection = {};
    this.items = new Items();
    this.view = 'all';
  }

  get isOpen() {
    return !this.hasAttribute('hidden');
  }

  get viewItems() {
    if (this.view === 'all') return this.items;
    return this.items[this.view];
  }

  close() {
    this.dispatchEvent(new CustomEvent('close'));
    this.hidden = true;
    document.querySelector('#gameCanvas').click();
  }

  open() {
    document.exitPointerLock();
    this.hidden = false;
    this.view = 'all';
  }
  selectItem(item) {
    this.selection = item;
  }

  removeItem(item) {
    const itemIndex = this.items.indexOf(item);
    this.items.splice(itemIndex, 1);
    this.selection = this.items[clamp(itemIndex, 0, this.items.length[-1])];
    this.requestUpdate();
  }

  equip() {
    this.dispatchEvent(new CustomEvent('equip-item', { detail: this.selection }));
  }

  templates = {
    weapon: () => html`
      <div>DAMAGE</div>
      <div>${dieDisplay(this.selection.strength, this.selection.power)}</div>
      <div>SPEED</div>
      <div>${this.selection.speed}</div>
      ${this.templates.slots()} ${this.templates.effects()}
    `,
    armor: () => html`
      <div>DAMAGE REDUCTION</div>
      <div>${dieDisplay(this.selection.strength, this.selection.power)}</div>
      <div>DURABILITY</div>
      <div>${this.selection.strength * this.selection.power * 10}</div>
      ${this.templates.slots()} ${this.templates.effects()}
    `,
    ring: () => html`
      <div>QUALITY</div>
      <div>${this.selection.strength * this.selection.power}</div>
      ${this.templates.slots()} ${this.templates.effects()}
    `,
    gem: () => html`
      <div>PURITY</div>
      <div>${this.selection.strength * this.selection.power}</div>
      ${this.templates.slots()} ${this.templates.effects()}
    `,
    slots: () =>
      html`${this.selection.totalSlots > 0
        ? html`<div>SLOTS</div>
            <div>${this.selection.availableSlots}/${this.selection.totalSlots}</div>`
        : ''}`,
    effects: () => html`${Object.keys(this.selection.effects)?.length
      ? html`<h4 id="effects-title">Effects</h4>`
      : ''}
    ${Object.keys(this.selection.effects).map(
      effect =>
        html`<span>${effect}</span
          ><span
            >${this.selection.effects[effect].level * this.selection.effects[effect].power}${this
              .selection.effects[effect].description}</span
          >${this.selection.effects[effect].gem ? html`<span>(gem)</span>` : ''}`,
    )}`,
  };

  render() {
    return html` <article id="container">
      <section id="header">
        <button id="close" @click="${this.close}">x</button>
      </section>
      <section id="selection" ${this.selection}>
        <h2 id="selection-name">${this.selection.name ?? ''}</h2>
        <img src="${this.selection.image}" id="selection-image" />
        <h3 id="type">${this.selection.type ?? this.selection.category}</h3>
        <div id="selection-stats">${this.templates[this.selection.category]?.()}</div>
        <button id="equip" @click="${this.equip}" ?disabled="${this.selection.type === 'gem'}">
          ${this.selection.equipped ? 'UNEQUIP' : 'EQUIP'}
        </button>
      </section>
      <section id="inventory">
        <div id="filter">
          <button ?selected=${this.view === 'all'} @click="${() => (this.view = 'all')}">
            All
          </button>
          <button
            ?selected=${this.view === 'weapons'}
            ?disabled="${!this.items['weapons']?.length}"
            @click="${() => (this.view = 'weapons')}"
          >
            Weapons
          </button>
          <button
            ?selected=${this.view === 'helms'}
            ?disabled="${!this.items['helms']?.length}"
            @click="${() => (this.view = 'helms')}"
          >
            Helms
          </button>
          <button
            ?selected=${this.view === 'body'}
            ?disabled="${!this.items['body']?.length}"
            @click="${() => (this.view = 'body')}"
          >
            Body
          </button>
          <button
            ?selected=${this.view === 'gloves'}
            ?disabled="${!this.items['gloves']?.length}"
            @click="${() => (this.view = 'gloves')}"
          >
            Gloves
          </button>
          <button
            ?selected=${this.view === 'boots'}
            ?disabled="${!this.items['boots']?.length}"
            @click="${() => (this.view = 'boots')}"
          >
            Boots
          </button>
          <button
            ?selected=${this.view === 'rings'}
            ?disabled="${!this.items['rings']?.length}"
            @click="${() => (this.view = 'rings')}"
          >
            Rings
          </button>
          <button
            ?selected=${this.view === 'gems'}
            ?disabled="${!this.items['gems']?.length}"
            @click="${() => (this.view = 'gems')}"
          >
            Gems
          </button>
        </div>
        <ul id="item-list">
          ${this.viewItems.map(
            item =>
              html`<li
                class="item"
                ?selected="${this.selection === item}"
                ?equipped="${item?.equipped}"
              >
                <button class="item-name" @click="${() => this.selectItem(item)}">
                  ${item.name}
                </button>
                <button class="item-delete" @click="${() => this.removeItem(item)}">x</button>
              </li>`,
          )}
        </ul>
      </section>
    </article>`;
  }
}
customElements.define('inventory-screen', InventoryScreen);
