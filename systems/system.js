import Side from "./side.js";
import Suit from "./suit.js";
import TileInfo from "./tileInfo.js";

export class BidInfo {
  constructor(systemic, number, suit, isDoubled, isRedoubled, isPass, isAlert, hcp, description, cards) {
    this.systemic = systemic;
    this.number = number;
    this.suit = suit;
    this.isDoubled = isDoubled;
    this.isRedoubled = isRedoubled;
    this.isPass = isPass;
    this.isAlert = isAlert;
    this.hcp = hcp;
    this.description = description;
    this.cards = cards;
  }

  static systemic(bid) {
    return new BidInfo(
      true,
      bid.number,
      Suit[bid.suit],
      bid.double ?? false,
      bid.redouble ?? false,
      bid.pass ?? false,
      bid.isAlert,
      bid.hcp,
      bid.description,
      bid.cards
    );
  }

  static nonSystemic(tileInfo) {
    return new BidInfo(
      false,
      tileInfo.number,
      tileInfo.suit,
      tileInfo.isDouble,
      tileInfo.isRedouble,
      tileInfo.isPass,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  get tileInfo() {
    return this.isDoubled
      ? TileInfo.DOUBLE
      : this.isRedoubled
        ? TileInfo.REDOUBLE
        : this.isPass
          ? TileInfo.PASS
          : TileInfo.numberSuit(this.number, this.suit);
  }
}



export class System {
  constructor() {
    this.currentChooser = Side.NORTH;
  }

  static fromJSON(json) {
    return Object.assign(new System(), json);
  }

  bidInfo(tileInfo) {
    for (const bid of this.availableBids) {
      if ((tileInfo.isDouble && bid.double)
        || (tileInfo.isRedouble && bid.redouble)
        || (tileInfo.isNumberSuit && tileInfo.number === bid.number && tileInfo.suit === Suit[bid.suit])
        || (tileInfo.isPass && bid.pass)) {
        return BidInfo.systemic(bid);
      }
    }
    return BidInfo.nonSystemic(tileInfo);
  }

  selectNextChooser() {
    const values = Side.values;
    const idx = Side.indexOf(this.currentChooser);
    this.currentChooser = values[(idx + 1) % values.length];
  }

  update(tileInfo) {
    for (const bid of this.availableBids) {
      if ((tileInfo.isDouble && bid.double)
        || (tileInfo.isRedouble && bid.redouble)
        || (tileInfo.isNumberSuit && tileInfo.number === bid.number && tileInfo.suit === Suit[bid.suit])
        || (tileInfo.isPass && bid.pass)) {
        this.availableBids = bid.continuations ?? [];
        return;
      }
    }
    this.availableBids = [];
  }
}
