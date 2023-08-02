import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NoSsr from "@mui/material/NoSsr";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useDeepCompareEffect from "use-deep-compare-effect";

import locales from "../../constants/locales/locales";

const getLocaleOption = (languageCode) => locales.find(({ code }) => code === languageCode);

const LanguageSelector = () => {
  const { i18n } = useTranslation(["auth"]);
  const userLanguage = i18n.language;
  const userLocaleOption = getLocaleOption(userLanguage);

  const [languageMenu, setLanguageMenu] = useState(null);
  const [currentLocaleOptionState, setCurrentLocaleOptionState] = useState(userLocaleOption);

  useDeepCompareEffect(() => {
    if (currentLocaleOptionState) {
      i18n.changeLanguage(currentLocaleOptionState.code);
      document.body.setAttribute("dir", currentLocaleOptionState.rtl ? "rtl" : "ltr");
    }
  }, [i18n, currentLocaleOptionState]);

  const handleLanguageIconClick = (event) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageMenuClose = (event) => {
    if (event.currentTarget.nodeName === "A") {
      const selectedLocaleOption = getLocaleOption(event.currentTarget.lang);
      setCurrentLocaleOptionState(selectedLocaleOption);
    }

    setLanguageMenu(null);
  };

  return (
    <Fragment>
      <Tooltip title={userLocaleOption.name} enterDelay={300}>
        <Button color="inherit" onClick={handleLanguageIconClick} data-testid="locale-button">
          <Typography variant="body2" style={{ fontWeight: "bold" }}>
            {userLocaleOption.shortName}
          </Typography>
          <KeyboardArrowDownIcon />
        </Button>
      </Tooltip>
      <NoSsr>
        <Menu
          id="lang-menu"
          anchorEl={languageMenu}
          open={Boolean(languageMenu)}
          onClose={handleLanguageMenuClose}
        >
          {locales.map((language) => (
            <MenuItem
              id={language.shortName}
              key={language.code}
              onClick={handleLanguageMenuClose}
              selected={userLanguage === language.code}
              component="a"
              lang={language.code}
              hrefLang={language.code}
              data-no-link="true"
            >
              <Typography variant="body2">{language.shortName}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </NoSsr>
    </Fragment>
  );
};

export default LanguageSelector;
