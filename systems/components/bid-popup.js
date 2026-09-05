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

    #bidTile;
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

    #onSave;
  
    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#bidTile = dom.querySelector("bid-tile");
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

        // TODO: there must be a better way...
        this.#bidTile.isAlert = true;
        this.#bidTile.alertPart.toggleAttribute("disabled", !this.#editedBidInfo.isAlert);

        this.#editButton.toggleAttribute("hidden", true);
        this.#revertButton.toggleAttribute("hidden", false);
        this.#saveButton.toggleAttribute("hidden", false);

        this.#cancelButton.toggleAttribute("disabled", true);
        this.#confirmButton.toggleAttribute("disabled", true);

        this.#bidTile.alertPart.oneditgesture = () => {
          this.#editedBidInfo.isAlert = !this.#bidTile.alertPart.toggleAttribute("disabled");
        };

        this.#hcpBox.oneditgesture = () => {
          this.#descriptionEditor.description = this.#editedBidInfo.hcp;
          this.#descriptionEditor.onConfirm = (description) => {
            this.#editedBidInfo.hcp = description;
            this.#updateInfobox(this.#editedBidInfo);
            this.#descriptionEditor.toggleAttribute("hidden", true);
          };
          this.#descriptionEditor.toggleAttribute("hidden", false);
        };

        this.#descriptionBox.oneditgesture = () => {
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
            card.oneditgesture = () => {
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
        if (this.#systemManager.saveEdit(this.#editedBidInfo)) {
          this.revertToDefault();
          this.#bidInfo = this.#editedBidInfo.clone();
          this.#onSave?.();
        }
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

      const isAlertDisabled = this.#bidTile.alertPart.hasAttribute("disabled");
      this.#bidTile.alertPart.toggleAttribute("disabled", false);
      this.#bidTile.isAlert = !isAlertDisabled;
      this.#bidTile.alertPart.oneditgesture = null;

      this.#cancelButton.toggleAttribute("disabled", false);
      this.#confirmButton.toggleAttribute("disabled", false);

      this.#hcpBox.oneditgesture = null;
      this.#descriptionBox.oneditgesture = null;
      this.#clubCard.oneditgesture = null;
      this.#diamondCard.oneditgesture = null;
      this.#heartCard.oneditgesture = null;
      this.#spadeCard.oneditgesture = null;
    }

    set onCancel(callback) {
      this.#cancelButton.onclick = callback;
    }

    set onConfirm(callback) {
      this.#confirmButton.onclick = callback;
    }

    set onSave(callback) {
      this.#onSave = callback;
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

      this.#bidTile.info = tileInfo;
      this.#bidTile.isAlert = isAlert;
      this.#bidTile.makeSystemic(false);
      this.#bidTile.makeAvailable(true);
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
