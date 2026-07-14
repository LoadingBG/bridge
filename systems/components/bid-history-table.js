import createComponent from "../createComponent.js";
import Side from "../side.js";
import "./bid-tile.js";

await createComponent("bid-history-table", template =>
  class BidHistoryTable extends HTMLElement {
    #columns;
    #sideSelectionDisabled = false;

    constructor() {
      super();

      this.visualizePopup = undefined;

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));
      this.#columns = dom.querySelectorAll(".column");
    }

    disableSideSelection(disable) {
      this.#sideSelectionDisabled = disable;
    }

    selectSide(side) {
      if (this.#sideSelectionDisabled) {
        return;
      }

      this.#columns.forEach(c => c.children[0].setAttribute("class", "label-box"));
      if (side === undefined) {
        return;
      }

      const idx = Side.indexOf(side);
      const highlighted = this.#columns[idx].children[0];
      highlighted.setAttribute("class", "label-box active");
    }

    appendTile(bidInfo, side) {
      const sideIdx = Side.indexOf(side);

      const tile = document.createElement("bid-tile");
      tile.info = bidInfo.tileInfo;
      tile.makeAvailable(true);
      tile.onClick(() => this.visualizePopup(bidInfo, () => {}));
      tile.enableClick(true);

      for (let i = 0; i < sideIdx; i++) {
        while (this.#columns[i].childElementCount <= this.#columns[sideIdx].childElementCount) {
          const emptyTile = document.createElement("div");
          emptyTile.setAttribute("class", "empty-tile");
          this.#columns[i].appendChild(emptyTile);
        }
      }

      this.#columns[sideIdx].appendChild(tile);
    }
  }
);

