import createComponent from "../createComponent.js";
import descriptionToHTML from "../descriptionCreator.js";

await createComponent("description-editor", template =>
  class DescriptionEditor extends HTMLElement {
    #editbox;
    #cancelButton;
    #confirmButton;

    #description;
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
      this.#description = [...description];
      this.#updateEditbox();
    }

    set onCancel(callback) {
      this.#cancelButton.onclick = callback;
    }

    set onConfirm(callback) {
      this.#confirmButton.onclick = () => {
        callback(this.#description);
      };
    }

    #updateEditbox() {
      [...this.#editbox.childNodes].forEach(child => this.#editbox.removeChild(child));

      parts
        .map((part, idx) => this.#createElement(part, idx))
        .forEach(elem => this.#editbox.addChild(elem));
    }

    #createElement(descriptionInfo, idx) {
      if (typeof(part) === "string") {
        return document.createTextElement(part);
      }

      let element;
      switch (part.type) {
        case "convention": {} break;
        case "tile": {} break;
        case "numberOperation": {} break;
        default: throw new Error(`Unrecognized type: ${part.type}`);
      }
    }

    #createHelperBox(part, descriptionInfo, idx) {
      part.style.position = "relative";
      const helperBox = document.createElement("div");
      helperBox.setAttribute("class", "helper-box");
      helperBox.toggleAttribute("hidden", true);

      const confirmButton = document.createElement("button");
      confirmButton.setAttribute("class", "helper-button");
      confirmButton.textContent = "Y";
      const cancelButton = document.createElement("button");
      cancelButton.setAttribute("class", "helper-button");
      cancelButton.textContent = "N";

      if (typeof(descriptionInfo) === "string") {
        confirmButton.onclick = () => {
          part.removeAttribute("contenteditable");
          helperBox.toggleAttribute("hidden", true);
          this.#description[idx] = [...part.childNodes]
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent)
            .join("");
          this.#updateEditbox();
        };
        cancelButton.onclick = () => {
          part.removeAttribute("contenteditable");
          helperBox.toggleAttribute("hidden", true);
          this.#updateEditbox();
        };
      } else {
        switch (descriptionInfo.type) {
          case "convention": {
            console.log("in");
            const conventionChooser = document.createElement("select");
            Object.keys(this.#systemManager.conventions).forEach(convention => {
              const option = document.createElement("option");
              option.setAttribute("value", convention);
              option.textContent = this.#systemManager.conventions[convention].title;
              if (descriptionInfo.convention === convention) {
                option.toggleAttribute("selected", true);
              }
              conventionChooser.appendChild(option);
            });

            const table = this.#createTable(["Конвенция:", conventionChooser]);
            helperBox.appendChild(table);

            confirmButton.onclick = () => {
              part.removeAttribute("contenteditable");
              helperBox.toggleAttribute("hidden", true);
              this.#description[idx] = {
                ...descriptionInfo,
                text: [...part.childNodes]
                  .filter(node => node.nodeType === Node.TEXT_NODE)
                  .map(node => node.textContent)
                  .join(""),
                convention: conventionChooser.value
              };
              this.#updateEditbox();
            };

            cancelButton.onclick = () => {
              part.removeAttribute("contenteditable");
              helperBox.toggleAttribute("hidden", true);
              this.#updateEditbox();
            };
          } break;
          case "tile": {
            console.log(descriptionInfo);
            // AAAAAAAAAAA
          } break;
          case "numberOperation": {
            const buttonRow = document.createElement("span");
            // AAAAAAAAAAAAAA
          } break;
          default: throw new Error(`Unrecognized type: ${descriptionInfo.type}`);
        }
      }

      const buttonRow = document.createElement("button-row");
      buttonRow.appendChild(confirmButton);
      buttonRow.appendChild(cancelButton);
      helperBox.appendChild(buttonRow);

      part.onclick = () => helperBox.toggleAttribute("hidden", false);
      part.appendChild(helperBox);
    }

    #createTable(...elements) {
      const table = document.createElement("table");
      for (let [label, field] of elements) {
        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        labelCell.textContent = label;
        row.appendChild(labelCell);

        const fieldCell = document.createElement("td");
        fieldCell.appendChild(field);
        row.appendChild(fieldCell);

        table.appendChild(row);
      }
      return table;
    }
  }
);
