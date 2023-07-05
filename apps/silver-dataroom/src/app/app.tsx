import { RouterProvider } from "react-router-dom";

import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import styled, { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";




export function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <UserProvider>
        {/*<RouterProvider router={[{}]} />*/}
      </UserProvider>
      <ToastProvider />
    </ThemeProvider>
  );
}

export default App;
