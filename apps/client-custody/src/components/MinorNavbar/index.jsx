import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router-dom";

import cx from "classnames";
import PropTypes from "prop-types";

import style from "./style.module.scss";

// TODO: Refactor this to use MUI's Tabs/Tab components for better consistency

const Pill = ({ route }) => {
  const { t } = useTranslation();
  const isActive = useMatch(route.path);

  return (
    <div className={style.pillContainer}>
      <div className={style.pillTextWrapper}>
        <Link className={cx(style.pillText, isActive ? style.selected : "")} to={route.link}>
          {t(`${route.text}`)}
        </Link>
      </div>
      <div className={cx(style.pillIndicator, isActive ? style.selectedLine : "")} />
    </div>
  );
};

Pill.propTypes = {
  route: PropTypes.shape({
    path: PropTypes.string,
    link: PropTypes.string,
    text: PropTypes.string,
    disabled: PropTypes.bool,
  }).isRequired,
};

const MinorNavbar = ({ routes }) => {
  const enabledRouteConfigs = routes.filter((item) => !item?.disabled);

  return (
    <div className={style.pillMenuWrapper}>
      <div className={style.pillMenuContainer}>
        {enabledRouteConfigs.map((routeConfig) => (
          <Pill route={routeConfig} key={routeConfig.link} />
        ))}
      </div>
    </div>
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
