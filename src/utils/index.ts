import { Vector2D } from "../types";

export const NOOP = () => {};
export const getIdValue = (str: string) => {
  return str.split("_")[1];
};

export const extractCssTranslateProperty = (str: string): Vector2D => {
  // idk regex man... maybe not so efficient
  const pos = str.replace(/(translate)|(\()|(\))|(px)| /g, "").split(",");
  console.log(pos, str)
  return { x: parseInt(pos[0]), y: parseInt(pos[1]) };
};
