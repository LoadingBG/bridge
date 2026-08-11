import { BidInfo } from "./system.js";
import TileInfo from "./tileInfo.js";
import Suit from "./suit.js";
import "./components/descriptions/convention-description.js";
import "./components/descriptions/number-operation-description.js";
import "./components/descriptions/tile-description.js";

export default function descriptionToHTML(description, systemManager, options = {}) {
  if (options.onclickEvents === undefined) {
    options.onclickEvents = true;
  }
  return description.map(part => descriptionPartToHTML(part, systemManager, options));
}

function descriptionPartToHTML(part, systemManager, options) {
  if (typeof(part) === "string") {
    return document.createTextNode(part);
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
