import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";
import "./bid-popup-card-table.js";
import Suit from "../suit.js";
import BidTile from "../bidTile.js";

await createComponent("bid-popup", template =>
  class BidPopup extends HTMLElement {
    #systemManager;

    #infobox;
    #hcpBox;
    #descriptionBox;
    #cardTable;
    #cancelButton;
    #confirmButton;
  
    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#infobox = dom.querySelector(".infobox");
      this.#hcpBox = dom.querySelector("#hcp-box");
      this.#descriptionBox = dom.querySelector(".description");
      this.#cardTable = dom.querySelector("bid-popup-card-table");
      this.#cancelButton = dom.querySelector("#cancel-button");
      this.#confirmButton = dom.querySelector("#confirm-button");
    }

    set onCancel(callback) {
      this.#cancelButton.onclick = callback;
    }

    set onConfirm(callback) {
      this.#confirmButton.onclick = callback;
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;
    }

    set bidInfo(bidInfo) {
      this.#cardTable.info = bidInfo.cards;
      this.#setTile(bidInfo.tileInfo);
      this.#setHCPBox(bidInfo.hcp);
      this.#setDescription(bidInfo.description);
    }

    #setTile(tileInfo) {
      const tile = BidTile.fromTileInfo(tileInfo);
      tile.makeSystemic(false);
      tile.makeAvailable(true);
      this.#infobox.removeChild(this.#infobox.firstChild);
      this.#infobox.prepend(tile);
    }

    #setHCPBox(hcp) {
      descriptionToHTML([
        {type: "convention", text: "ТО", convention: "high-card-points"},
        `: ${hcp}`
      ], this.#systemManager)
        .forEach(elem => this.#hcpBox.appendChild(elem));
    }

    #setDescription(description) {
      descriptionToHTML(description, this.#systemManager)
        .forEach(elem => this.#descriptionBox.appendChild(elem));
    }
  }
);


