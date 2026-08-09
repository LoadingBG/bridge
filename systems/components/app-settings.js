import createComponent from "../createComponent.js";

await createComponent("app-settings", template =>
  class AppSettings extends HTMLElement {
    #sideMenu;
    #saveButton;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#sideMenu = dom.getElementById("side-menu");
      this.#saveButton = dom.querySelector(".save-button");
    }

    set onSideChosen(callback) {
      this.#sideMenu.onchange = () => {
        callback(this.#sideMenu.value);
      };
    }

    disableSideMenu(disable) {
      this.#sideMenu.toggleAttribute("disabled", disable);
    }

    set onSave(callback) {
      this.#saveButton.onclick = callback;
    }
  }
);
