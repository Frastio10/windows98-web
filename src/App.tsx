import { FC } from "react";
import { ThemeProvider } from "styled-components";
import { BootLoader } from "./components/BootLoader";
import GlobalStyles from "./components/shared/GlobalStyles";
import { themeStyles } from "./components/shared/theme";

const App: FC = () => {
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  return (
    <>
      <ThemeProvider theme={themeStyles}>
        <GlobalStyles />
        <BootLoader />
      </ThemeProvider>
    </>
  );
};

export default App;
