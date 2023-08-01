import PropTypes from "prop-types";

const InfoAlert = ({ text }) => (
  <div
    style={{
      alignItems: "center",
      backgroundColor: "#28ccbf",
      color: "black",
      display: "inline-flex",
      fontWeight: "bold",
      height: "44px",
      justifyContent: "center",
      padding: "0.5rem",
      width: "100%",
      borderRadius: "4px",
    }}
  >
    {text}
  </div>
);

InfoAlert.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InfoAlert;
