import { createGlobalStyle } from "styled-components";
import CodersCruxWoff from "../../../public/assets/fonts/coders-crux.woff";
import CodersCruxWoff2 from "../../../public/assets/fonts/coders-crux.woff2";
import { themeStyles } from "./theme";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
   user-select: none;
  }
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    line-height:normal;
  }
  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
   }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  @font-face {
  font-family: MSSansSerif;
  src: url("data:application/octet-stream;base64,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");
  font-weight: normal; }

  @font-face {
  font-family: MSSansSerif;
  src: url("data:application/octet-stream;base64,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");
  font-weight: bold; }

  @font-face {
    font-family: 'CodersCrux';
    src: local('CodersCrux'), local('CodersCrux'),
    url(${CodersCruxWoff}) format('woff2'),
    url(${CodersCruxWoff2}) format('woff');
    font-weight: 600;
    font-style: normal;
  }

  html, body, #root { height: 100% }
  body {
    font-family: 'MSSansSerif', 'Segoe UI', 'sans-serif';
    line-height: normal;
    overflow: hidden;

   // -webkit-font-smoothing: antialiased;
    // -moz-osx-font-smoothing: grayscale;
  }

  * {
    font-family: 'MSSansSerif', 'Segoe UI', 'sans-serif';
    font-size: 12px;
    line-height: normal;
    image-rendering: pixelated;
font-smooth: never;
-webkit-font-smoothing: none;
  }

  button:focus {
    outline: 1px dotted #000;
    outline-offset: -4px;
  }

  ::-webkit-scrollbar-button {
    background-color: #c2c6ca;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAJCAYAAABaMo5wAAAAW0lEQVQ4T2NkGGSAcZC5h4FWDvrPwEC02ShqkR0EkkAHuBxMyEKYWYQ8jKEOXQOyo/A5BuZwqqvBZiA+3xMbilQLIWqlcUJRimwPzjRELcdQZA6hREeR4eRoBgBoXhAK6oiMhwAAAABJRU5ErkJggg==');
    image-rendering: pixelated;
    width: 13px;
    height: 13px;
    background-repeat: no-repeat;
    background-size: 36px 9px;
    box-shadow: ${themeStyles.buttonPixelatedBorder};
  }

  ::-webkit-scrollbar-button:vertical:increment {
    background-position: 2px 2px;
  }

  ::-webkit-scrollbar-button:vertical:decrement {
    background-position: -7px 2px;
  }

  ::-webkit-scrollbar-button:horizontal:decrement {
    background-position: -26px 2px;
  }

  ::-webkit-scrollbar-button:horizontal:increment {
    background-position: -16px 2px;
  }

  ::-webkit-scrollbar, ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-button {
    width: ${themeStyles.scrollbarSize};
    height: ${themeStyles.scrollbarSize};
  }

  ::-webkit-scrollbar{
    background: url('${themeStyles.checkerBackground}');
    color: red;
  }


  ::-webkit-scrollbar-thumb {
    background: ${themeStyles.elementDefaultBackground};
    box-shadow: ${themeStyles.buttonPixelatedBorder};
  }

 [contenteditable]:focus {
    outline: 0px solid transparent;
  }
`;

export default GlobalStyles;
