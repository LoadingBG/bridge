import { BidInfo } from "./system.js";
import TileInfo from "./tileInfo.js";
import Suit from "./suit.js";
import "./components/bid-tile.js";
import "./components/convention-description.js";
import "./components/number-operation-description.js";
import "./components/tile-description.js";

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
    case "convention": {
      const description = document.createElement("convention-description");
      description.systemManager = systemManager;
      description.enableOnclick(options.onclickEvents);
      description.convention = part;
      return description;
    }
    case "numberOperation": {
      const description = document.createElement("number-operation-description");
      description.description = part;
      return description;
    };
    case "tile": {
      const description = document.createElement("tile-description");
      description.description = part;
      return description;
    }
    case undefined: throw new Error("Cannot parse part without type");
    default:        throw new Error(`Unrecognized type: ${part.type}`);
  }
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
