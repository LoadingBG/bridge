import fmi from "./fmi.json" with { type: "json" };

class BidApp extends HTMLElement {
  #bidHistoryTable;
  #bidBoard;
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
      this.#bidHistoryTable.selectSide(this.systemManager.currentChooser);
    };
    this.#container.appendChild(popup);
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    this.#container = document.createElement("div");
    this.#container.setAttribute("class", "container");
    dom.appendChild(this.#container);

    const settingsBar = document.createElement("app-settings");
    this.#container.appendChild(settingsBar);
    settingsBar.onSideChosen = (side) => {
      side = Side[side];
      this.systemManager.currentChooser = side;
      this.#bidHistoryTable.selectSide(side);
    };

    this.#bidBoard = document.createElement("bid-board");
    this.#bidBoard.setAttribute("tile-size", "100");
    this.#bidBoard.systemManager = this.systemManager;
    this.#bidBoard.onChosen = (madeBid) => {
      this.#bidHistoryTable.appendTile(madeBid, this.systemManager.currentChooser);
      settingsBar.disableSideMenu(true);
    };
    this.#bidBoard.onBiddingEnd = () => {
      this.#bidHistoryTable.selectSide(undefined);
      this.#bidHistoryTable.disableSideSelection(true);
    };
    this.#bidBoard.visualizePopup = (tile, onConfirm) => this.#visualizePopup(tile, onConfirm);
    this.#container.appendChild(this.#bidBoard);

    const spacer = document.createElement("span");
    spacer.setAttribute("class", "spacer");
    this.#container.appendChild(spacer);

    this.#bidHistoryTable = document.createElement("bid-history-table");
    this.#bidHistoryTable.visualizePopup = (tile, onConfirm) => this.#visualizePopup(tile, onConfirm);
    this.#container.appendChild(this.#bidHistoryTable);
    this.#bidHistoryTable.selectSide(this.systemManager.currentChooser);

    const style = document.createElement("style");
    style.textContent = `
      .container {
        position: relative;
      }

      .spacer {
        display: block;
        height: 100px;
      }

      bid-history-table {
        display: block;
        width: ${this.#bidBoard.offsetWidth}px;
      }

      bid-popup {
        position: absolute;
        top: 0;
        width: ${this.#bidBoard.offsetWidth}px;
        height: 100%;
      }

      app-settings {
        width: ${this.#bidBoard.offsetWidth}px;
      }
    `;
    dom.appendChild(style);
  }
}

customElements.define("bid-app", BidApp);
