import { Vector2D } from "../types";

export const NOOP = () => {};
export const getIdValue = (str: string) => {
  return str.split("_")[1];
};

export const log = (...args: any[]) => {
  return console.log(...args);
};

export const icon = (
  key: string,
  imgIndex?: number,
  ext = "png",
  imgPath = "/assets/icons/png/",
) => {
  return `${imgPath}${key}-${imgIndex}.${ext}`;
};

export const iconSize = (key: string, size: "small" | "medium" | "big") => {
  return `/assets/images/${size}/${key}.png`;
};

export const extractCssTranslateProperty = (str: string): Vector2D => {
  // idk regex man... maybe not so efficient
  const pos = str.replace(/(translate)|(\()|(\))|(px)| /g, "").split(",");
  return { x: parseInt(pos[0]), y: parseInt(pos[1]) };
};

export function safeJsonParse(json: any) {
  var parsed;

  try {
    parsed = JSON.parse(json);
  } catch (e) {
    // Oh well, but whatever...
  }

  return parsed;
}

// i.e. 0-255 -> '00'-'ff'
export function dec2hex(dec: any) {
  return dec.toString(16).padStart(2, "0");
}

export function generateRandomString(len: number) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}
