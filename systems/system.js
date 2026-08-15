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

  get bid() {
    return {
      number: this.number ?? undefined,
      suit: Suit.nameOf(this.suit),
      double: this.isDoubled || undefined,
      redouble: this.isRedoubled || undefined,
      pass: this.isPass || undefined,
      isAlert: this.isAlert,
      hcp: this.hcp,
      description: this.description,
      cards: this.cards,
    };
  }

  clone() {
    return new BidInfo(
      this.systemic,
      this.number,
      this.suit,
      this.isDoubled,
      this.isRedoubled,
      this.isPass,
      this.isAlert,
      structuredClone(this.hcp),
      structuredClone(this.description),
      structuredClone(this.cards)
    );
  }
}



export class System {
  #path;

  constructor(json) {
    this.currentChooser = Side.NORTH;
    this.editedJSON = structuredClone(json);
    this.#path = [];
  }

  static fromJSON(json) {
    return Object.assign(new System(json), structuredClone(json));
  }

  #areEquivalent(tileInfo, bid) {
    return (tileInfo.isDouble && bid.double)
      || (tileInfo.isRedouble && bid.redouble)
      || (tileInfo.isNumberSuit && tileInfo.number === bid.number && tileInfo.suit === Suit[bid.suit])
      || (tileInfo.isPass && bid.pass);
  }

  bidInfo(tileInfo) {
    for (const bid of this.availableBids) {
      if (this.#areEquivalent(tileInfo, bid)) {
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
      if (this.#areEquivalent(tileInfo, bid)) {
        this.#path.push(tileInfo);
        this.availableBids = bid.continuations ?? [];
        return;
      }
    }
    this.#path = undefined;
    this.availableBids = [];
  }

  saveEdit(bidInfo) {
    const isUndefining =
      bidInfo.hcp === undefined
      && bidInfo.description === undefined
      && (bidInfo.cards === undefined || Suit.values.every(suit => bidInfo.cards[suit] === undefined));

    if (this.#path === undefined) {
      alert("Предишно обявяване е извънсистемно.");
      return false;
    }

    const existingBidIdx = this.availableBids.findIndex(bid => this.#areEquivalent(bidInfo.tileInfo, bid));
    if (existingBidIdx !== -1) {
      if (isUndefining && this.availableBids[existingBidIdx].continuations?.length > 0) {
        alert("Ще бъдат загубени последващи обявявания.");
        return false;
      }
      this.availableBids.splice(existingBidIdx, 1);
    }
    if (!isUndefining) {
      this.availableBids.push(bidInfo.bid);
    }

    let parent = this.editedJSON;
    for (const path of this.#path) {
      const children = parent.availableBids ?? parent.continuations;
      let nextParent = undefined;
      for (const child of children) {
        if (this.#areEquivalent(path, child)) {
          nextParent = child;
          break;
        }
      }
      if (nextParent === undefined) {
        alert("Лошо.");
        return false;
      }

      parent = nextParent;
    }

    // Check if subbid already exists
    let children = parent.availableBids ?? parent.continuations;
    if (children === undefined) {
      parent.continuations = [];
      children = parent.continuations;
    }
    const existingChildIdx = children.findIndex(child => this.#areEquivalent(bidInfo.tileInfo, child));
    if (existingChildIdx !== -1) {
      children.splice(existingChildIdx, 1);
    }

    if (!isUndefining) {
      children.push(bidInfo.bid);
    }

    return true;
  }
}
