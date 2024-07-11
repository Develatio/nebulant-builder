import { memoize } from "lodash-es";
import { RE_RGB_2, RE_RGB_3, RE_RGB_6 } from "./constants";

export const HSLtoString = ({ h, s, l }, a) => {
  if(a) {
    return `hsl(${h}, ${s}%, ${l}%, ${a})`;
  } else {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
}

export const alphaDecToHex = (percent) => {
  // Convert percent to a value between 0 and 1
  const alpha = percent / 100;

  // Calculate the equivalent alpha value in the range of 0 to 255
  const alphaInt = Math.round(alpha * 255);

  // Convert alphaInt to hexadecimal string
  const alphaHex = alphaInt.toString(16).toUpperCase();

  // Pad the hexadecimal value with leading zero if needed
  return alphaHex.padStart(2, "0");
}

export const hexToHSL = memoize((hex) => {
  let result = RE_RGB_6.exec(hex);
  if(!result) {
    // Ok, let's try with a length of 3
    result = RE_RGB_3.exec(hex);
    if(result) {
      result = RE_RGB_6.exec(result[1] + result[1]);
    } else {
      // Ok, let's try with a length of 2
      result = RE_RGB_2.exec(hex);
      if(result) {
        result = RE_RGB_6.exec(result[1] + result[1] + result[1]);
      } else {
        result = ["", "00", "00", "00"];
      }
    }
  }

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  // Normalize r, g, and b values
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the minimum and maximum values
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h = 0, s = 0, l = 0;

  // Calculate the hue
  if(delta === 0) {
    h = 0;
  } else if(r === max) {
    h = ((g - b) / delta) % 6;
  } else if(g === max) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  // Convert the hue to degrees (0-360)
  h = Math.round(h * 60);
  if(h < 0) h += 360;

  // Calculate the lightness
  l = (max + min) / 2;

  // Calculate the saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Convert the saturation and lightness values to percentages (0-100)
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  // Return the HSL values as an object
  return { h, s, l };
});
