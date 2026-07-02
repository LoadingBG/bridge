class SystemBid {
  constructor(bid, isAlert, isDoubled, isRedoubled, description, continuations) {
    this.bid = bid;
    this.isAlert = isAlert;
    this.isDoubled = isDoubled;
    this.isRedoubled = isRedoubled;
    this.description = description;
    this.continuations = continuations;
  }
}



class System {
  constructor(name, nonsystemicBid, bids) {
    this.name = name;
    this.nonsystemicBid = nonsystemicBid,
    this.availableBids = bids;
    this.history = [];
  }

  bidInfo(tile) {
    const number = tile instanceof NumberSuitTile ? parseInt(tile.getAttribute("number")) : undefined;
    const suit = Suit[tile.getAttribute("suit")];
    const isDouble = tile instanceof DoubleTile;
    const isRedouble = tile instanceof RedoubleTile;
    
    for (const bid of this.availableBids) {
      if ((isDouble && bid.double)
        || (isRedouble && bid.redouble)
        || (number !== undefined && number === bid.number && suit !== undefined && suit === Suit[bid.suit])
        || (number === undefined && suit === undefined && !isDouble && !isRedouble && bid.pass)) {
        return {
          systemic: true,
          info: bid,
        };
      }
    }
    return {
      systemic: false,
      info: this.nonsystemicBid,
    };
  }

  update(number, suit, double, redouble, pass) {
    for (const bid of this.availableBids) {
      if (bid.number === number && bid.suit === suit && bid.double === double && bid.redouble === redouble && bid.pass === pass) {
        this.availableBids = bid.continuations;
        const copy = { ...bid };
        delete copy.continuations;
        this.history.push(copy);
        return;
      }
    }
    this.availableBids = [];
    this.history.push({
      number, suit, double, redouble, pass,
      hcp: "-",
      description: "Извънсистемно обявление",
    });
  }
}
