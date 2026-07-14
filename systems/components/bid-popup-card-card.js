import createComponent from "../createComponent.js";

await createComponent("bid-popup-card-card", template =>
  class BidPopupCardCard extends HTMLElement {
    #description;
    #suit;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));
      this.#description = dom.querySelector(".card-description");
      this.#suit = dom.querySelector(".card-suit");
    }

    set description(description) {
      if (description !== undefined) {
        this.#description.textContent = description;
      }
    }

    set suit(suit) {
      [...this.#suit.children].forEach(elem => this.#suit.removeChild(elem));
      this.#suit.appendChild(suit.svg());

      this.#description.style.backgroundColor = suit.numberColor;
      this.#suit.style.backgroundColor = suit.suitColor;
    }
  }
);
