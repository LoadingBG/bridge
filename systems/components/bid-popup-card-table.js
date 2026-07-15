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

      this.#clubCard.suit = Suit.CLUB;
      this.#diamondCard.suit = Suit.DIAMOND;
      this.#heartCard.suit = Suit.HEART;
      this.#spadeCard.suit = Suit.SPADE;
    }

    set info(info) {
      this.#clubCard.description = info[Suit.nameOf(Suit.CLUB)];
      this.#diamondCard.description = info[Suit.nameOf(Suit.DIAMOND)];
      this.#heartCard.description = info[Suit.nameOf(Suit.HEART)];
      this.#spadeCard.description = info[Suit.nameOf(Suit.SPADE)];
    }
  }
);

