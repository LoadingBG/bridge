import { BidInfo } from "./system.js";
import TileInfo from "./tileInfo.js";
import Suit from "./suit.js";
import "./components/bid-tile.js";

export default function descriptionToHTML(description, systemManager, options = {}) {
  if (options.onclickEvents === undefined) {
    options.onclickEvents = true;
  }
  return description.map(part => descriptionPartToHTML(part, systemManager, options));
}

function descriptionPartToHTML(part, systemManager, options) {
  if (typeof(part) === "string") {
    const span = document.createElement("span");
    span.textContent = part;
    return span;
  }

  switch (part.type) {
    case "convention":      return conventionToHTML(part, systemManager, options);
    case "numberOperation": return numberOperationToHTML(part, options);
    case "tile":            return tileToHTML(part);
    case undefined:         throw new Error("Cannot parse part without type");
    default:                throw new Error(`Unrecognized type: ${part.type}`);
  }
}

function conventionToHTML(part, systemManager, options) {
  const convention = systemManager.conventions[part.convention];
  if (convention === undefined) {
    const span = document.createElement("span");
    span.setAttribute("class", "descriptioned-text error");
    span.textContent = part.text;
    return span;
  }

  const span = document.createElement("span");
  span.setAttribute("class", "descriptioned-text");
  span.textContent = part.text;

  if (!options.onclickEvents) {
    return span;
  }

  const helperBox = document.createElement("div");
  helperBox.setAttribute("class", "helper-box");

  const helperTitle = document.createElement("span");
  helperTitle.setAttribute("class", "helper-title");
  helperTitle.textContent = convention.title;
  helperBox.appendChild(helperTitle);
  
  helperBox.style.display = "none";
  const description = document.createElement("span");
  convention.description.map(part => descriptionPartToHTML(part)).forEach(elem => description.appendChild(elem));
  helperBox.appendChild(description);
  span.appendChild(helperBox);

  let isDescriptionOpen = false;
  span.onclick = () => {
    isDescriptionOpen = !isDescriptionOpen;
    helperBox.style.display = isDescriptionOpen ? "flex" : "none";
  };

  return span;
}

function tileToHTML(part) {
  const tileInfo = new TileInfo(part.number ?? null, Suit[part.suit] ?? null, part.double ?? false, part.redouble ?? false, part.pass ?? false);
  const tile = document.createElement("bid-tile");
  tile.info = tileInfo;
  tile.makeAvailable(true);

  const span = document.createElement("span");
  span.setAttribute("class", "descriptioned-tile");
  span.appendChild(tile);
  return span;
  // const span = document.createElement("span");
  // span.textContent = part.text;

  // const helperBox = document.createElement("div");
  // helperBox.setAttribute("class", "helper-box");

  // const helperTitle = document.createElement("span");
  // helperTitle.setAttribute("class", "helper-title");
  // helperTitle.textContent = convention.title;
  // helperBox.appendChild(helperTitle);

  // helperBox.style.display = "none";
  // convention.description.map(part => this.#toHTML(part)).forEach(elem => helperBox.appendChild(elem));
  // span.appendChild(helperBox);

  // let isDescriptionOpen = false;
  // span.onclick = () => {
  //   isDescriptionOpen = !isDescriptionOpen;
  //   helperBox.style.display = isDescriptionOpen ? "flex" : "none";
  // };

  // return span;
}
 
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
};
function numberOperationToHTML(part, options) {
  const span = document.createElement("span");
  const template = OPERATIONS_LABELS[part.operation][options.numberOperationStyle ?? "word"];

  if (template === undefined) {
    throw new Error(`Unknown number operation: ${part.operation}`);
  }

  span.textContent = template(part);
  return span;
}
