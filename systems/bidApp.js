import fmi from "./fmi.json" with { type: "json" };

class BidApp extends HTMLElement {
  #bidHistoryTable;
  #container;

  constructor() {
    super();

    this.systemManager = new System(fmi.name, fmi.conventions, fmi.nonsystemicBid, fmi.bids);
  }

  #visualizePopup(madeBid, onConfirm) {
    const popup = document.createElement("bid-popup");
    popup.conventions = this.systemManager.conventions;
    popup.tile = BidTile.fromMadeBid(madeBid);
    popup.tile.isAlert = madeBid.isAlert;
    popup.hcp = madeBid.hcp;
    popup.description = madeBid.description;
    popup.onCancel = () => {
      this.#container.removeChild(popup);
    };
    popup.onConfirm = () => {
      this.#container.removeChild(popup);
      onConfirm();
    };
    this.#container.appendChild(popup);
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    this.#container = document.createElement("div");
    this.#container.setAttribute("class", "container");

    const bidBoard = document.createElement("bid-board");
    bidBoard.setAttribute("tile-size", "100");
    bidBoard.systemManager = this.systemManager;
    bidBoard.onChosen = (madeBid) => {
      this.#bidHistoryTable.appendTile(madeBid, this.systemManager.currentChooser);
    };
    bidBoard.visualizePopup = (tile, onConfirm) => this.#visualizePopup(tile, onConfirm);
    this.#container.appendChild(bidBoard);

    const spacer = document.createElement("span");
    spacer.setAttribute("class", "spacer");
    this.#container.appendChild(spacer);

    this.#bidHistoryTable = document.createElement("bid-history-table");
    this.#bidHistoryTable.visualizePopup = (tile, onConfirm) => this.#visualizePopup(tile, onConfirm);
    this.#container.appendChild(this.#bidHistoryTable);

    dom.appendChild(this.#container);
    const style = document.createElement("style");
    style.textContent = `
      .spacer {
        display: block;
        height: 100px;
      }

      bid-history-table {
        display: block;
        width: ${bidBoard.offsetWidth}px;
      }

      bid-popup {
        position: fixed;
        top: 0;
        width: ${bidBoard.offsetWidth}px;
        height: 100vh;
      }
    `;
    dom.appendChild(style);
  }
}

customElements.define("bid-app", BidApp);
