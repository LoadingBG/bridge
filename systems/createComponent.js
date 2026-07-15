const PARSER = new DOMParser();

export default async function createComponent(name, classCreator) {
  const file = await fetch(`./components/${name}.html`);
  const html = await file.text();
  const template = PARSER.parseFromString(html, "text/html").querySelector("template").content;
  const stylesheet = document.createElement("link");
  stylesheet.setAttribute("rel", "stylesheet");
  stylesheet.setAttribute("href", `./components/${name}.css`);
  template.prepend(stylesheet);
  const componentClass = classCreator(template);
  customElements.define(name, componentClass);
}
