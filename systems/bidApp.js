import fmi from "./fmi.json" with { type: "json" };

class BidApp extends HTMLElement {
  #bidHistoryTable;

  constructor() {
    super();

    this.systemManager = new System(fmi.name, fmi.nonsystemicBid, fmi.bids);
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("class", "container");

    const bidBoard = document.createElement("bid-board");
    bidBoard.setAttribute("tile-size", "100");
    bidBoard.systemManager = this.systemManager;
    bidBoard.onChosen = (madeBid) => {
      this.#bidHistoryTable.appendTile(madeBid, this.systemManager.currentChooser);
    };
    container.appendChild(bidBoard);

    const spacer = document.createElement("span");
    spacer.setAttribute("class", "spacer");
    container.appendChild(spacer);

    this.#bidHistoryTable = document.createElement("bid-history-table");
    container.appendChild(this.#bidHistoryTable);

    dom.appendChild(container);
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
    `;
    dom.appendChild(style);
  }
}

customElements.define("bid-app", BidApp);
