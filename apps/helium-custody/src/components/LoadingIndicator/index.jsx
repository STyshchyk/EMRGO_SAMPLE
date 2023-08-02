import PropTypes from "prop-types";

import LOADING_SPINNER_SVG from "../../assets/images/loading-spinner.svg";
import style from "./style.module.scss";

const LoadingIndicator = ({ height }) => (
  <div className={style.container} data-testid="loading-indicator">
    <img src={LOADING_SPINNER_SVG} alt="loading-spinner" height={height} />
  </div>
);

LoadingIndicator.propTypes = {
  height: PropTypes.number,
};

export default LoadingIndicator;
