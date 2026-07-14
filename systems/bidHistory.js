import Side from "./side.js";
import BidTile from "./bidTile.js";

class BidHistoryTable extends HTMLElement {
  #columns = [];
  #sideSelectionDisabled = false;

  constructor() {
    super();

    this.visualizePopup = undefined;
  }

  #createColumn(chooser) {
    const column = document.createElement("div");
    column.setAttribute("class", "column");

    const labelbox = document.createElement("span");
    labelbox.setAttribute("class", "label-box");
    labelbox.appendChild(chooser.svg());
    column.appendChild(labelbox);

    return column;
  }

  disableSideSelection(disable) {
    this.#sideSelectionDisabled = disable;
  }

  selectSide(side) {
    if (this.#sideSelectionDisabled) {
      return;
    }

    this.#columns.forEach(c => c.children[0].setAttribute("class", "label-box"));
    if (side === undefined) {
      return;
    }

    const idx = Side.indexOf(side);
    const highlighted = this.#columns[idx].children[0];
    highlighted.setAttribute("class", "label-box active");
  }

  appendTile(bidInfo, side) {
    const sideIdx = Side.indexOf(side);

    const tile = BidTile.fromTileInfo(bidInfo.tileInfo);
    tile.makeAvailable(true);
    tile.onClick(() => this.visualizePopup(bidInfo, () => {}));
    tile.enableClick(true);

    for (let i = 0; i < sideIdx; i++) {
      while (this.#columns[i].childElementCount <= this.#columns[sideIdx].childElementCount) {
        const emptyTile = document.createElement("div");
        emptyTile.setAttribute("class", "empty-tile");
        this.#columns[i].appendChild(emptyTile);
      }
    }

    this.#columns[sideIdx].appendChild(tile);
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("class", "container");

    this.#columns = [
      this.#createColumn(Side.NORTH),
      this.#createColumn(Side.EAST),
      this.#createColumn(Side.SOUTH),
      this.#createColumn(Side.WEST),
    ];
    this.#columns.forEach(column => container.appendChild(column));

    const style = document.createElement("style");
    style.textContent = `
      .container {
        margin: 0px;
        padding: 0px;
        border: 0px;

        width: 100%;
        display: flex;
        background: #0f253f;
        justify-content: space-evenly;
      }

      .column {
        margin: 0px;
        padding: 0px 0px 10px 0px;
        border: 0px;

        width: 20%;
        height: 90%;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .label-box {
        width: 100%;
        aspect-ratio: 1 / 1;
      }

      .bids-box {
        min-height: 10px;
        background: #4c5c71;
      }

      svg {
        fill: #4c5c71;
      }

      .label-box.active svg {
        fill: #fff;
      }

      number-suit-tile, double-tile, redouble-tile, pass-tile, .empty-tile {
        width: 100%;
        aspect-ratio: 1 / 1;
      }
    `;
    dom.appendChild(style);
    dom.appendChild(container);
  }
}

customElements.define("bid-history-table", BidHistoryTable);
