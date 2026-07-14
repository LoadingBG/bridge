import { BidInfo } from "./system.js";
import TileInfo from "./tileInfo.js";
import Suit from "./suit.js";
import BidTile from "./bidTile.js";

export default function descriptionToHTML(description, systemManager) {
  return description.map(part => descriptionPartToHTML(part, systemManager));
}

function descriptionPartToHTML(part, systemManager) {
  if (typeof(part) === "string") {
    return document.createTextNode(part);
  }

  switch (part.type) {
    case "convention": return conventionToHTML(part, systemManager);
    case "tile": return tileToHTML(part, systemManager);
    case undefined: throw new Error("Cannot parse part without type");
    default: throw new Error(`Unrecognized type: ${part.type}`);
  }
}

function conventionToHTML(part, systemManager) {
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
  const tileInfo = new TileInfo(part.number, Suit[part.suit], part.double, part.redouble, part.pass);
  const tile = BidTile.fromTileInfo(tileInfo);
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
