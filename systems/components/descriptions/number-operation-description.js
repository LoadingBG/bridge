import OPERATIONS_LABELS from "./numberOperations.js";
import createComponent from "../../createComponent.js";

await createComponent("descriptions", "number-operation-description", template =>
  class NumberOperationDescription extends HTMLElement {
    #text;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#text = dom.querySelector(".text");
    }

    set description(description) {
      // TODO: other styles
      this.#text.textContent = OPERATIONS_LABELS[description.operation]["word"](description);
    }
  }
);

