export default function setForegroundColor(color) {
  const red = parseInt("0x" + color.slice(1, 3));
  const green = parseInt("0x" + color.slice(3, 5));
  const blue = parseInt("0x" + color.slice(5, 7));

  // http://www.w3.org/TR/AERT#color-contrast
  const brightness = Math.round((red * 299 + green * 587 + blue * 114) / 1000);
  console.log(brightness);
  return brightness > 125 ? "#000000" : "#ffffff";
}
