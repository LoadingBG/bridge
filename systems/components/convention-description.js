import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";

await createComponent("convention-description", template =>
  class ConventionDescription extends HTMLElement {
    #systemManager;
    #missingConvention;
    #conventionBox;
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

      this.#missingConvention = dom.getElementById("missing-convention");
      this.#conventionBox = dom.getElementById("convention");
      this.#text = dom.getElementById("text");
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

      if (conventionDescription === undefined) {
        this.#missingConvention.toggleAttribute("hidden", false);
        this.#missingConvention.textContent = convention.text;
        this.#conventionBox.toggleAttribute("hidden", true);
        this.onclick = null;
        return;
      }

      this.#missingConvention.toggleAttribute("hidden", true);
      this.#conventionBox.toggleAttribute("hidden", false);
      this.#text.textContent = convention.text;
      this.#helperTitle.textContent = conventionDescription.title;
      this.#description.childNodes.forEach(child => this.#description.removeChild(child));
      descriptionToHTML(conventionDescription.description)
        .forEach(child => this.#description.appendChild(child));

      this.#helperBox.toggleAttribute("hidden", true);
      if (this.#enableOnclick) {
        let hidden = true;
        this.onclick = () => {
          hidden = !hidden;
          this.#helperBox.toggleAttribute("hidden", hidden);
        };
      }
    }
  }
);
