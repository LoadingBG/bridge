import fmi from "../fmi.json" with { type: "json" };
import createComponent from "../createComponent.js";
import { System } from "../system.js";
import Side from "../side.js";
import "./app-settings.js";
import "./bid-popup.js";
import "./bid-history-table.js";
import "./bid-board.js";

await createComponent("bid-app", template =>
  class BidApp extends HTMLElement {
    #systemManager = System.fromJSON(fmi);

    #settingsBar;
    #bidBoard;
    #bidHistoryTable;
    #bidPopup;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#settingsBar = dom.querySelector("app-settings");
      this.#bidBoard = dom.querySelector("bid-board");
      this.#bidHistoryTable = dom.querySelector("bid-history-table");
      this.#bidPopup = dom.querySelector("bid-popup");

      this.#settingsBar.onSideChosen = (side) => {
        side = Side[side];
        this.#systemManager.currentChooser = side;
        this.#bidHistoryTable.selectSide(side);
      }

      this.#bidBoard.systemManager = this.#systemManager;
      this.#bidBoard.onChosen = (tileInfo) => {
        this.#bidHistoryTable.appendTile(tileInfo, this.#systemManager.currentChooser);
        this.#settingsBar.disableSideMenu(true);
      };
      this.#bidBoard.onBiddingEnd = () => {
        this.#bidHistoryTable.selectSide(undefined);
        this.#bidHistoryTable.disableSideSelection(true);
      };
      this.#bidBoard.visualizePopup = (tileInfo, onConfirm) => this.#visualizePopup(tileInfo, onConfirm);

      this.#bidHistoryTable.visualizePopup = (tileInfo, onConfirm) => this.#visualizePopup(tileInfo, onConfirm);
      this.#bidHistoryTable.selectSide(this.#systemManager.currentChooser);

      this.#bidPopup.systemManager = this.#systemManager;
      this.#bidPopup.onCancel = () => {
        this.#bidPopup.toggleAttribute("disabled", true);
      };
    }

    #visualizePopup(bidInfo, onConfirm) {
      this.#bidPopup.bidInfo = bidInfo;
      this.#bidPopup.onConfirm = () => {
        this.#bidPopup.toggleAttribute("disabled", true);
        onConfirm();
        this.#bidHistoryTable.selectSide(this.#systemManager.currentChooser);
      };
      this.#bidPopup.toggleAttribute("disabled", false);
    }
  }
);

