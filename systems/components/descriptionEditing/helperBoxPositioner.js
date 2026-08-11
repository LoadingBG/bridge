export default function positionHelperBox(helperBox) {  
  helperBox.style.transform = "";
  const boundingBox = helperBox.getBoundingClientRect();
  if (boundingBox.left < 0) {
    helperBox.style.transform = `translateX(calc(-50% - ${boundingBox.left}px + 1vw))`;
  } else if (boundingBox.right > window.innerWidth) {
    helperBox.style.transform = `translateX(calc(-50% - ${boundingBox.right - window.innerWidth}px - 1vw))`;
  }
}
