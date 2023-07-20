import PropTypes from "prop-types";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import style from "./style.module.scss";

const PublicLayout = ({ children }) => (
  <div className={style.container}>
    <div className={style["header-area"]}>
      <Header />
    </div>
    <div className={style["content-area"]}>{children}</div>
    <div className={style["footer-area"]}>
      <Footer />
    </div>
  </div>
);

PublicLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default PublicLayout;
