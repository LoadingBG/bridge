import createComponent from "../../createComponent.js";

await createComponent("descriptionEditing", "convention-edit-part", template =>
  class ConventionEditPart extends HTMLElement {
    #systemManager;
    #descriptionPart;
    #onEdit;
    #text;
    #helperBox;
    #conventionMenu;

    constructor() {
      super();

      const dom = this.attachShadow({ mode: "open" });
      dom.appendChild(document.importNode(template, true));

      this.#text = dom.querySelector(".text");
      this.#helperBox = dom.querySelector(".helper-box");
      this.#conventionMenu = dom.querySelector(".convention-selector");
    }

    set onEdit(callback) {
      this.#onEdit = callback;
    }

    set systemManager(systemManager) {
      this.#systemManager = systemManager;

      this.#conventionMenu.childNodes.forEach(node => this.#conventionMenu.removeChild(node));
      for (const id in this.#systemManager.conventions) {
        const option = document.createElement("option");
        option.setAttribute("value", id);
        option.textContent = this.#systemManager.conventions[id].title;
        this.#conventionMenu.appendChild(option);
      }
    }

    get descriptionPart() {
      return this.#descriptionPart;
    }

    set descriptionPart(descriptionPart) {
      this.#descriptionPart = structuredClone(descriptionPart);
      for (const option of this.#conventionMenu.children) {
        option.toggleAttribute("selected", option.getAttribute("value") === descriptionPart.convention);
      }
      this.#text.textContent = descriptionPart.text;

      let hidden = true;
      this.#helperBox.toggleAttribute("hidden", true);
      this.#text.ondblclick = () => {
        if (this.#onEdit) {
          this.#onEdit(hidden);
        }

        this.#text.toggleAttribute("contenteditable", hidden);
        hidden = !hidden;
        this.#helperBox.toggleAttribute("hidden", hidden);
        if (hidden) {
          // Reassign description part
          this.#descriptionPart.text = this.#text.textContent;
          this.#descriptionPart.convention = this.#conventionMenu.value;
        } else {
          // Move box if out of viewport
          this.#helperBox.style.transform = "";
          const boundingBox = this.#helperBox.getBoundingClientRect();
          if (boundingBox.left < 0) {
            this.#helperBox.style.transform = `translateX(calc(-50% - ${boundingBox.left}px + 1vw))`;
          } else if (boundingBox.right > window.innerWidth) {
            this.#helperBox.style.transform = `translateX(calc(-50% - ${boundingBox.right - window.innerWidth}px - 1vw))`;
          }
        }
      };
    }
  }
);

