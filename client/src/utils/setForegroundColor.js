/**
 * Reads a background color and suggests a foreground color,
 * either white or black, based on the W3 suggested spec.
 * You can optionally supply a color to mix with
 * in case of any alpha values in your main color.
 * By default any alpha values are mixed with white.
 *
 * @param {string} color Any CSS color (hex, rgb/rgba, hsl/hsla, or named). Invalid values are treated as white
 * @param {[string]} alphaMixingColor (Optional) the color to mix with in case of any alpha values in color
 * @returns {string} "black" or "white"
 */
export default function setForegroundColor( color, alphaMixingColor = "#ffffff" ) {
  color = color.trim();
  let [red, green, blue, alpha] = colorToRGBA(color);
  const [backRed, backGreen, backBlue] = colorToRGBA(alphaMixingColor);

  console.log(red, green, blue, alpha, color);

  //colorToRGB returns black for invalid colors
  //but we want invalid colors to refer to a white background
  //and hence black text
  if (red == green == blue == 0 && color !== "black") {
    return "black";
  }
  //account for alpha by averaging with white or background color
  red = backRed * (1 - alpha) + alpha * red;
  green = backGreen * (1 - alpha) + alpha * green;
  blue = backBlue * (1 - alpha) + alpha * blue;

  //https://www.w3.org/TR/AERT/#color-contrast
  let brightness = Math.round((red * 299 + green * 587 + blue * 114) / 1000);

  //Will return "black" for invalid input
  return brightness < 150 ? "white" : "black";
}



//https://gist.github.com/njvack/02ad8efcb0d552b0230d

/**
 * Converts any CSS color (hex, rgb/rgba, hsl/hsla, or named)
 * into its RGBA representation.
 *
 * @param {string} color Any color in hex, rgb/rgba, hsl/hsla, or named form
 * @returns {Array} The color in RGBA form, ordered [red, green, blue, alpha]
 */
function colorToRGBA(color) {
  // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
  // color must be a valid canvas fillStyle. This will cover most anything
  // you'd want to use.
  // Examples:
  // colorToRGBA('red')  # [255, 0, 0, 255]
  // colorToRGBA('#f00') # [255, 0, 0, 255]
  var cvs, ctx;
  cvs = document.createElement("canvas");
  cvs.height = 1;
  cvs.width = 1;
  ctx = cvs.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  return ctx.getImageData(0, 0, 1, 1).data;
}
