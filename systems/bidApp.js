class BidApp extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("class", "container");
    dom.appendChild(container);

    const bidBoard = document.createElement("bid-board");
    bidBoard.setAttribute("tile-size", "100");
    container.appendChild(bidBoard);

    
  }
}

customElements.define("bid-app", BidApp);
