import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";

import appConfig from "../../appConfig";
import routes from "../../constants/routes";
import { selectIsUserAuthenticated } from "../../redux/selectors/auth";
import EmrgoLogoSVG from "../EmrgoLogoSVG";
import LanguageSelector from "../LanguageSelector";

const Header = () => {
  const { t } = useTranslation();
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated);

  return (
    <Fragment>
      <AppBar elevation={0}>
        <Toolbar>
          <Grid item container justifyContent="flex-start" alignItems="center">
            <Grid item>
              <EmrgoLogoSVG />
            </Grid>
          </Grid>
          <Grid item container alignItems="center" justifyContent="flex-end">
            {!isUserAuthenticated && (
              <NavLink
                activeClassName="nav-link nav-link--selected"
                to={routes.public.login}
                className="nav-link nav-link--primary"
                data-testid="login-link"
              >
                {t("Public Layout.Header.Log In")}
              </NavLink>
            )}
            <NavLink
              activeClassName="nav-link nav-link--selected"
              to={routes.dashboard.home}
              className="nav-link nav-link--primary"
              data-testid="dashboard-link"
            >
              {t("Public Layout.Header.Dashboard")}
            </NavLink>
            {appConfig.appRegion === "SA" && <LanguageSelector />}
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Fragment>
  );
};

export default Header;
