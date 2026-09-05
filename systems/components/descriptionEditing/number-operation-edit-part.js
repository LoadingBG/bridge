import OPERATIONS_LABELS from "../descriptions/numberOperations.js";
import createComponent from "../../createComponent.js";
import positionHelperBox from "./helperBoxPositioner.js";

await createComponent("descriptionEditing", "number-operation-edit-part", template =>
  class NumberOperationEditPart extends HTMLElement {
    #systemManager;
    #descriptionPart;
    #onEdit;

    #text;
    #helperBox;
    #ltButton;
    #leButton;
    #gtButton;
    #geButton;
    #betweenButton;

    #numberLabel;
    #numberField;
    #lowerBoundLabel;
    #lowerBoundField;
    #upperBoundLabel;
    #upperBoundField

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#text = dom.querySelector(".text");
      this.#helperBox = dom.querySelector(".helper-box");
      this.#ltButton = dom.getElementById("lt-button");
      this.#leButton = dom.getElementById("le-button");
      this.#gtButton = dom.getElementById("gt-button");
      this.#geButton = dom.getElementById("ge-button");
      this.#betweenButton = dom.getElementById("between-button");

      this.#numberLabel = dom.getElementById("number-label");
      this.#numberField = dom.getElementById("number-field");
      this.#lowerBoundLabel = dom.getElementById("lower-bound-label");
      this.#lowerBoundField = dom.getElementById("lower-bound-field");
      this.#upperBoundLabel = dom.getElementById("upper-bound-label");
      this.#upperBoundField = dom.getElementById("upper-bound-field");

      this.#ltButton.onchange = () => {
        if (this.#ltButton.checked) {
          this.#updateFields();
          this.#updateText();
        }
      };
      this.#leButton.onchange = () => {
        if (this.#leButton.checked) {
          this.#updateFields();
          this.#updateText();
        }
      };
      this.#gtButton.onchange = () => {
        if (this.#gtButton.checked) {
          this.#updateFields();
          this.#updateText();
        }
      };
      this.#geButton.onchange = () => {
        if (this.#geButton.checked) {
          this.#updateFields();
          this.#updateText();
        }
      };
      this.#betweenButton.onchange = () => {
        if (this.#betweenButton.checked) {
          this.#updateFields();
          this.#updateText();
        }
      };

      this.#numberField.oninput = () => {
        this.#updateText();
      };
      this.#lowerBoundField.oninput = () => {
        this.#updateText();
      };
      this.#upperBoundField.oninput = () => {
        this.#updateText();
      };
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

    #updateText() {
      let operation;
      let part;
      if (this.#ltButton.checked) {
        operation = "lessThan";
        part = {
          number: this.#numberField.value || "_",
        };
      } else if (this.#leButton.checked) {
        operation = "lessThanOrEqual";
        part = {
          number: this.#numberField.value || "_",
        };
      } else if (this.#gtButton.checked) {
        operation = "moreThan";
        part = {
          number: this.#numberField.value || "_",
        };
      } else if (this.#geButton.checked) {
        operation = "moreThanOrEqual";
        part = {
          number: this.#numberField.value || "_",
        };
      } else if (this.#betweenButton.checked) {
        operation = "between";
        part = {
          lowerBound: this.#lowerBoundField.value || "_",
          upperBound: this.#upperBoundField.value || "_",
        };
      } else {
        throw new Exception("Unknown operation");
      }

      this.#text.textContent = OPERATIONS_LABELS[operation]["word"](part);
    }

    #updateFields(descriptionPart) {
      if (this.#ltButton.checked || this.#leButton.checked || this.#gtButton.checked || this.#geButton.checked) {
        this.#numberLabel.toggleAttribute("hidden", false);
        this.#numberField.toggleAttribute("hidden", false);
        this.#lowerBoundLabel.toggleAttribute("hidden", true);
        this.#lowerBoundField.toggleAttribute("hidden", true);
        this.#upperBoundLabel.toggleAttribute("hidden", true);
        this.#upperBoundField.toggleAttribute("hidden", true);
      } else {
        this.#numberLabel.toggleAttribute("hidden", true);
        this.#numberField.toggleAttribute("hidden", true);
        this.#lowerBoundLabel.toggleAttribute("hidden", false);
        this.#lowerBoundField.toggleAttribute("hidden", false);
        this.#upperBoundLabel.toggleAttribute("hidden", false);
        this.#upperBoundField.toggleAttribute("hidden", false);
      }

      this.#numberField.value = descriptionPart?.number?.toString() ?? "";
      this.#lowerBoundField.value = descriptionPart?.lowerBound?.toString() ?? "";
      this.#upperBoundField.value = descriptionPart?.upperBound?.toString() ?? "";
    }

    set descriptionPart(descriptionPart) {
      this.#descriptionPart = structuredClone(descriptionPart);

      this.#ltButton.toggleAttribute("checked", descriptionPart.operation === "lessThan");
      this.#leButton.toggleAttribute("checked", descriptionPart.operation === "lessThanOrEqual");
      this.#gtButton.toggleAttribute("checked", descriptionPart.operation === "moreThan");
      this.#geButton.toggleAttribute("checked", descriptionPart.operation === "moreThanOrEqual");
      this.#betweenButton.toggleAttribute("checked", descriptionPart.operation === "between");

      this.#updateFields(descriptionPart);
      this.#updateText();

      let hidden = true;
      this.#helperBox.toggleAttribute("hidden", true);
      this.#text.onmousehold = () => {
        if (this.#onEdit) {
          this.#onEdit(hidden);
        }

        hidden = !hidden;
        this.#helperBox.toggleAttribute("hidden", hidden);
        if (hidden) {
          if (this.#ltButton.checked) {
            this.#descriptionPart.operation = "lessThan";
            this.#descriptionPart.number = parseInt(this.#numberField.value);
            this.#descriptionPart.lowerBound = undefined;
            this.#descriptionPart.upperBound = undefined;
          } else if (this.#leButton.checked) {
            this.#descriptionPart.operation = "lessThanOrEqual";
            this.#descriptionPart.number = parseInt(this.#numberField.value);
            this.#descriptionPart.lowerBound = undefined;
            this.#descriptionPart.upperBound = undefined;
          } else if (this.#gtButton.checked) {
            this.#descriptionPart.operation = "moreThan";
            this.#descriptionPart.number = parseInt(this.#numberField.value);
            this.#descriptionPart.lowerBound = undefined;
            this.#descriptionPart.upperBound = undefined;
          } else if (this.#geButton.checked) {
            this.#descriptionPart.operation = "moreThanOrEqual";
            this.#descriptionPart.number = parseInt(this.#numberField.value);
            this.#descriptionPart.lowerBound = undefined;
            this.#descriptionPart.upperBound = undefined;
          } else if (this.#betweenButton.checked) {
            this.#descriptionPart.operation = "between";
            this.#descriptionPart.number = undefined;
            this.#descriptionPart.lowerBound = parseInt(this.#lowerBoundField.value);
            this.#descriptionPart.upperBound = parseInt(this.#upperBoundField.value);
          } else {
            throw new Exception("Unknown operation");
          }
        } else {
          positionHelperBox(this.#helperBox);
        }
      };
    }
  }
);



