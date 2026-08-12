import createComponent from "../../createComponent.js";
import positionHelperBox from "./helperBoxPositioner.js";
import TileInfo from "../../tileInfo.js";
import Suit from "../../suit.js";

await createComponent("descriptionEditing", "tile-edit-part", template =>
  class TileEditPart extends HTMLElement {
    #systemManager;
    #descriptionPart;
    #onEdit;
    #displayTile;
    #helperBox;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#displayTile = dom.querySelector(".display");
      this.#helperBox = dom.querySelector(".helper-box");

      const tiles = dom.querySelectorAll(".bid-board bid-tile");

      for (let number = 1; number <= 7; number++) {
        for (let suit = 0; suit < Suit.values.length; suit++) {
          tiles[(number - 1) * Suit.values.length + suit].info = TileInfo.numberSuit(number, Suit.values[suit]);
        }
      }
      tiles[7 * Suit.values.length].info = TileInfo.DOUBLE;
      tiles[7 * Suit.values.length + 1].info = TileInfo.REDOUBLE;
      tiles[7 * Suit.values.length + 2].info = TileInfo.PASS;

      tiles.forEach(tile => {
        tile.makeAvailable(true);
        tile.onClick(() => {
          this.#displayTile.info = tile.info;
        });
        tile.enableClick(true);
      });
    }

    set onEdit(callback) {
      this.#onEdit = callback;
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;
    }

    get descriptionPart() {
      return this.#descriptionPart;
    }

    set descriptionPart(descriptionPart) {
      this.#descriptionPart = structuredClone(descriptionPart);
      this.#displayTile.info = new TileInfo(
        descriptionPart.number ?? null,
        Suit[descriptionPart.suit] ?? null,
        descriptionPart.double ?? false,
        descriptionPart.redouble ?? false,
        descriptionPart.pass ?? false
      );
      this.#displayTile.makeAvailable(true);

      let hidden = true;
      this.#helperBox.toggleAttribute("hidden", true);
      this.#displayTile.ondblclick = () => {
        if (this.#onEdit) {
          this.#onEdit(hidden);
        }

        hidden = !hidden;
        this.#helperBox.toggleAttribute("hidden", hidden);
        if (hidden) {
          console.log(this.#displayTile.info);
          const tileInfo = this.#displayTile.info;
          console.log(tileInfo);
          this.#descriptionPart.number = tileInfo.number ?? undefined;
          this.#descriptionPart.suit = Suit.nameOf(tileInfo.suit) ?? undefined;
          this.#descriptionPart.double = tileInfo.isDouble || undefined;
          this.#descriptionPart.redouble = tileInfo.isRedouble || undefined;
          this.#descriptionPart.pass = tileInfo.isPass || undefined;
        } else {
          positionHelperBox(this.#helperBox);
        }
      };
    }
  }
);


