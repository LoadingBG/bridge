class BidPopup extends HTMLElement {
  #cancelButton = document.createElement("button");
  #confirmButton = document.createElement("button");
  #conventions;
  
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

  set conventions(conventions) {
    this.#conventions = conventions;
  }

  #toHTML(part) {
    if (typeof(part) === "string") {
      return document.createTextNode(part);
    }

    const convention = this.#conventions[part.link];

    const span = document.createElement("span");
    span.setAttribute("class", "descriptioned-text");
    span.textContent = part.text;

    const helperBox = document.createElement("span");
    helperBox.setAttribute("class", "helper-box");

    const helperTitle = document.createElement("span");
    helperTitle.setAttribute("class", "helper-title");
    helperTitle.textContent = convention.title;
    helperBox.appendChild(helperTitle);

    helperBox.style.display = "none";
    convention.description.map(part => this.#toHTML(part)).forEach(elem => helperBox.appendChild(elem));
    span.appendChild(helperBox);

    let isDescriptionOpen = false;
    span.onclick = () => {
      isDescriptionOpen = !isDescriptionOpen;
      console.log(`in: ${isDescriptionOpen}`);
      helperBox.style.display = isDescriptionOpen ? "flex" : "none";
    };

    return span;
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
    this.description.map(part => this.#toHTML(part)).forEach(elem => descriptionBox.appendChild(elem));
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
        height: 60%;
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
        white-space: pre;
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

      .descriptioned-text {
        color: blue;
        text-decoration: underline;
        position: relative;
      }

      .helper-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 300px;
        text-wrap: balance;
        text-align: center;
        color: black;

        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        background-color: white;
      }

      .helper-title {
        color: black;
        font-size: 20px;
        font-weight: bold;
      }
    `;

    dom.appendChild(style);
    dom.appendChild(container);
  }
}

customElements.define("bid-popup", BidPopup);
