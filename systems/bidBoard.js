class BidBoard extends HTMLElement {

  constructor() {
    super();
    this.currentBid = new Bid(null, null, null, null, null);
    this.systemManager = undefined;
    this.onChosen = undefined;
    this.visualizePopup = undefined;

    this.table = undefined;

    this.tiles = [];
    for (let i = 1; i <= 7; i++) {
      for (let suit of Object.keys(Suit)) {
        const tile = document.createElement("number-suit-tile");
        tile.setAttribute("number", i.toString());
        tile.setAttribute("suit", suit);
        tile.onClick(this.#createPopupOnclick(tile, () => {
          this.currentBid.doubler = null;
          this.currentBid.redoubler = null;
          this.currentBid = new Bid(i, Suit[suit], this.systemManager.currentChooser, null, null);
        }));
        this.tiles.push(tile);
      }
    }

    const double = document.createElement("double-tile");
    double.onClick(this.#createPopupOnclick(double, () => {
      this.currentBid.doubler = this.systemManager.currentChooser;
      this.currentBid.redoubler = null;
    }));
    this.tiles.push(double);

    const redouble = document.createElement("redouble-tile");
    redouble.onClick(this.#createPopupOnclick(redouble, () => {
      this.currentBid.doubler = null;
      this.currentBid.redoubler = this.systemManager.currentChooser;
    }));
    this.tiles.push(redouble);

    const pass = document.createElement("pass-tile");
    pass.onClick(this.#createPopupOnclick(pass, () => {}));
    this.tiles.push(pass);
  }

  #createPopupOnclick(tile, onConfirm) {
    return () => {
      const bid = this.systemManager.bidInfo(tile).bid;
      this.visualizePopup(bid, () => {
        const madeBid = this.systemManager.update(tile);
        onConfirm();
        this.onChosen(madeBid);
        this.systemManager.selectNextChooser();
        this.#updateTiles();
      });
    };
  }

  #updateTiles() {
    for (let tile of this.tiles) {
      tile.makeSystemic(this.#isBidSystemic(tile));

      const isBidAvailable = this.#isBidAvailable(tile);
      tile.makeAvailable(isBidAvailable);
      tile.enableClick(isBidAvailable);
    }
  }

  #isBidSystemic(tile) {
    return this.systemManager.bidInfo(tile).systemic;
  }

  #isBidAvailable(tile) {
    if (this.currentBid.bidder === null) {
      return !tile.isDouble && !tile.isRedouble;
    }

    if (tile.number !== undefined && tile.suit !== undefined) {
      return tile.number > this.currentBid.number || (tile.number === this.currentBid.number && compareSuits(tile.suit, this.currentBid.suit) > 0);
    }

    const chooserValues = Object.values(CurrentChooser);
    const bidTeam = chooserValues.findIndex(e => e === this.currentBid.bidder) % 2;
    const doubleTeam = chooserValues.findIndex(e => e === this.currentBid.doubler) % 2;
    const redoubleTeam = chooserValues.findIndex(e => e === this.currentBid.redoubler) % 2;
    const chooserTeam = chooserValues.findIndex(e => e === this.systemManager.currentChooser) % 2;

    if (chooserTeam === bidTeam) {
      return !tile.isDouble && (!tile.isRedouble || (doubleTeam !== -1 && doubleTeam !== chooserTeam));
    } else {
      return (!tile.isDouble || (doubleTeam === -1 && redoubleTeam === -1)) && !tile.isRedouble;
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
    `;

    dom.appendChild(style);
    dom.appendChild(this.table);

    this.#updateTiles();
  }
}

customElements.define("bid-board", BidBoard);
