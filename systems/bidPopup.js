class BidPopup extends HTMLElement {
  #cancelButton = document.createElement("button");
  #confirmButton = document.createElement("button");
  
  constructor() {
    super();
    this.tile = undefined;
    this.hcp = undefined;
    this.description = undefined;
  }

  set onCancel(callback) {
    this.#cancelButton.onclick = callback;
  }

  set onConfirm(callback) {
    this.#confirmButton.onclick = callback;
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("class", "container");

    const infobox = document.createElement("div");
    infobox.setAttribute("class", "infobox");
    container.appendChild(infobox);

    this.tile.makeSystemic(false);
    this.tile.makeAvailable(true);
    infobox.appendChild(this.tile);

    const hcpBox = document.createElement("div");
    hcpBox.textContent = `ТО: ${this.hcp}`;
    infobox.appendChild(hcpBox);

    const descriptionBox = document.createElement("div");
    descriptionBox.setAttribute("class", "description");
    descriptionBox.textContent = this.description;
    infobox.appendChild(descriptionBox);

    const buttonRow = document.createElement("div");
    buttonRow.setAttribute("class", "button-row");
    infobox.appendChild(buttonRow);

    this.#cancelButton.setAttribute("class", "button");
    this.#cancelButton.textContent = "Отказ";
    buttonRow.appendChild(this.#cancelButton);

    this.#confirmButton.setAttribute("class", "button");
    this.#confirmButton.textContent = "Потвърждаване";
    buttonRow.appendChild(this.#confirmButton);

    const style = document.createElement("style");
    style.textContent = `
      .container {
        width: 100%;
        height: 100%;

        position: relative;
        background-color: rgba(0, 0, 0, 0.6);

        display: flex;
        align-items: center;
        justify-content: center;
      }

      .infobox {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        width: 80%;
        height: 80%;
        background-color: white;

        box-sizing: border-box;
        padding: 2%;
      }

      number-suit-tile, double-tile, redouble-tile, pass-tile {
        display: block;
        width: 20%;
        aspect-ratio: 1 / 1;
      }

      .description {
        flex: 1;
        display: flex;
        align-items: center;
      }

      .button-row {
        width: 100%;
        height: 10%;

        display: flex;
        flex-direction: row;
      }

      .button {
        flex: 1;
      }
    `;

    dom.appendChild(style);
    dom.appendChild(container);
  }
}

customElements.define("bid-popup", BidPopup);
