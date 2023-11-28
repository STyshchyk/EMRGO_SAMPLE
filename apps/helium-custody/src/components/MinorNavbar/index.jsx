import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router-dom";

import {
  MinorNavbarListItem,
  MinorNavbarListItemLink,
  MinorNavbar as SharedMinorNavbar,
} from "@emrgo-frontend/shared-ui";
import PropTypes from "prop-types";

export function useHorizontalScroll() {
  const elRef = useRef();
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: "auto",
        });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elRef;
}

const MinorNavbar = ({ routes }) => {
  const { t } = useTranslation();
  const scrollRef = useHorizontalScroll();
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
    <>
      <div>
        <SharedMinorNavbar ref={scrollRef}>
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
      </div>
    </>
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
