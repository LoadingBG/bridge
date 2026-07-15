import createComponent from "../createComponent.js";
import Side from "../side.js";
import Suit from "../suit.js";
import TileInfo from "../tileInfo.js";

class CurrentBid {
  constructor(number, suit, bidder, doubler, redoubler) {
    this.number = number;
    this.suit = suit;
    this.bidder = bidder;
    this.doubler = doubler;
    this.redoubler = redoubler;
  }
}

await createComponent("bid-board", template =>
  class BidBoard extends HTMLElement {
    #tiles;

    #currentBid = new CurrentBid(null, null, null, null, null);
    #passesInARow = 0;

    constructor() {
      super();

      this.systemManager = undefined;

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));
      this.#tiles = dom.querySelectorAll("bid-tile");

      for (let i = 1; i <= 7; i++) {
        for (let suit = 0; suit < Suit.values.length; suit++) {
          const tile = this.#tiles[(i - 1) * Suit.values.length + suit];
          tile.info = TileInfo.numberSuit(i, Suit.values[suit]);
          tile.onClick(this.#createPopupOnclick(tile.info, () => {
            this.#currentBid = new CurrentBid(i, Suit.values[suit], this.systemManager.currentChooser, null, null);
            this.#passesInARow = 0;
          }));
        }
      }

      const double = this.#tiles[35];
      double.info = TileInfo.DOUBLE;
      double.onClick(this.#createPopupOnclick(TileInfo.DOUBLE, () => {
        this.#currentBid.doubler = this.systemManager.currentChooser;
        this.#currentBid.redoubler = null;
        this.#passesInARow = 0;
      }));

      const redouble = this.#tiles[36];
      redouble.info = TileInfo.REDOUBLE;
      redouble.onClick(this.#createPopupOnclick(TileInfo.REDOUBLE, () => {
        this.#currentBid.doubler = null;
        this.#currentBid.redoubler = this.systemManager.currentChooser;
        this.#passesInARow = 0;
      }));

      const pass = this.#tiles[37];
      pass.info = TileInfo.PASS;
      pass.onClick(this.#createPopupOnclick(TileInfo.PASS, () => {
        this.#passesInARow++;
      }));
    }

    #createPopupOnclick(tileInfo, onConfirm) {
      return () => {
        const bidInfo = this.systemManager.bidInfo(tileInfo);
        this.visualizePopup(bidInfo, () => {
          this.systemManager.update(tileInfo);
          onConfirm();
          this.onChosen(bidInfo);
          this.systemManager.selectNextChooser();
          if ((this.#currentBid.bidder === null && this.#passesInARow === 4) || (this.#currentBid.bidder !== null && this.#passesInARow >= 3)) {
            this.onBiddingEnd();
          }
          this.#updateTiles();
        });
      };
    }

    #updateTiles() {
      for (let tile of this.#tiles) {
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
      if (this.#currentBid.bidder === null) {
        return this.#passesInARow < 4 && !tileInfo.isDouble && !tileInfo.isRedouble;
      }

      if (this.#passesInARow >= 3) {
        return false;
      }

      if (tileInfo.isNumberSuit) {
        return tileInfo.number > this.#currentBid.number || (tileInfo.number === this.#currentBid.number && Suit.compare(tileInfo.suit, this.#currentBid.suit) > 0);
      }

      const bidTeam = Side.indexOf(this.#currentBid.bidder) % 2;
      const doubleTeam = Side.indexOf(this.#currentBid.doubler) % 2;
      const redoubleTeam = Side.indexOf(this.#currentBid.redoubler) % 2;
      const chooserTeam = Side.indexOf(this.systemManager.currentChooser) % 2;

      if (chooserTeam === bidTeam) {
        return !tileInfo.isDouble && (!tileInfo.isRedouble || (doubleTeam !== -1 && doubleTeam !== chooserTeam));
      } else {
        return (!tileInfo.isDouble || (doubleTeam === -1 && redoubleTeam === -1)) && !tileInfo.isRedouble;
      }
    }

    connectedCallback() {
      this.#updateTiles();
    }
  }
);

