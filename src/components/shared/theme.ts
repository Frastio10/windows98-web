import { DefaultTheme } from "styled-components";

export const themeStyles = {
  defaultBackground: "#007379",
  checkerBackground:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAG0lEQVQYV2P8/////4MHDzIwHjhw4L+9vT0DAHAFCj6esq3FAAAAAElFTkSuQmCC",

  // 1px equal 2pixels
  windowPixelatedBorder: `-1px -1px black inset, 
                           1px 1px #dbdbdb inset,
                          -2px -2px #808080 inset, 
                           2px 2px #fff inset,
                           0 0 0 2px #bfbfbf inset;`,
  // windowTopBarBackgroundPrimary: "linear-gradient(to right, #08216b 0%, #a5cef7 100%)",
  // windowTopBarBackgroundSecondary: "linear-gradient(to right, #808080 0%, #C0C0C0 100%)",

  // windowTopBarBackgroundPrimary: "linear-gradient(to right, rgb(0,0,128) 0%, rgb(16, 132, 208) 100%)",
  // windowTopBarBackgroundSecondary: "#85898D",

  windowTopBarBackgroundPrimary: "#0000AA",
  windowTopBarBackgroundSecondary: "#85898D",

  elementDefaultBackground: "#C2C6CA",

  buttonPixelatedBorder: `-1px -1px black inset, 
                          -1px -1px #808080 inset, 
                           1px 1px #fff inset,
                           0 0 0 2px #bfbfbf inset`,

  insetPixelatedBorder: `-1px -1px #fff inset, 
                         -1px -1px #808080 inset, 
                          1px 1px #000 inset,
                          0 0 0 2px #bfbfbf inset`,

  scrollbarButtonInnerSize: 9,
  scrollbarSize: '13px',

  baseBorderThin: '1px solid rgb(128,128,128)',
  baseBorderWhite: '1px solid rgb(255,255,255)',
  baseBorderShadowWhite: '0 1px 0 rgb(255,255,255), 0 1px 0 rgb(255,255,255) inset',
  baseBorderShadowThin: '0 1px 0 rgb(128,128,128), 0 1px 0 rgb(128,128,128) inset',
};
