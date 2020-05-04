/**
 * Reads a background color and suggests a foreground color,
 * either white or black, based on the W3 suggested spec.
 * You can optionally supply a color to mix with
 * in case of any alpha values in your main color.
 * By default any alpha values are mixed with white.
 *
 * @param {string} color Any valid color in hex, rgb/rgba, hsl/hsla, or named form. Invalid values are treated as white
 * @param {[string]} alphaMixingColor (Optional) the color to mix with in case of any alpha values in color
 * @returns {string} "black" or "white"
 */
export default function setForegroundColor( color, alphaMixingColor = "#ffffff" ) {
  let { red, green, blue, alpha } = computeColor(color);
  const {
    red: backRed,
    green: backGreen,
    blue: backBlue,
  } = computeColor(alphaMixingColor);

  //account for alpha by averaging with white or background color
  red = backRed * (1 - alpha) + alpha * red;
  green = backGreen * (1 - alpha) + alpha * green;
  blue = backBlue * (1 - alpha) + alpha * blue;

  //https://www.w3.org/TR/AERT/#color-contrast
  let brightness = Math.round((red * 299 + green * 587 + blue * 114) / 1000);

  //Will return "black" for invalid input as well
  return brightness < 150 ? "white" : "black";
}

/**
 * Converts any CSS color (hex, rgb/rgba, hsl/hsla, or named)
 * into its RGBA representation.
 *
 * @param {string} color Any valid color in hex, rgb/rgba, hsl/hsla, or named form. Invalid values are treated as white
 * @returns {object} The color in an object, with keys for red, green, blue, and alpha
 */
function computeColor(color) {
  let red,
    green,
    blue,
    alpha = 1;
  color = color.trim();
  //hex colors
  if (color[0] === "#") {
    switch (color.length) {
      case 9: //#rrggbbaa
        red = parseInt("0x" + color.slice(1, 3));
        green = parseInt("0x" + color.slice(3, 5));
        blue = parseInt("0x" + color.slice(5, 7));
        alpha = parseInt("0x" + color.slice(7, 9)) / 255;
        break;

      case 7: //#rrggbb
        red = parseInt("0x" + color.slice(1, 3));
        green = parseInt("0x" + color.slice(3, 5));
        blue = parseInt("0x" + color.slice(5, 7));
        break;

      case 5: //#rgba
        red = parseInt("0x" + color[1]) * 16;
        green = parseInt("0x" + color[2]) * 16;
        blue = parseInt("0x" + color[3]) * 16;
        alpha = parseInt("0x" + color[4]) / 16;
        break;

      case 4: //#rgb
        red = parseInt("0x" + color[1]) * 16;
        green = parseInt("0x" + color[2]) * 16;
        blue = parseInt("0x" + color[3]) * 16;
        break;
    }
  }
  //rgb() and rgba() colors
  else if (color.includes("rgb")) {
    const components = color.split(",");
    red = components[0]?.replace(/\w+\(/, "");
    green = components[1];
    blue = components[2]?.replace(/\)/, "");
    alpha = components[3]?.replace(/\)/, "") ?? 1;
  }
  //hsl() and hsla() colors
  else if (color.includes("hsl")) {
    const components = color.split(",");
    const hue = parseInt(components[0]?.replace(/\w+\(/, "")) / 100;
    const saturation = parseInt(components[1]) / 100;
    const lightness = parseInt(components[2]?.replace(/\)/, "")) / 100;
    alpha = components[3]?.replace(/\)/, "") ?? 1;
    [red, green, blue] = hslToRgb(hue, saturation, lightness);
  }
  //named CSS colors
  else {
    [red, green, blue, alpha] = colorToRGBA(color);
    //colorToRGBA returns black for invalid colors
    //we want white for invalid colors rather than black
    if (red == green == blue == 0 && color.toLowerCase() !== "black") {
      red = green = blue = 255;
    }
  }

  return { red, green, blue, alpha };
}

//https://gist.github.com/mjackson/5311256

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

//https://gist.github.com/njvack/02ad8efcb0d552b0230d
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

function byteToHex(num) {
  // Turns a number (0-255) into a 2-character hex number (00-ff)
  return ("0" + num.toString(16)).slice(-2);
}

function colorToHex(color) {
  // Convert any CSS color to a hex representation
  // Examples:
  // colorToHex('red')            # '#ff0000'
  // colorToHex('rgb(255, 0, 0)') # '#ff0000'
  var rgba, hex;
  rgba = colorToRGBA(color);
  hex = [0, 1, 2]
    .map(function (idx) {
      return byteToHex(rgba[idx]);
    })
    .join("");
  return "#" + hex;
}
