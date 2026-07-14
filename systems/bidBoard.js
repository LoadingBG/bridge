import Side from "./side.js";
import Suit from "./suit.js";
import TileInfo from "./tileInfo.js";
import "./components/bid-tile.js";

class CurrentBid {
  constructor(number, suit, bidder, doubler, redoubler) {
    this.number = number;
    this.suit = suit;
    this.bidder = bidder;
    this.doubler = doubler;
    this.redoubler = redoubler;
  }
}



class BidBoard extends HTMLElement {
  #passesInARow = 0;

  constructor() {
    super();
    this.currentBid = new CurrentBid(null, null, null, null, null);
    this.systemManager = undefined;
    this.onChosen = undefined;
    this.visualizePopup = undefined;
    this.onBiddingEnd = undefined;

    this.table = undefined;

    this.tiles = [];
    for (let i = 1; i <= 7; i++) {
      for (let suit of Suit.values) {
        const tileInfo = TileInfo.numberSuit(i, suit);
        const tile = document.createElement("bid-tile");
        tile.info = tileInfo;
        tile.onClick(this.#createPopupOnclick(tileInfo, () => {
          this.currentBid.doubler = null;
          this.currentBid.redoubler = null;
          this.currentBid = new CurrentBid(i, suit, this.systemManager.currentChooser, null, null);
          this.#passesInARow = 0;
        }));
        this.tiles.push(tile);
      }
    }

    const double = document.createElement("bid-tile");
    double.info = TileInfo.DOUBLE;
    double.onClick(this.#createPopupOnclick(TileInfo.DOUBLE, () => {
      this.currentBid.doubler = this.systemManager.currentChooser;
      this.currentBid.redoubler = null;
      this.#passesInARow = 0;
    }));
    this.tiles.push(double);

    const redouble = document.createElement("bid-tile");
    redouble.info = TileInfo.REDOUBLE;
    redouble.onClick(this.#createPopupOnclick(TileInfo.REDOUBLE, () => {
      this.currentBid.doubler = null;
      this.currentBid.redoubler = this.systemManager.currentChooser;
      this.#passesInARow = 0;
    }));
    this.tiles.push(redouble);

    const pass = document.createElement("bid-tile");
    pass.info = TileInfo.PASS;
    pass.onClick(this.#createPopupOnclick(TileInfo.PASS, () => {
      this.#passesInARow++;
    }));
    this.tiles.push(pass);
  }

  #createPopupOnclick(tileInfo, onConfirm) {
    return () => {
      const bidInfo = this.systemManager.bidInfo(tileInfo);
      this.visualizePopup(bidInfo, () => {
        this.systemManager.update(tileInfo);
        onConfirm();
        this.onChosen(bidInfo);
        this.systemManager.selectNextChooser();
        if ((this.currentBid.bidder === null && this.#passesInARow === 4) || (this.currentBid.bidder !== null && this.#passesInARow >= 3)) {
          this.onBiddingEnd();
        }
        this.#updateTiles();
      });
    };
  }

  #updateTiles() {
    for (let tile of this.tiles) {
      tile.makeSystemic(this.#isBidSystemic(tile.info));

      const isBidAvailable = this.#isBidAvailable(tile.info);
      tile.makeAvailable(isBidAvailable);
      tile.enableClick(isBidAvailable);
    }
  }

  #isBidSystemic(tileInfo) {
    return this.systemManager.bidInfo(tileInfo).systemic;
  }

  #isBidAvailable(tileInfo) {
    if (this.currentBid.bidder === null) {
      return this.#passesInARow < 4 && !tileInfo.isDouble && !tileInfo.isRedouble;
    }

    if (this.#passesInARow >= 3) {
      return false;
    }

    if (tileInfo.isNumberSuit) {
      return tileInfo.number > this.currentBid.number || (tileInfo.number === this.currentBid.number && Suit.compare(tileInfo.suit, this.currentBid.suit) > 0);
    }

    const bidTeam = Side.indexOf(this.currentBid.bidder) % 2;
    const doubleTeam = Side.indexOf(this.currentBid.doubler) % 2;
    const redoubleTeam = Side.indexOf(this.currentBid.redoubler) % 2;
    const chooserTeam = Side.indexOf(this.systemManager.currentChooser) % 2;

    if (chooserTeam === bidTeam) {
      return !tileInfo.isDouble && (!tileInfo.isRedouble || (doubleTeam !== -1 && doubleTeam !== chooserTeam));
    } else {
      return (!tileInfo.isDouble || (doubleTeam === -1 && redoubleTeam === -1)) && !tileInfo.isRedouble;
    }
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    this.table = document.createElement("div");
    this.table.setAttribute("class", "bid-board");

    for (let i = 1; i <= 7; i++) {
      const row = document.createElement("div");
      row.setAttribute("class", "bid-row");

      for (let suit = 0; suit < Suit.values.length; suit++) {
        const tile = this.tiles[(i - 1) * Suit.values.length + suit];
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
    this.tiles[37].style.width = `${tileSize * 3 + gapSize * 2}px`;
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

      bid-tile {
        width: ${tileSize}px;
        height: ${tileSize}px;
      }
    `;

    dom.appendChild(style);
    dom.appendChild(this.table);

    this.#updateTiles();
  }
}

customElements.define("bid-board", BidBoard);
