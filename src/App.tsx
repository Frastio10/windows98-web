// import 'lzma/src/lzma_worker';

import { FC } from "react";
import { ThemeProvider } from "styled-components";
import { BootLoader } from "./components/BootLoader";
import GlobalStyles from "./components/shared/GlobalStyles";
import { themeStyles } from "./components/shared/theme";

import "./index.css";

const App: FC = () => {
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  return (
    <>
      {/* @ts-ignore */}
      <ThemeProvider theme={themeStyles}>
        {/* @ts-ignore */}
        <GlobalStyles />
        <BootLoader />
      </ThemeProvider>
    </>
  );
};

export default App;
