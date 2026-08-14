import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";
import Suit from "../suit.js";
import "./bid-tile.js";
import "./bid-popup-card-card.js";
import "./descriptionEditing/description-editor.js";

await createComponent("bid-popup", template =>
  class BidPopup extends HTMLElement {
    #systemManager;
    #bidInfo;
    #editedBidInfo;

    #container;
    #infobox;
    #hcpBox;
    #descriptionBox;
    #cancelButton;
    #confirmButton;

    #clubCard;
    #diamondCard;
    #heartCard;
    #spadeCard;

    #editButton;
    #revertButton;
    #saveButton;
    #descriptionEditor;
  
    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#container = dom.querySelector(".container");
      this.#infobox = dom.querySelector(".infobox");
      this.#hcpBox = dom.querySelector("#hcp-box");
      this.#descriptionBox = dom.querySelector(".description");
      this.#cancelButton = dom.querySelector("#cancel-button");
      this.#confirmButton = dom.querySelector("#confirm-button");

      this.#editButton = dom.querySelector(".edit-button");
      this.#revertButton = dom.querySelector(".revert-button");
      this.#saveButton = dom.querySelector(".save-button");
      this.#descriptionEditor = dom.querySelector("description-editor");

      this.#editButton.onclick = () => {
        this.#updateInfobox(this.#editedBidInfo);

        this.#editButton.toggleAttribute("hidden", true);
        this.#revertButton.toggleAttribute("hidden", false);
        this.#saveButton.toggleAttribute("hidden", false);

        this.#cancelButton.toggleAttribute("disabled", true);
        this.#confirmButton.toggleAttribute("disabled", true);

        this.#hcpBox.ondblclick = () => {
          this.#descriptionEditor.description = this.#editedBidInfo.hcp;
          this.#descriptionEditor.onConfirm = (description) => {
            this.#editedBidInfo.hcp = description;
            this.#updateInfobox(this.#editedBidInfo);
            this.#descriptionEditor.toggleAttribute("hidden", true);
          };
          this.#descriptionEditor.toggleAttribute("hidden", false);
        };

        this.#descriptionBox.ondblclick = () => {
          this.#descriptionEditor.description = this.#editedBidInfo.description;
          this.#descriptionEditor.onConfirm = (description) => {
            this.#editedBidInfo.description = description;
            this.#updateInfobox(this.#editedBidInfo);
            this.#descriptionEditor.toggleAttribute("hidden", true);
          };
          this.#descriptionEditor.toggleAttribute("hidden", false);
        };

        [[this.#clubCard, Suit.CLUB], [this.#diamondCard, Suit.DIAMOND], [this.#heartCard, Suit.HEART], [this.#spadeCard, Suit.SPADE]]
          .forEach(([card, suit]) => {
            card.ondblclick = () => {
              this.#descriptionEditor.description = this.#editedBidInfo.cards?.[Suit.nameOf(suit)];
              this.#descriptionEditor.onConfirm = (description) => {
                this.#editedBidInfo.cards ??= {};
                this.#editedBidInfo.cards[Suit.nameOf(suit)] = description;
                this.#updateInfobox(this.#editedBidInfo);
                this.#descriptionEditor.toggleAttribute("hidden", true);
              };
              this.#descriptionEditor.toggleAttribute("hidden", false);
            };
          });
      };

      this.#revertButton.onclick = () => {
        this.revertToDefault();
        this.#editedBidInfo = this.#bidInfo.clone();
        this.#updateInfobox(this.#bidInfo);
      };

      this.#saveButton.onclick = () => {
        this.revertToDefault();
        this.#bidInfo = this.#editedBidInfo.clone();
        this.#systemManager.saveEdit(this.#editedBidInfo);
      };

      this.#descriptionEditor.onCancel = () => {
        this.#descriptionEditor.toggleAttribute("hidden", true);
      }

      this.#clubCard = dom.querySelector("#club-card");
      this.#diamondCard = dom.querySelector("#diamond-card");
      this.#heartCard = dom.querySelector("#heart-card");
      this.#spadeCard = dom.querySelector("#spade-card");

      this.#clubCard.suit = Suit.CLUB;
      this.#diamondCard.suit = Suit.DIAMOND;
      this.#heartCard.suit = Suit.HEART;
      this.#spadeCard.suit = Suit.SPADE;
    }

    revertToDefault() {
      this.#editButton.toggleAttribute("hidden", false);
      this.#revertButton.toggleAttribute("hidden", true);
      this.#saveButton.toggleAttribute("hidden", true);
      this.#descriptionEditor.toggleAttribute("hidden", true);

      this.#cancelButton.toggleAttribute("disabled", false);
      this.#confirmButton.toggleAttribute("disabled", false);

      this.#hcpBox.ondblclick = null;
      this.#descriptionBox.ondblclick = null;
      this.#clubCard.ondblclick = null;
      this.#diamondCard.ondblclick = null;
      this.#heartCard.ondblclick = null;
      this.#spadeCard.ondblclick = null;
    }

    set onCancel(callback) {
      this.#cancelButton.onclick = callback;
    }

    set onConfirm(callback) {
      this.#confirmButton.onclick = callback;
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;
      this.#descriptionEditor.systemManager = systemManager;
      this.#clubCard.systemManager = systemManager;
      this.#diamondCard.systemManager = systemManager;
      this.#heartCard.systemManager = systemManager;
      this.#spadeCard.systemManager = systemManager;
    }

    set bidInfo(bidInfo) {
      this.#bidInfo = bidInfo;
      this.#editedBidInfo = bidInfo.clone();
      this.#updateInfobox(bidInfo);
    }

    #updateInfobox(bidInfo) {
      this.#clubCard.description = bidInfo.cards?.[Suit.nameOf(Suit.CLUB)];
      this.#diamondCard.description = bidInfo.cards?.[Suit.nameOf(Suit.DIAMOND)];
      this.#heartCard.description = bidInfo.cards?.[Suit.nameOf(Suit.HEART)];
      this.#spadeCard.description = bidInfo.cards?.[Suit.nameOf(Suit.SPADE)];
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
        {type: "convention", text: "ТО", convention: "highCardPoints"},
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
  }
);
