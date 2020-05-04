/**
 * Reads a background color and suggests a foreground color,
 * either white or black, based on the W3 suggested spec.
 * @param {string} color The color in hex format (#rrggbb)
 */
export default function setForegroundColor(color) {
  const red = parseInt("0x" + color.slice(1, 3));
  const green = parseInt("0x" + color.slice(3, 5));
  const blue = parseInt("0x" + color.slice(5, 7));

  //https://www.w3.org/TR/AERT/#color-contrast
  const brightness = Math.round((red * 299 + green * 587 + blue * 114) / 1000);
  return brightness < 125 ? "#ffffff" : "#000000";
}
