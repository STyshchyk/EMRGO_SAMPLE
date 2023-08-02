import PropTypes from "prop-types";

const PageTitle = ({ title }) => <h3>{title}</h3>;

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
