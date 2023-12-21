import { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
// import { jssPreset, StylesProvider } from "@mui/styles";
// import { create } from "jss";
// import rtl from "jss-rtl";
import PropTypes from "prop-types";

import locales from "../constants/locales/locales";
import themeStyles from "../theme";

const ThemeContext = createContext();
ThemeContext.displayName = "Theme";

// Configure JSS
// const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const CustomThemeProvider = (props) => {
  const { children, isDarkMode } = props;
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const locale = locales.find(({ code }) => code === currentLang);

  const theme = {
    ...themeStyles(isDarkMode),
    direction: locale.rtl ? "rtl" : "ltr",
  };

  const muiTheme = createTheme(theme);

  return (
    <ThemeContext.Provider
      value={{
        theme: {
          locale,
          muiTheme,
        },
      }}
      {...props}
    >
      <div dir={locale.rtl ? "rtl" : "ltr"}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
        </StyledEngineProvider>
      </div>
    </ThemeContext.Provider>
  );
};

CustomThemeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

CustomThemeProvider.defaultProps = {
  children: "",
};

const useTheme = () => useContext(ThemeContext);

export { CustomThemeProvider, useTheme };
