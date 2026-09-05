const PARSER = new DOMParser();

Object.defineProperty(HTMLElement.prototype, "onmousehold", {
  set(callback) {
    if (callback === null) {
      this.onmousedown = null;
      this.onmouseup = null;
      return;
    }

    let timeoutId;
    this.onmousedown = () => {
      timeoutId = setTimeout(callback, 500);
    };
    this.onmouseup = () => {
      clearTimeout(timeoutId);
    };
  }
});

export default async function createComponent() {
  let name;
  let fileLocation;
  let classCreator;
  if (arguments.length === 2) {
    name = arguments[0];
    fileLocation = `./components/${name}`;
    classCreator = arguments[1];
  } else if (arguments.length === 3) {
    name = arguments[1];
    fileLocation = `./components/${arguments[0]}/${name}`;
    classCreator = arguments[2];
  }
  
  const file = await fetch(`${fileLocation}.html`);
  const html = await file.text();
  const template = PARSER.parseFromString(html, "text/html").querySelector("template").content;
  const stylesheet = document.createElement("link");
  stylesheet.setAttribute("rel", "stylesheet");
  stylesheet.setAttribute("href", `${fileLocation}.css`);
  template.prepend(stylesheet);
  const componentClass = classCreator(template);
  customElements.define(name, componentClass);
}
