import createComponent from "../createComponent.js";
import "./bid-popup-card-card.js";
import Suit from "../suit.js";

await createComponent("bid-popup-card-table", template =>
  class BidPopupCardTable extends HTMLElement {
    #clubCard;
    #diamondCard;
    #heartCard;
    #spadeCard;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));
      this.#clubCard = dom.querySelector("#club-card");
      this.#diamondCard = dom.querySelector("#diamond-card");
      this.#heartCard = dom.querySelector("#heart-card");
      this.#spadeCard = dom.querySelector("#spade-card");
    }

    set info(info) {
      this.#setupCard(this.#clubCard, Suit.CLUB, info);
      this.#setupCard(this.#diamondCard, Suit.DIAMOND, info);
      this.#setupCard(this.#heartCard, Suit.HEART, info);
      this.#setupCard(this.#spadeCard, Suit.SPADE, info);
    }

    #setupCard(card, suit, info) {
      card.description = info[Suit.nameOf(suit)];
      card.suit = suit;
    }
  }
);

