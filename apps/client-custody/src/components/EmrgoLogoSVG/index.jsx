/* eslint-disable max-len */

import { Link } from "react-router-dom";

import cx from "classnames";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const EmrgoLogoSVG = ({ light, hideLogo, path = "/", full }) => (
  <div
    className={cx(full ? style["logo--full"] : style.logo, { [style["logo--hidden"]]: hideLogo })}
    data-testid="logo"
  >
    <Link to={path}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        className={cx(light ? style["emrgo-logo-svg-light"] : style["emrgo-logo-svg-dark"])}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M64.4026 357.58V154.384H196.642V185.24H101.235V240.405H189.792V271.261H101.235V326.723H197.436V357.58H64.4026Z" />
        <path d="M234.219 154.384H279.292L339.654 301.622H342.036L402.398 154.384H447.471V357.58H412.127V217.982H410.241L354.049 356.985H327.641L271.449 217.684H269.563V357.58H234.219V154.384Z" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M28.0021 118H122.023V136.19H46.2033L46.2012 211.981H28L28.0021 118Z"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M483.998 118H389.977V136.19H465.797L465.799 211.981H484L483.998 118Z"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M28 393.995L28 300.016L46.2012 300.016L46.2012 375.805L122.023 375.807L122.023 393.997L28 393.995Z"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M484 393.995L484 300.016L465.799 300.016L465.799 375.805L389.977 375.807L389.977 393.997L484 393.995Z"
        />
      </svg>
    </Link>
  </div>
);

EmrgoLogoSVG.propTypes = {
  full: PropTypes.bool,
  hideLogo: PropTypes.bool,
  light: PropTypes.bool,
  path: PropTypes.string,
};

EmrgoLogoSVG.defaultProps = {
  full: false,
  hideLogo: false,
  light: false,
  path: "/",
};

export default EmrgoLogoSVG;
