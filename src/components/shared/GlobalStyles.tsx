import { createGlobalStyle } from "styled-components";
import CodersCruxWoff from "../../../public/assets/fonts/coders-crux.woff";
import CodersCruxWoff2 from "../../../public/assets/fonts/coders-crux.woff2";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
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
    font-family: 'CodersCrux';
    src: local('CodersCrux'), local('CodersCrux'),
    url(${CodersCruxWoff}) format('woff2'),
    url(${CodersCruxWoff2}) format('woff');
    font-weight: 600;
    font-style: normal;
  }

  html, body, #root { height: 100% }
  body {
    font-family: 'MS Sans Serif', 'Segoe UI', 'sans-serif';
    line-height: 1;
    overflow: hidden;
  }

  * {
    font-family: 'MS Sans Serif', 'Segoe UI', 'sans-serif';
    font-size: 12px;
  }

  button:focus {
    outline: 1px dotted #000;
    outline-offset: -4px;
  }
`;

export default GlobalStyles;
