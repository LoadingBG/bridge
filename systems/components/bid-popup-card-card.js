import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";

const DEFAULT_DESCRIPTION = ["Няма индикация"];

await createComponent("bid-popup-card-card", template =>
  class BidPopupCardCard extends HTMLElement {
    #description;
    #suit;
    #systemManager;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));
      this.#description = dom.querySelector(".card-description");
      this.#suit = dom.querySelector(".card-suit");
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;
    }

    set description(description) {
      [...this.#description.childNodes].forEach(elem => this.#description.removeChild(elem));

      descriptionToHTML(description ?? DEFAULT_DESCRIPTION, this.#systemManager, { numberOperationStyle: "capitalWord" })
        .forEach(elem => this.#description.appendChild(elem));
    }

    set suit(suit) {
      [...this.#suit.childNodes].forEach(elem => this.#suit.removeChild(elem));
      this.#suit.appendChild(suit.svg());

      this.#description.style.backgroundColor = suit.numberColor;
      this.#suit.style.backgroundColor = suit.suitColor;
    }
  }
);
