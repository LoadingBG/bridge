import createSVG from "./createSVG.js";

export default class Suit {
  static #CLUB = new Suit(
    "#31d94e", "#0dc448",
    () => createSVG("0 0 512 512", "M477.443 295.143a104.45 104.45 0 0 1-202.26 36.67c-.08 68.73 4.33 114.46 69.55 149h-177.57c65.22-34.53 69.63-80.25 69.55-149a104.41 104.41 0 1 1-66.34-136.28 104.45 104.45 0 1 1 171.14 0 104.5 104.5 0 0 1 135.93 99.61z"),
  );
  static get CLUB() {
    return this.#CLUB;
  };

  static #DIAMOND = new Suit(
    "#ffd75d", "#febf33",
    () => createSVG("0 0 512 512", "M431.76 256c-69 42.24-137.27 126.89-175.76 224.78C217.51 382.89 149.25 298.24 80.24 256c69-42.24 137.27-126.89 175.76-224.78C294.49 129.11 362.75 213.76 431.76 256z"),
  );
  static get DIAMOND() {
    return this.#DIAMOND;
  };

  static #HEART = new Suit(
    "#f74865", "#e72258",
    () => createSVG("0 0 512 512", "M480.25 156.355c0 161.24-224.25 324.43-224.25 324.43S31.75 317.595 31.75 156.355c0-91.41 70.63-125.13 107.77-125.13 77.65 0 116.48 65.72 116.48 65.72s38.83-65.73 116.48-65.73c37.14.01 107.77 33.72 107.77 125.14z"),
  );
  static get HEART() {
    return this.#HEART;
  };

  static #SPADE = new Suit(
    "#2cb8f3", "#0098fb",
    () => createSVG("0 0 512 512", "M458.915 307.705c0 62.63-54 91.32-91.34 91.34-41.64 0-73.1-18.86-91.83-34.26 2.47 50.95 14.53 87.35 68.65 116h-176.79c54.12-28.65 66.18-65.05 68.65-116-18.73 15.39-50.2 34.28-91.83 34.26-37.29 0-91.34-28.71-91.34-91.34 0-114.47 80.64-83.32 202.91-276.49 122.28 193.17 202.92 162.03 202.92 276.49z"),
  );
  static get SPADE() {
    return this.#SPADE;
  };

  static #NO_TRUMP = new Suit(
    "#c6c6c6", "#ababab",
    () => createSVG("0 0 512 512", "M 256 256 m 200 0 a 200 200 0 1 0 -400 0 a 200 200 0 1 0 400 0"),
  );
  static get NO_TRUMP() {
    return this.#NO_TRUMP;
  };

  static get values() {
    return [this.#CLUB, this.#DIAMOND, this.#HEART, this.#SPADE, this.#NO_TRUMP];
  }

  #numberColor;
  #suitColor;
  #svg;

  constructor(numberColor, suitColor, svg) {
    this.#numberColor = numberColor;
    this.#suitColor = suitColor;
    this.#svg = svg;
  }

  get numberColor() {
    return this.#numberColor;
  }

  get suitColor() {
    return this.#suitColor;
  }

  get svg() {
    return this.#svg;
  }

  static indexOf(suit) {
    switch (suit) {
      case this.#CLUB:     return 0;
      case this.#DIAMOND:  return 1;
      case this.#HEART:    return 2;
      case this.#SPADE:    return 3;
      case this.#NO_TRUMP: return 4;
      default: return -1;
    }
  }

  static nameOf(suit) {
    switch (suit) {
      case this.#CLUB:     return "CLUB";
      case this.#DIAMOND:  return "DIAMOND";
      case this.#HEART:    return "HEART";
      case this.#SPADE:    return "SPADE";
      case this.#NO_TRUMP: return "NO_TRUMP";
      default: return undefined;
    }
  }

  static compare(suit1, suit2) {
    return this.indexOf(suit1) - this.indexOf(suit2);
  }
}
