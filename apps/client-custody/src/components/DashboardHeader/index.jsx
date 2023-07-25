import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import cx from "classnames";
import PropTypes from "prop-types";

import locales from "../../constants/locales/locales";
import * as authActionCreators from "../../redux/actionCreators/auth";
import * as authSelectors from "../../redux/selectors/auth";
import useIsProduction from "../../utils/useIsProduction";
import EmrgoTextLogoSVG from "../EmrgoTextLogoSVG";
import EntityGroupSelector from "../EntityGroupSelector";
import EntityGroupSelectorExp from "../EntityGroupSelectorExp";
import TickingClock from "../TickingClock";
import style from "./style.module.scss";

const TIME_FORMAT = "dddd, MMMM Do, YYYY | HH:mm";

const getInitials = (name, count = 1) =>
  name
    .replace(/[^A-Za-z0-9À-ÿ ]/gi, "") // taking care of accented characters as well
    .replace(/ +/gi, " ") // replace multiple spaces to one
    .split(/ /) // break the name into parts
    .reduce((acc, item) => acc + item[0], "") // assemble an abbreviation from the parts
    .concat(name.substr(1)) // what if the name consist only one part
    .concat(name) // what if the name is only one character
    .substr(0, count) // get the first two characters an initials
    .toUpperCase();

const DashboardHeader = ({ open, handleDrawerToggle }) => {
  const { t, i18n } = useTranslation(["translation"]);
  const dispatch = useDispatch();
  const inProd = useIsProduction();

  const [accountMenuEl, setAccountMenuEl] = useState(null);
  const currentLang = i18n.language;
  const locale = locales.find(({ code }) => code === currentLang);

  // selectors
  const currentCorporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const userEmail = useSelector(authSelectors.selectUserEmail);
  const userFullName = useSelector(authSelectors.selectUserFullName);

  const drawerToggleIcon = () => {
    let toggleIcon = "";
    if (locale.rtl) {
      toggleIcon = open ? (
        <ChevronRightIcon fontSize="inherit" />
      ) : (
        <ChevronLeftIcon fontSize="inherit" />
      );
    } else {
      toggleIcon = open ? (
        <ChevronLeftIcon fontSize="inherit" />
      ) : (
        <ChevronRightIcon fontSize="inherit" />
      );
    }
    return toggleIcon;
  };

  const handleAccountClick = (event) => {
    setAccountMenuEl(event.currentTarget);
  };

  const handleLogoutClick = (payload) => dispatch(authActionCreators.doLogoutUser(payload));

  const handleAccountClose = () => {
    setAccountMenuEl(null);
  };

  const popperOpen = Boolean(accountMenuEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Fragment>
      <AppBar position="fixed" className={cx(style.appbar)}>
        <Toolbar className={style.toolbar} datatest-id="dashboard-header-menu">
          <Grid container justifyContent="flex-start" alignContent="center">
            <Grid item container justifyContent="center" className={style.logo}>
              <EmrgoTextLogoSVG />
            </Grid>
            <Grid xs={4} item container alignContent="center">
              <IconButton
                aria-label="delete"
                className={style.margin}
                onClick={handleDrawerToggle}
                size="large"
              >
                {drawerToggleIcon()}
              </IconButton>
            </Grid>
          </Grid>

          <Grid item container alignContent="center" justifyContent="flex-end">
            <Typography
              variant="body1"
              display="inline"
              color="textSecondary"
              className={style.clock}
            >
              <TickingClock lang={locale.altLocale} format={TIME_FORMAT} />
            </Typography>

            <ButtonBase onClick={handleAccountClick}>
              <Avatar className={style.user__avatar}>{getInitials(userFullName, 1)}</Avatar>
              <Grid item container direction="column" alignContent="flex-start">
                <Typography variant="body1" align="left" className={style.user__name}>
                  {userFullName}
                </Typography>
                <Typography variant="caption" align="left" className={style.user__role}>
                  {capitalCase(currentCorporateEntityName)} - {currentEntityGroup?.name}
                </Typography>
              </Grid>
            </ButtonBase>
          </Grid>
          {inProd ? <EntityGroupSelector /> : null}
        </Toolbar>
      </AppBar>

      <Popover
        id={id}
        open={popperOpen}
        anchorEl={accountMenuEl}
        onClose={handleAccountClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box pb={3} className={style.menu__wrapper}>
          <div className={style.menu__header}>
            <Typography variant="subtitle2" align="center" className={style.menu__current__group}>
              {locale.rtl
                ? `(${capitalCase(t(`EntityGroupType.${currentEntityType}`))}) ${t(
                    `EntityGroupName.${currentEntityGroup?.name}`
                  )}`
                : `${t(`EntityGroupName.${currentEntityGroup?.name}`)} (${capitalCase(
                    t(`EntityGroupType.${currentEntityType}`)
                  )})`}
            </Typography>
          </div>
          <Box px={2} pt={2}>
            <Grid container justifyContent="center" alignContent="center">
              <Avatar
                className={style.menu__main_avatar}
                alt={currentEntityGroup?.name}
                src="/broken-image.jpg"
              >
                {getInitials(userFullName, 1)}
              </Avatar>
              <Grid item xs={12}>
                <Typography variant="h6" align="center" className={style.menu__current__user}>
                  {userFullName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" align="center" className={style.menu__current__group}>
                  {userEmail}
                </Typography>
              </Grid>

              <Grid item xs={12} container justifyContent="center" spacing={2}>
                <Grid item>
                  <Tooltip title={t("Header.Profile")}>
                    <IconButton
                      aria-label="profile"
                      onClick={handleAccountClose}
                      id="profile-menu-button"
                      size="large"
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={t("Header.Logout")}>
                    <IconButton
                      aria-label="logout"
                      onClick={handleLogoutClick}
                      id="logout-menu-button"
                      data-testid="logout-icon-button"
                      size="large"
                    >
                      <ExitToAppIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Popover>
    </Fragment>
  );
};

DashboardHeader.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default DashboardHeader;
