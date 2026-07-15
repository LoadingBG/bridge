import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";
import Suit from "../suit.js";
import "./bid-popup-card-table.js";
import "./bid-tile.js";

await createComponent("bid-popup", template =>
  class BidPopup extends HTMLElement {
    static observedAttributes = ["disabled"];

    #systemManager;

    #container;
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

      this.#container = dom.querySelector(".container");
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
      this.#cardTable.info = bidInfo.cards ?? {};
      this.#setTile(bidInfo.tileInfo, bidInfo.isAlert);
      this.#setHCPBox(bidInfo.hcp);
      this.#setDescription(bidInfo.description);
    }

    #setTile(tileInfo, isAlert) {
      isAlert = isAlert ?? false;

      const tile = document.createElement("bid-tile");
      tile.info = tileInfo;
      tile.isAlert = isAlert;
      tile.makeSystemic(false);
      tile.makeAvailable(true);
      this.#infobox.removeChild(this.#infobox.firstElementChild);
      this.#infobox.prepend(tile);
    }

    #setHCPBox(hcp) {
      hcp = hcp ?? "-";

      [...this.#hcpBox.childNodes].forEach(child => this.#hcpBox.removeChild(child));
      descriptionToHTML([
        {type: "convention", text: "ТО", convention: "high-card-points"},
        ": ",
        ...hcp,
      ], this.#systemManager)
        .forEach(elem => this.#hcpBox.appendChild(elem));
    }

    #setDescription(description) {
      description = description ?? ["Извънсистемно обявяване."];

      [...this.#descriptionBox.childNodes].forEach(child => this.#descriptionBox.removeChild(child));
      descriptionToHTML(description, this.#systemManager)
        .forEach(elem => this.#descriptionBox.appendChild(elem));
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "disabled" && newValue === null) {
        this.#infobox.style.width = `${this.#container.offsetWidth * 0.8}px`;
      }
    }
  }
);
