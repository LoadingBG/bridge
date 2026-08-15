import createComponent from "../../createComponent.js";
import descriptionToHTML from "../../descriptionCreator.js";

await createComponent("descriptions", "convention-description", template =>
  class ConventionDescription extends HTMLElement {
    #systemManager;
    #text;
    #helperBox;
    #helperTitle;
    #description;

    #convention;
    #enableOnclick = true;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#text = dom.querySelector(".text");
      this.#helperBox = dom.querySelector(".helper-box");
      this.#helperTitle = dom.querySelector(".helper-title");
      this.#description = dom.getElementById("description");
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;
    }

    enableOnclick(enable) {
      this.#enableOnclick = enable;
      if (this.#convention !== undefined) {
        this.convention = this.#convention; // Rerender
      }
    }

    set convention(convention) {
      this.#convention = convention;
      const conventionDescription = this.#systemManager.conventions[convention.convention];

      this.#text.textContent = convention.text;
      if (conventionDescription === undefined) {
        this.#text.toggleAttribute("error", true);
        this.onclick = null;
      } else {
        this.#text.toggleAttribute("error", false);
        this.#helperTitle.textContent = conventionDescription.title;
        this.#description.childNodes.forEach(child => this.#description.removeChild(child));
        descriptionToHTML(conventionDescription.description, this.#systemManager)
          .forEach(child => this.#description.appendChild(child));

        this.#helperBox.toggleAttribute("hidden", true);
        if (this.#enableOnclick) {
          let hidden = true;
          this.onclick = (event) => {
            event.stopPropagation();
            hidden = !hidden;
            this.#helperBox.toggleAttribute("hidden", hidden);
          };
        }
      }
    }
  }
);
