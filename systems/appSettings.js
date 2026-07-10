class AppSettings extends HTMLElement {
  #sideMenu;

  constructor() {
    super();
  }

  set onSideChosen(callback) {
    this.#sideMenu.onchange = () => {
      callback(this.#sideMenu.value);
    };
  }

  disableSideMenu(disable) {
    if (disable) {
      this.#sideMenu.setAttribute("disabled", true);
    } else {
      this.#sideMenu.removeAttribute("disabled");
    }
  }

  connectedCallback() {
    const dom = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("class", "container");
    dom.appendChild(container);

    const sideMenuLabel = document.createElement("span");
    sideMenuLabel.textContent = "Раздаващ:";
    container.appendChild(sideMenuLabel);
    this.#sideMenu = document.createElement("select");
    Side.values.forEach(side => {
      const option = document.createElement("option");
      option.setAttribute("value", Side.nameOf(side));
      option.textContent = side.name;
      this.#sideMenu.appendChild(option);
    });
    container.appendChild(this.#sideMenu);

    const style = document.createElement("style");
    style.textContent = `
      .container {
        display: flex;
      }
    `;
    dom.appendChild(style);
  }
}

customElements.define("app-settings", AppSettings);
