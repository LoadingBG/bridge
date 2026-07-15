import createSVG from "./createSVG.js";

export default class Side {
  static #NORTH = new Side();
  static get NORTH() {
    return this.#NORTH;
  }

  static #EAST = new Side();
  static get EAST() {
    return this.#EAST;
  }

  static #SOUTH = new Side();
  static get SOUTH() {
    return this.#SOUTH;
  }

  static #WEST = new Side();
  static get WEST() {
    return this.#WEST;
  }

  static get values() {
    return [this.#NORTH, this.#EAST, this.#SOUTH, this.#WEST];
  }

  static indexOf(side) {
    switch (side) {
      case this.#NORTH: return 0;
      case this.#EAST:  return 1;
      case this.#SOUTH: return 2;
      case this.#WEST:  return 3;
      default: return -1;
    }
  }

  static nameOf(side) {
    switch (side) {
      case this.#NORTH: return "NORTH";
      case this.#EAST:  return "EAST";
      case this.#SOUTH: return "SOUTH";
      case this.#WEST:  return "WEST";
      default: return undefined;
    }
  }
}
