import PropTypes from "prop-types";

const EmptyLayoutSecure = ({ children }) => <div>{children}</div>;

EmptyLayoutSecure.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default EmptyLayoutSecure;
