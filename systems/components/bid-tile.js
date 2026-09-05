import createComponent from "../createComponent.js";
import createSVG from "../createSVG.js";

const createOne   = () => createSVG("0 0 16 16", "M6.64594 0L2.32922 2.15836L3.67086 4.84164L7.00004 3.17705V13H3.00004V16H13V13H10V0H6.64594Z");
const createTwo   = () => createSVG("0 0 16 16", "M3 5C3 2.23858 5.23858 0 8 0H8.07519C10.7951 0 13 2.20491 13 4.92481C13 6.36248 12.3718 7.72838 11.2802 8.66401L6.22155 13H13V16H3V11.8101L9.32784 6.38624C9.75447 6.02056 10 5.48671 10 4.92481C10 3.86177 9.13823 3 8.07519 3H8C6.89543 3 6 3.89543 6 5H3Z");
const createThree = () => createSVG("0 0 16 16", "M6.5 4.5C6.5 3.67157 7.17157 3 8 3C8.82843 3 9.5 3.67157 9.5 4.5C9.5 5.32843 8.82843 6 8 6H7V9H8C9.10457 9 10 9.89543 10 11C10 12.1046 9.10457 13 8 13C6.89543 13 6 12.1046 6 11H3C3 13.7614 5.23858 16 8 16C10.7614 16 13 13.7614 13 11C13 9.57824 12.4066 8.29508 11.4539 7.38469C12.107 6.60363 12.5 5.59771 12.5 4.5C12.5 2.01472 10.4853 0 8 0C5.51472 0 3.5 2.01472 3.5 4.5H6.5Z");
const createFour  = () => createSVG("0 0 16 16", "M13 0H10V7H6.03769L7.46324 0.680058L4.53676 0.0199507L3 6.83293V10H10V16H13V0Z");
const createFive  = () => createSVG("0 0 16 16", "M4.11984 0H13V3H6.88024L6.70068 5.15468C7.11748 5.05361 7.55269 5 8.00004 5C11.0376 5 13.5 7.46243 13.5 10.5C13.5 13.5376 11.0376 16 8.00004 16C5.68948 16 3.71518 14.5757 2.90039 12.5628L5.6812 11.4372C6.05319 12.3561 6.95322 13 8.00004 13C9.38075 13 10.5 11.8807 10.5 10.5C10.5 9.11929 9.38075 8 8.00004 8C7.36498 8 6.78843 8.23483 6.34681 8.62461L5.9215 9H3.36984L4.11984 0Z");
const createSix   = () => createSVG("0 0 16 16", "M8.14856 5.00197C11.1174 5.0807 13.5 7.51211 13.5 10.5C13.5 13.5376 11.0376 16 8 16C4.96243 16 2.5 13.5376 2.5 10.5C2.5 9.44185 2.79882 8.45349 3.31667 7.61471L7.43172 0.0343628L10.0683 1.46564L8.14856 5.00197ZM5.90352 9.13756C6.34947 8.45275 7.12186 8 8 8C9.38071 8 10.5 9.11929 10.5 10.5C10.5 11.8807 9.38071 13 8 13C6.61929 13 5.5 11.8807 5.5 10.5C5.5 10.0937 5.60153 9.69386 5.79537 9.33679L5.90352 9.13756Z");
const createSeven = () => createSVG("0 0 16 16", "M9.875 3H3V0H13V3.3L7.88462 15.5769L5.11538 14.4231L9.875 3Z");
const NUMBERS = [createOne, createTwo, createThree, createFour, createFive, createSix, createSeven];

await createComponent("bid-tile", template =>
  class BidTile extends HTMLElement {
    #container;
    #border;
    #doublePart;
    #redoublePart;
    #passPart;
    #numberSuitHolder;
    #numberPart;
    #suitPart;
    #alertPart;

    #tileInfo;
    #onClick;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#container = dom.querySelector(".container");
      this.#border = dom.querySelector(".border");
      this.#doublePart = dom.querySelector(".double");
      this.#redoublePart = dom.querySelector(".redouble");
      this.#passPart = dom.querySelector(".pass");
      this.#numberSuitHolder = dom.querySelector(".number-suit-holder");
      this.#numberPart = dom.querySelector(".number-part");
      this.#suitPart = dom.querySelector(".suit-part");
      this.#alertPart = dom.querySelector(".alert-box");
      this.isAlert = false;
    }

    static fromTileInfo(tileInfo) {
      const tile = document.createElement("bid-tile");
      tile.info = tileInfo;
      return tile;
    }

    set info(tileInfo) {
      this.#tileInfo = tileInfo;

      this.#doublePart.toggleAttribute("disabled", !tileInfo.isDouble);
      this.#redoublePart.toggleAttribute("disabled", !tileInfo.isRedouble);
      this.#passPart.toggleAttribute("disabled", !tileInfo.isPass);
      this.#numberSuitHolder.toggleAttribute("disabled", !tileInfo.isNumberSuit);

      if (tileInfo.isNumberSuit) {
        this.#numberPart.style.setProperty("--number-part-active-background-color", tileInfo.suit.numberColor);
        this.#suitPart.style.setProperty("--suit-part-active-background-color", tileInfo.suit.suitColor);

        [...this.#numberPart.children].forEach(child => this.#numberPart.removeChild(child));
        this.#numberPart.appendChild(NUMBERS[tileInfo.number - 1]());
        [...this.#suitPart.children].forEach(child => this.#suitPart.removeChild(child));
        this.#suitPart.appendChild(tileInfo.suit.svg());
      }
    }

    get info() {
      return this.#tileInfo;
    }

    set isAlert(isAlert) {
      this.#alertPart.toggleAttribute("hidden", !isAlert);
    }

    get alertPart() {
      return this.#alertPart;
    }

    copy() {
      const clone = document.createElement(this.tagName);
      for (let attribute of this.attributes) {
        clone.setAttribute(attribute.name, attribute.value);
      }
      return clone;
    }

    onClick(callback) {
      this.#onClick = callback;
    }

    enableClick(enable) {
      this.onclick = enable ? this.#onClick : undefined;
    }

    makeAvailable(available) {
      this.#container.toggleAttribute("available", available);
    }

    makeSystemic(systemic) {
      this.#border.toggleAttribute("systemic", systemic);
    }
  }
);

