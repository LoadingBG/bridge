import createComponent from "../../createComponent.js";
import descriptionToHTML from "../../descriptionCreator.js";
import "./convention-edit-part.js";
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
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;
    }

    set description(description) {
      [...this.#editbox.childNodes].forEach(child => this.#editbox.removeChild(child));

      description
        .map((part, idx) => this.#createElement(part, idx))
        .forEach(elem => this.#editbox.appendChild(elem));
    }

    set onCancel(callback) {
      this.#cancelButton.onclick = callback;
    }

    set onConfirm(callback) {
      this.#confirmButton.onclick = () => {
        const newDescription = [];
        this.#editbox.childNodes.forEach(child => {
          if (child instanceof Text) {
            newDescription.push(child.textContent);
          } else {
            newDescription.push(child.descriptionPart);
          }
        });
        callback(newDescription);
      };
    }

    #createElement(descriptionInfo, idx) {
      if (typeof(descriptionInfo) === "string") {
        return document.createTextNode(descriptionInfo);
      }

      let element;
      switch (descriptionInfo.type) {
        case "convention": {
          element = document.createElement("convention-edit-part");
        } break;
        case "tile": {
          element = document.createElement("tile-edit-part");
        } break;
        case "numberOperation": {} break;
        default: throw new Error(`Unrecognized type: ${descriptionInfo.type}`);
      }
      element.systemManager = this.#systemManager;
      element.descriptionPart = descriptionInfo;
      element.onEdit = (isEditing) => {
        this.#editbox.toggleAttribute("contenteditable", !isEditing);
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
