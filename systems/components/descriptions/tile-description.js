import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";
import TileInfo from "../tileInfo.js";
import Suit from "../suit.js";

await createComponent("tile-description", template =>
  class TileDescription extends HTMLElement {
    #tile;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#tile = dom.querySelector("bid-tile");
    }

    set description(description) {
      const tileInfo = new TileInfo(
        description.number ?? null,
        Suit[description.suit] ?? null,
        description.double ?? false,
        description.redouble ?? false,
        description.pass ?? false
      );
      this.#tile.info = tileInfo;
      this.#tile.makeAvailable(true);
    }
  }
);
