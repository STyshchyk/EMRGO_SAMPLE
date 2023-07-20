import PropTypes from "prop-types";

import EmrgoLogoSVG from "../../components/EmrgoLogoSVG";
import style from "./style.module.scss";

const AuthFlowLayout = ({ children }) => (
  <div className={style.container}>
    <div className={style["header-area"]}>
      <EmrgoLogoSVG light />
    </div>
    <div className={style["content-area"]}>{children}</div>
  </div>
);

AuthFlowLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AuthFlowLayout;
