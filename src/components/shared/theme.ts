import { DefaultTheme } from "styled-components";

export const themeStyles: DefaultTheme = {
  defaultBackground: "#007379",

  // 1px equal 2pixels
  windowPixelatedBorder: `-2px -2px black inset, 
                           2px 2px #dbdbdb inset,
                          -4px -4px #808080 inset, 
                           4px 4px #fff inset,
                           0 0 0 4px #bfbfbf inset;`,
  // windowTopBarBackgroundPrimary: "linear-gradient(to right, #08216b 0%, #a5cef7 100%)",
  // windowTopBarBackgroundSecondary: "linear-gradient(to right, #808080 0%, #C0C0C0 100%)",
  
  windowTopBarBackgroundPrimary: "linear-gradient(to right, rgb(0,0,128) 0%, rgb(16, 132, 208) 100%)",
  windowTopBarBackgroundSecondary: "#85898D",


  // windowTopBarBackgroundPrimary: "#0000AA",
  // windowTopBarBackgroundSecondary: "#85898D",

  elementDefaultBackground: "#C2C6CA",

  buttonPixelatedBorder: `-1px -1px black inset, 
                          -1px -1px #808080 inset, 
                           1px 1px #fff inset,
                           0 0 0 2px #bfbfbf inset`,

  insetPixelatedBorder: `-1px -1px #fff inset, 
                         -1px -1px #808080 inset, 
                          1px 1px #000 inset,
                          0 0 0 2px #bfbfbf inset`,
};
