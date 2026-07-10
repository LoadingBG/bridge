class MadeBid {
  constructor(number, suit, isDoubled, isRedoubled, isPass, isAlert, hcp, description) {
    this.number = number;
    this.suit = suit;
    this.isDoubled = isDoubled;
    this.isRedoubled = isRedoubled;
    this.isPass = isPass;
    this.isAlert = isAlert;
    this.hcp = hcp;
    this.description = description;
  }
}



class System {
  constructor(name, conventions, nonsystemicBid, bids) {
    this.currentChooser = Side.NORTH;
    this.name = name;
    this.conventions = conventions;
    this.nonsystemicBid = nonsystemicBid;
    this.availableBids = bids;
  }

  bidInfo(tile) {
    for (const bid of this.availableBids) {
      if ((tile.isDouble && bid.double)
        || (tile.isRedouble && bid.redouble)
        || (tile.number !== undefined && tile.number === bid.number && tile.suit !== undefined && tile.suit === Suit[bid.suit])
        || (tile.isPass && bid.pass)) {
        return {
          systemic: true,
          bid: new MadeBid(tile.number, tile.suit, tile.isDouble, tile.isRedouble, tile.isPass, bid.isAlert, bid.hcp, bid.description),
        };
      }
    }
    return {
      systemic: false,
      bid: new MadeBid(tile.number, tile.suit, tile.isDouble, tile.isRedouble, tile.isPass, this.nonsystemicBid.isAlert, this.nonsystemicBid.hcp, this.nonsystemicBid.description),
    };
  }

  selectNextChooser() {
    const values = Side.values;
    const idx = Side.indexOf(this.currentChooser);
    this.currentChooser = values[(idx + 1) % values.length];
  }

  update(chosenTile) {
    for (const bid of this.availableBids) {
      if (bid.number === chosenTile.number
          && bid.suit === chosenTile.suitName
          && (bid.double === chosenTile.isDouble || (bid.double === undefined && !chosenTile.isDouble))
          && (bid.redouble === chosenTile.isRedouble || (bid.redouble === undefined && !chosenTile.isRedouble))
          && (bid.pass === chosenTile.isPass || (bid.pass === undefined && !chosenTile.isPass))) {
        this.availableBids = bid.continuations;
        return new MadeBid(chosenTile.number, chosenTile.suit, chosenTile.isDouble, chosenTile.isRedouble, chosenTile.isPass, bid.isAlert, bid.hcp, bid.description);
      }
    }

    this.availableBids = [];
    return new MadeBid(chosenTile.number, chosenTile.suit, chosenTile.isDouble, chosenTile.isRedouble, chosenTile.isPass, this.nonsystemicBid.isAlert, this.nonsystemicBid.hcp, this.nonsystemicBid.description);
  }
}
