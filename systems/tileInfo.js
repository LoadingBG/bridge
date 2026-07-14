export default class TileInfo {
  #number;
  #suit;
  #double;
  #redouble;
  #pass;

  constructor(number, suit, double, redouble, pass) {
    this.#number = number;
    this.#suit = suit;
    this.#double = double;
    this.#redouble = redouble;
    this.#pass = pass;
  }

  static DOUBLE = new TileInfo(null, null, true, false, false);
  static REDOUBLE = new TileInfo(null, null, false, true, false);
  static PASS = new TileInfo(null, null, false, false, true);
  static numberSuit(number, suit) {
    return new TileInfo(number, suit, false, false, false);
  }

  get isDouble() {
    return this.#double;
  }

  get isRedouble() {
    return this.#redouble;
  }

  get isPass() {
    return this.#pass;
  }

  get isNumberSuit() {
    return this.#number !== null && this.#suit !== null;
  }

  get number() {
    return this.#number;
  }

  get suit() {
    return this.#suit;
  }
}
