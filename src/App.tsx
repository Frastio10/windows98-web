import { FC } from "react";
import { ThemeProvider } from "styled-components";
import { Desktop } from "./components/Desktop";
import GlobalStyles from "./components/shared/GlobalStyles";
import { themeStyles } from "./components/shared/theme";

const App: FC = () => {
  return (
    <>
      <ThemeProvider theme={themeStyles}>
        <GlobalStyles />
        <Desktop />
      </ThemeProvider>
    </>
  );
};

export default App;
