class BidPopup extends HTMLElement {
  #cancelButton = document.createElement("button");
  #confirmButton = document.createElement("button");
  #systemManager;
  
  constructor() {
    super();
    this.madeBid = undefined;
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

  #toHTML(part) {
    if (typeof(part) === "string") {
      return document.createTextNode(part);
    }

    switch (part.type) {
      case "convention": return this.#conventionToHTML(part);
      case "tile": return this.#tileToHTML(part);
      case undefined: throw new Error("Cannot parse part without type");
      default: throw new Error(`Unrecognized type: ${part.type}`);
    }
  }

  #conventionToHTML(part) {
    const convention = this.#systemManager.conventions[part.convention];
    if (convention === undefined) {
      const span = document.createElement("span");
      span.setAttribute("class", "descriptioned-text error");
      span.textContent = part.text;
      return span;
    }

    const span = document.createElement("span");
    span.setAttribute("class", "descriptioned-text");
    span.textContent = part.text;

    const helperBox = document.createElement("div");
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
      helperBox.style.display = isDescriptionOpen ? "flex" : "none";
    };

    return span;
  }

  #tileToHTML(part) {
    const madeBid = new MadeBid(part.number, Suit[part.suit], part.double, part.redouble, part.pass);
    const tile = BidTile.fromMadeBid(madeBid);
    tile.makeAvailable(true);

    const span = document.createElement("span");
    span.setAttribute("class", "descriptioned-tile");
    span.appendChild(tile);
    return span;
    // const span = document.createElement("span");
    // span.textContent = part.text;

    // const helperBox = document.createElement("div");
    // helperBox.setAttribute("class", "helper-box");

    // const helperTitle = document.createElement("span");
    // helperTitle.setAttribute("class", "helper-title");
    // helperTitle.textContent = convention.title;
    // helperBox.appendChild(helperTitle);

    // helperBox.style.display = "none";
    // convention.description.map(part => this.#toHTML(part)).forEach(elem => helperBox.appendChild(elem));
    // span.appendChild(helperBox);

    // let isDescriptionOpen = false;
    // span.onclick = () => {
    //   isDescriptionOpen = !isDescriptionOpen;
    //   helperBox.style.display = isDescriptionOpen ? "flex" : "none";
    // };

    // return span;
  }

  static #CARD_ROWS = 2;
  static #CARD_SUITS = [Suit.CLUB, Suit.DIAMOND, Suit.HEART, Suit.SPADE];
  static #CARD_COLS = this.#CARD_SUITS.length / this.#CARD_ROWS;
  #createCardInfos() {
    const table = document.createElement("div");
    table.setAttribute("class", "card-table");

    for (let i = 0; i < this.constructor.#CARD_ROWS; i++) {
      const row = document.createElement("div");
      row.setAttribute("class", "card-row");

      for (let j = 0; j < this.constructor.#CARD_COLS; j++) {
        const suit = this.constructor.#CARD_SUITS[this.constructor.#CARD_COLS * i + j];
        const cell = document.createElement("span");
        cell.setAttribute("class", "card-card");

        const descriptionBox = document.createElement("span");
        descriptionBox.setAttribute("class", "card-description");
        descriptionBox.style.backgroundColor = suit.numberColor;
        descriptionBox.textContent = this.madeBid.cards[Suit.nameOf(suit)] ?? this.#systemManager.noCardInformationText;

        const suitBox = document.createElement("span");
        suitBox.setAttribute("class", "card-suit");
        suitBox.style.backgroundColor = suit.suitColor;
        suitBox.appendChild(suit.svg());

        cell.appendChild(descriptionBox);
        cell.appendChild(suitBox);
        row.appendChild(cell);
      }

      table.appendChild(row);
    }

    return table;
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("class", "container");

    const infobox = document.createElement("div");
    infobox.setAttribute("class", "infobox");
    container.appendChild(infobox);

    const tile = BidTile.fromMadeBid(this.madeBid);
    tile.makeSystemic(false);
    tile.makeAvailable(true);
    infobox.appendChild(tile);

    const hcpBox = document.createElement("div");
    [{type: "convention", text: "ТО", convention: "high-card-points"}, `: ${this.madeBid.hcp}`].map(part => this.#toHTML(part)).forEach(elem => hcpBox.appendChild(elem));
    infobox.appendChild(hcpBox);

    const spacer1 = document.createElement("div");
    spacer1.setAttribute("class", "spacer");
    infobox.appendChild(spacer1);

    const descriptionBox = document.createElement("div");
    descriptionBox.setAttribute("class", "description");
    this.madeBid.description.map(part => this.#toHTML(part)).forEach(elem => descriptionBox.appendChild(elem));
    infobox.appendChild(descriptionBox);

    const spacer2 = document.createElement("div");
    spacer2.setAttribute("class", "spacer");
    infobox.appendChild(spacer2);

    infobox.appendChild(this.#createCardInfos());

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

        font-size: 20px;
        
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

      .spacer {
        flex: 1;
      }

      .description {
        white-space: pre;
        text-wrap: auto;
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

      .descriptioned-tile {
        position: relative;
        display: inline-block;
        width: 1em;
        height: 1em;
      }

      .descriptioned-tile number-suit-tile, .descriptioned-tile double-tile .descriptioned-tile redouble-tile, .descriptioned-tile pass-tile {
        position: absolute;
        top: 0;
        display: inline-block;
        width: 1em;
        height: 1em;
      }

      .descriptioned-text.error {
        color: red;
      }

      .helper-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 300px;
        text-wrap: balance;
        text-align: center;
        white-space: break-spaces;
        color: black;

        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: rgba(100, 100, 111) 0px 7px 29px 0px;
        background-color: white;
      }

      .helper-title {
        color: black;
        font-size: 1.5em;
        font-weight: bold;
      }

      .card-table {
        margin: 10px 0;
        width: 100%;
        height: ${10 * this.constructor.#CARD_ROWS}%;

        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .card-row {
        flex: 1;
        display: flex;
        gap: 2px;
      }

      .card-card {
        flex: 1;
        display: block;
        display: flex;
      }

      .card-description {
        flex: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .card-suit {
        aspect-ratio: 1 / 1;
      }

      .card-suit svg {
        fill: #fff;
      }
    `;

    dom.appendChild(style);
    dom.appendChild(container);
  }
}

customElements.define("bid-popup", BidPopup);
