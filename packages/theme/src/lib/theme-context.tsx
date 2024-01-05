import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDarkMode } from "usehooks-ts";

// import { jssPreset, StylesProvider } from "@mui/styles";
// import { create } from "jss";
// import rtl from "jss-rtl";
import { themeStyles } from "./theme-mui";

declare module "@mui/material/styles" {
  interface ThemeOptions {
    [key: string]: any; //
  }
}

// Configure JSS
// const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export const CustomThemeProvider = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const theme = {
    ...themeStyles(isDarkMode),
  };

  const muiTheme = createTheme(theme);

  return (
    <div>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </div>
  );
};

export const useTheme = () => useContext(ThemeContext);
