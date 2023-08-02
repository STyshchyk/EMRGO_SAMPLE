import PropTypes from "prop-types";

import LoadingIndicator from "../LoadingIndicator";

const LoadingPage = ({ disableSidebarOffset = false }) => (
  <div
    style={{
      height: "calc(100vh + 200px)",
      width: disableSidebarOffset ? "100vw" : "calc(100vw - 300px)",
      background: "rgba(255, 255, 255, 0.9)",
      zIndex: "9999",
      position: "fixed",
      marginTop: "-200px",
    }}
  >
    <LoadingIndicator />
  </div>
);

export default LoadingPage;

LoadingPage.propTypes = {
  disableSidebarOffset: PropTypes.bool,
};
