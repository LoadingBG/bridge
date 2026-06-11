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
  constructor(name, bids) {
    this.name = name;
    this.availableBids = bids;
    this.currentBid = null;
  }
}
