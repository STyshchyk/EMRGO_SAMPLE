import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router-dom";

import {
  MinorNavbarListItem,
  MinorNavbarListItemLink,
  MinorNavbar as SharedMinorNavbar,
} from "@emrgo-frontend/shared-ui";
import { Box } from "@mui/material";
import cx from "classnames";
import PropTypes from "prop-types";

const MinorNavbar = ({ routes }) => {
  const { t } = useTranslation();
  const enabledRouteConfigs = routes
    .filter((item) => !item?.disabled)
    .map((route) => {
      const isActive = useMatch(route.link);
      return {
        ...route,
        isActive,
      };
    });
  
  return (
    <SharedMinorNavbar>
      {enabledRouteConfigs.map((routeConfig) => (
        // <Pill route={routeConfig} key={routeConfig.link} />
        <MinorNavbarListItem key={routeConfig.path}>
          <Link to={routeConfig.link}>
            <MinorNavbarListItemLink className={routeConfig.isActive ? "active" : ""}>
              {t(`${routeConfig.text}`)}
            </MinorNavbarListItemLink>
          </Link>
        </MinorNavbarListItem>
      ))}
    </SharedMinorNavbar>
  );
};

MinorNavbar.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      link: PropTypes.string,
      text: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

export default MinorNavbar;
