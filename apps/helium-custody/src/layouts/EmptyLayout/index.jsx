import PropTypes from "prop-types";

import style from "./style.module.scss";

const EmptyLayout = ({ children }) => (
  <div className={style.container}>
    <div className={style["content-area"]}>{children}</div>
  </div>
);

EmptyLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default EmptyLayout;
