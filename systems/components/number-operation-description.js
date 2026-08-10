import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";

const OPERATIONS_LABELS = {
  "lessThan": {
    "word": (part) => `под ${part.number}`,
    "capitalWord": (part) => `Под ${part.number}`,
    "symbol": (part) => `< ${part.number}`,
  },
  "lessThanOrEqual": {
    "word": (part) => `най-много ${part.number}`,
    "capitalWord": (part) => `Най-много ${part.number}`,
    "symbol": (part) => `\u2264 ${part.number}`,
  },
  "moreThan": {
    "word": (part) => `над ${part.number}`,
    "capitalWord": (part) => `Над ${part.number}`,
    "symbol": (part) => `> ${part.number}`,
  },
  "moreThanOrEqual": {
    "word": (part) => `поне ${part.number}`,
    "capitalWord": (part) => `Поне ${part.number}`,
    "symbol": (part) => `\u2265 ${part.number}`,
  },
  "between": {
    "word": (part) => `между ${part.lowerBound} и ${part.upperBound}`,
    "capitalWord": (part) => `Между ${part.lowerBound} и ${part.upperBound}`,
    "symbol": (part) => `${part.lowerBound} \u2013 ${part.upperBound}`,
  }
}

await createComponent("number-operation-description", template =>
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

