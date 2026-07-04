class BidHistoryTable extends HTMLElement {
  #columns = [];

  constructor() {
    super();
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

  appendTile(madeBid, side) {
    const sideIdx = Object.values(CurrentChooser).findIndex(e => e === side);

    const tile = document.createElement(
      madeBid.isPass
        ? "pass-tile"
        : madeBid.isDoubled
          ? "double-tile"
          : madeBid.isRedoubled
            ? "redouble-tile"
            : "number-suit-tile"
    );
    if (madeBid.number !== undefined && madeBid.suit !== undefined) {
      tile.setAttribute("number", madeBid.number);
      tile.setAttribute("suit", Object.keys(Suit)[Object.values(Suit).findIndex(e => e === madeBid.suit)]);
    }
    tile.makeAvailable(true);

    this.#columns[sideIdx].appendChild(tile);
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("class", "container");

    this.#columns = [
      this.#createColumn(CurrentChooser.NORTH),
      this.#createColumn(CurrentChooser.EAST),
      this.#createColumn(CurrentChooser.SOUTH),
      this.#createColumn(CurrentChooser.WEST),
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
        padding: 0px;
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

      number-suit-tile, double-tile, redouble-tile, pass-tile {
        width: 100%;
        aspect-ratio: 1 / 1;
      }
    `;
    dom.appendChild(style);
    dom.appendChild(container);
  }
}

customElements.define("bid-history-table", BidHistoryTable);
