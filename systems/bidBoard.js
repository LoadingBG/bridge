import fmi from "./fmi.json" with { type: "json" };

class BidBoard extends HTMLElement {
  constructor() {
    super();
    this.currentBid = new Bid(null, null, null, null, null);
    this.currentChooser = CurrentChooser.NORTH;
    this.bidHistory = [];
    this.systemManager = new System(fmi.name, fmi.bids);

    this.tiles = [];
    for (let i = 1; i <= 7; i++) {
      for (let suit of Object.keys(Suit)) {
        const tile = document.createElement("bid-tile");
        tile.setAttribute("number", i.toString());
        tile.setAttribute("suit", suit);
        this.tiles.push({
          tile: tile,
          onclick: () => {
            this.currentBid = new Bid(i, Suit[suit], this.currentChooser, null, null);
            this.currentChooser = this.#nextChooser();
            this.#updateTiles();
          },
        });
      }
    }

    const double = document.createElement("bid-tile");
    double.setAttribute("double", "");
    this.tiles.push({
      tile: double,
      onclick: () => {
        this.currentBid.doubler = this.currentChooser;
        this.currentChooser = this.#nextChooser();
        this.#updateTiles();
      },
    });

    const redouble = document.createElement("bid-tile");
    redouble.setAttribute("redouble", "");
    this.tiles.push({
      tile: redouble,
      onclick: () => {
        this.currentBid.doubler = null;
        this.currentBid.redoubler = this.currentChooser;
        this.currentChooser = this.#nextChooser();
        this.#updateTiles();
      },
    });

    const pass = document.createElement("bid-tile");
    pass.setAttribute("pass", "");
    this.tiles.push({
      tile: pass,
      onclick: () => {
        this.currentChooser = this.#nextChooser();
        this.#updateTiles();
      },
    });
  }

  #updateTiles() {
    for (let tile of this.tiles) {
      const numberAttr = tile.tile.getAttribute("number");
      const number = numberAttr === null ? null : parseInt(numberAttr);

      const suitAttr = tile.tile.getAttribute("suit");
      const suit = suitAttr === null ? null : Suit[suitAttr];

      const double = tile.tile.getAttribute("double") !== null;
      const redouble = tile.tile.getAttribute("redouble") !== null;

      tile.tile.setAttribute("systemic", `${this.#isBidSystemic(number, suit, double, redouble)}`);

      if (this.#isBidAvailable(number, suit, double, redouble)) {
        tile.tile.setAttribute("available", "true");
        tile.tile.onclick = tile.onclick;
      } else {
        tile.tile.setAttribute("available", "false");
        tile.tile.onclick = null;
      }
    }
  }

  #nextChooser() {
    const values = Object.values(CurrentChooser);
    const idx = values.findIndex(e => e === this.currentChooser);
    return values[(idx + 1) % values.length];
  }

  #isBidSystemic(number, suit, isDouble, isRedouble) {
    return this.systemManager.availableBids.some(bid => {
      return (bid.number === number && Suit[bid.suit] === suit)
        || (isDouble && bid.double)
        || (isRedouble && bid.redouble)
        || (number === null && suit === null && !isDouble && !isRedouble && bid.pass);
    });
  }

  #isBidAvailable(number, suit, isDouble, isRedouble) {
    if (this.currentBid.bidder === null) {
      return !isDouble && !isRedouble;
    }

    if (number !== null && suit !== null) {
      return number > this.currentBid.number || (number === this.currentBid.number && compareSuits(suit, this.currentBid.suit) > 0);
    }

    const chooserValues = Object.values(CurrentChooser);
    const bidTeam = chooserValues.findIndex(e => e === this.currentBid.bidder) % 2;
    const doubleTeam = chooserValues.findIndex(e => e === this.currentBid.doubler) % 2;
    const redoubleTeam = chooserValues.findIndex(e => e === this.currentBid.redoubler) % 2;
    const chooserTeam = chooserValues.findIndex(e => e === this.currentChooser) % 2;

    if (chooserTeam === bidTeam) {
      return !isDouble && (!isRedouble || (doubleTeam !== -1 && doubleTeam !== chooserTeam));
    } else {
      return (!isDouble || (doubleTeam === -1 && redoubleTeam === -1)) && !isRedouble;
    }
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const table = document.createElement("div");
    table.setAttribute("class", "bid-board");

    for (let i = 1; i <= 7; i++) {
      const row = document.createElement("div");
      row.setAttribute("class", "bid-row");

      for (let suit = 0; suit < Object.keys(Suit).length; suit++) {
        const tile = this.tiles[(i - 1) * Object.keys(Suit).length + suit];
        row.appendChild(tile.tile);
      }

      table.appendChild(row);
    }

    const lastRow = document.createElement("div");
    lastRow.setAttribute("class", "bid-row");
    lastRow.appendChild(this.tiles[35].tile);
    lastRow.appendChild(this.tiles[36].tile);
    lastRow.appendChild(this.tiles[37].tile);
    table.appendChild(lastRow);

    const tileSize = parseInt(this.getAttribute("tile-size"));
    const gapSize = 2;
    const style = document.createElement("style");
    style.textContent = `
      .bid-board {
        width: ${tileSize * 5 + 4 * gapSize}px;
        height: ${tileSize * 8 + 7 * gapSize}px;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .bid-row {
      	width: 100%;
        display: flex;
        flex-direction: row;
        gap: ${gapSize}px;
      }

      bid-tile {
        width: ${tileSize}px;
        height: ${tileSize}px;
      }

      bid-tile[pass] {
        width: ${tileSize * 3 + gapSize * 2}px;
        height: ${tileSize}px;
      }
    `;

    dom.appendChild(style);
    dom.appendChild(table);

    this.#updateTiles();
  }
}

customElements.define("bid-board", BidBoard);
