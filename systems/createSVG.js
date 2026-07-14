export default function createSVG(viewBox, path) {
	const result = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  result.setAttribute("viewBox", viewBox);
  const pathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElem.setAttribute("d", path);
  pathElem.setAttribute("fill-rule", "evenodd");
  result.appendChild(pathElem);
  return result;
}
