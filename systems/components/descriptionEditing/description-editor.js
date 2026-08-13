import createComponent from "../../createComponent.js";
import descriptionToHTML from "../../descriptionCreator.js";
import "./convention-edit-part.js";
import "./number-operation-edit-part.js";
import "./tile-edit-part.js";

await createComponent("descriptionEditing", "description-editor", template =>
  class DescriptionEditor extends HTMLElement {
    #editbox;
    #cancelButton;
    #confirmButton;

    #systemManager;

    #conventionButton;
    #tileButton;
    #numberOperationButton;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#editbox = dom.querySelector(".editbox");
      this.#cancelButton = dom.querySelector("#cancel-button");
      this.#confirmButton = dom.querySelector("#confirm-button");

      this.#conventionButton = dom.getElementById("convention-button");
      this.#tileButton = dom.getElementById("tile-button");
      this.#numberOperationButton = dom.getElementById("number-operation-button");

      this.#conventionButton.onclick = () => {
        this.#editbox.appendChild(this.#createElement({
          type: "convention",
          convention: Object.keys(this.#systemManager.conventions)[0],
          text: "Конвенция",
        }));
      };
      this.#tileButton.onclick = () => {
        this.#editbox.appendChild(this.#createElement({
          type: "tile",
          number: 1,
          suit: "CLUB",
        }));
      };
      this.#numberOperationButton.onclick = () => {
        this.#editbox.appendChild(this.#createElement({
          type: "numberOperation",
          operation: "lessThan",
          number: 0,
        }));
      };
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;
    }

    set description(description) {
      [...this.#editbox.childNodes].forEach(child => this.#editbox.removeChild(child));

      if (description) {
        description
          .flatMap(part => {
            if (typeof(part) === "string") {
              const newElements = [];
              part.split("\n").forEach(elem => {
                newElements.push(elem);
                newElements.push(document.createElement("br"));
              });
              newElements.pop();
              return newElements;
            } else {
              return part;
            }
          })
          .map(part => this.#createElement(part))
          .forEach(elem => this.#editbox.appendChild(elem));
      }
    }

    set onCancel(callback) {
      this.#cancelButton.onclick = callback;
    }

    set onConfirm(callback) {
      this.#confirmButton.onclick = () => {
        const newDescription = [];
        this.#editbox.childNodes.forEach(child => {
          if (child instanceof Text) {
            if (typeof(newDescription.at(-1)) === "string") {
              const lastString = newDescription.pop();
              newDescription.push(lastString + child.textContent);
            } else {
              newDescription.push(child.textContent);
            }
          } else if (child instanceof HTMLBRElement) {
            if (typeof(newDescription.at(-1)) === "string") {
              const lastString = newDescription.pop();
              newDescription.push(lastString + "\n");
            } else {
              newDescription.push("\n");
            }
          } else {
            newDescription.push(child.descriptionPart);
          }
        });

        if (typeof(newDescription.at(-1)) === "string") {
          const lastString = newDescription.pop().trimEnd();
          if (lastString !== "") {
            newDescription.push(lastString);
          }
        }

        console.log(newDescription);

        callback(newDescription.length === 0 ? undefined : newDescription);
      };
    }

    #createElement(descriptionInfo) {
      if (typeof(descriptionInfo) === "string") {
        return document.createTextNode(descriptionInfo);
      }
      if (descriptionInfo instanceof HTMLBRElement) {
        return descriptionInfo;
      }

      let element;
      switch (descriptionInfo.type) {
        case "convention": {
          element = document.createElement("convention-edit-part");
        } break;
        case "tile": {
          element = document.createElement("tile-edit-part");
        } break;
        case "numberOperation": {
          element = document.createElement("number-operation-edit-part");
        } break;
        default: throw new Error(`Unrecognized type: ${descriptionInfo.type}`);
      }
      element.systemManager = this.#systemManager;
      element.descriptionPart = descriptionInfo;
      element.onEdit = (isEditing) => {
        this.#editbox.setAttribute("contenteditable", isEditing ? "false" : "plaintext-only");
        this.#cancelButton.toggleAttribute("disabled", isEditing);
        this.#confirmButton.toggleAttribute("disabled", isEditing);
        this.#conventionButton.toggleAttribute("disabled", isEditing);
        this.#tileButton.toggleAttribute("disabled", isEditing);
        this.#numberOperationButton.toggleAttribute("disabled", isEditing);
      };

      return element;
    }
  }
);
