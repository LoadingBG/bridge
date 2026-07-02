import fmi from "./fmi.json" with { type: "json" };

class BidBoard extends HTMLElement {
  constructor() {
    super();
    this.currentBid = new Bid(null, null, null, null, null);
    this.currentChooser = CurrentChooser.NORTH;
    this.systemManager = new System(fmi.name, fmi.nonsystemicBid, fmi.bids);

    this.table = undefined;

    this.tiles = [];
    for (let i = 1; i <= 7; i++) {
      for (let suit of Object.keys(Suit)) {
        const tile = document.createElement("number-suit-tile");
        tile.setAttribute("number", i.toString());
        tile.setAttribute("suit", suit);
        tile.onClick(this.#createPopupOnclick(tile, () => {
          this.systemManager.update(i, suit, undefined, undefined, undefined);
          this.currentBid = new Bid(i, Suit[suit], this.currentChooser, null, null);
          this.currentChooser = this.#nextChooser();
          this.#updateTiles();
        }));
        this.tiles.push(tile);
      }
    }

    const double = document.createElement("double-tile");
    double.onClick(this.#createPopupOnclick(double, () => {
      this.systemManager.update(undefined, undefined, true, undefined, undefined);
      this.currentBid.doubler = this.currentChooser;
      this.currentChooser = this.#nextChooser();
      this.#updateTiles();
    }));
    this.tiles.push(double);

    const redouble = document.createElement("redouble-tile");
    redouble.onClick(this.#createPopupOnclick(redouble, () => {
      this.systemManager.update(undefined, undefined, undefined, true, undefined);
      this.currentBid.doubler = null;
      this.currentBid.redoubler = this.currentChooser;
      this.currentChooser = this.#nextChooser();
      this.#updateTiles();
    }));
    this.tiles.push(redouble);

    const pass = document.createElement("pass-tile");
    pass.onClick(this.#createPopupOnclick(pass, () => {
      this.systemManager.update(undefined, undefined, undefined, undefined, true);
      this.currentChooser = this.#nextChooser();
      this.#updateTiles();
    }));
    this.tiles.push(pass);
  }

  #createPopupOnclick(tile, onConfirm) {
    return () => {
      const popup = document.createElement("bid-popup");
      popup.tile = tile.copy();

      const bidInfo = this.systemManager.bidInfo(tile);
      popup.hcp = bidInfo.info.hcp;
      popup.description = bidInfo.info.description;
      
      popup.onCancel = () => {
        this.table.removeChild(popup);
      };
      popup.onConfirm = () => {
        this.table.removeChild(popup);
        onConfirm();
      };
      this.table.appendChild(popup);
    }
  }

  #updateTiles() {
    for (let tile of this.tiles) {
      const numberAttr = tile.getAttribute("number");
      const number = numberAttr === null ? null : parseInt(numberAttr);

      const suitAttr = tile.getAttribute("suit");
      const suit = suitAttr === null ? null : Suit[suitAttr];

      const double = tile instanceof DoubleTile;
      const redouble = tile instanceof RedoubleTile;

      tile.makeSystemic(this.#isBidSystemic(tile));

      const isBidAvailable = this.#isBidAvailable(tile);
      tile.makeAvailable(isBidAvailable);
      tile.enableClick(isBidAvailable);
    }
  }

  #nextChooser() {
    const values = Object.values(CurrentChooser);
    const idx = values.findIndex(e => e === this.currentChooser);
    return values[(idx + 1) % values.length];
  }

  #isBidSystemic(tile) {
    return this.systemManager.bidInfo(tile).systemic;
  }

  #isBidAvailable(tile) {
    const number = tile.hasAttribute("number") ? parseInt(tile.getAttribute("number")) : undefined;
    const suit = Suit[tile.getAttribute("suit")];
    const isDouble = tile instanceof DoubleTile;
    const isRedouble = tile instanceof RedoubleTile;

    if (this.currentBid.bidder === null) {
      return !isDouble && !isRedouble;
    }

    if (number !== undefined && suit !== undefined) {
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

    this.table = document.createElement("div");
    this.table.setAttribute("class", "bid-board");

    for (let i = 1; i <= 7; i++) {
      const row = document.createElement("div");
      row.setAttribute("class", "bid-row");

      for (let suit = 0; suit < Object.keys(Suit).length; suit++) {
        const tile = this.tiles[(i - 1) * Object.keys(Suit).length + suit];
        row.appendChild(tile);
      }

      this.table.appendChild(row);
    }

    const lastRow = document.createElement("div");
    lastRow.setAttribute("class", "bid-row");
    lastRow.appendChild(this.tiles[35]);
    lastRow.appendChild(this.tiles[36]);
    lastRow.appendChild(this.tiles[37]);
    this.table.appendChild(lastRow);

    const tileSize = parseInt(this.getAttribute("tile-size"));
    const gapSize = 2;
    const style = document.createElement("style");
    style.textContent = `
      .bid-board {
        position: relative;
        width: ${tileSize * 5 + 4 * gapSize}px;
        height: ${tileSize * 8 + 7 * gapSize}px;
        display: flex;
        flex-direction: column;
        gap: ${gapSize}px;
      }

      .bid-row {
      	width: 100%;
      	height: ${tileSize}px;
        display: flex;
        flex-direction: row;
        gap: ${gapSize}px;
      }

      number-suit-tile, double-tile, redouble-tile {
        width: ${tileSize}px;
        height: ${tileSize}px;
      }

      pass-tile {
        width: ${tileSize * 3 + gapSize * 2}px;
        height: ${tileSize}px;
      }

      bid-popup {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;

    dom.appendChild(style);
    dom.appendChild(this.table);

    this.#updateTiles();
  }
}

customElements.define("bid-board", BidBoard);
