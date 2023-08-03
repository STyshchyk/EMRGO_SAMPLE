import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const PageTitle = ({ title }) => <Typography variant="h5">{title}</Typography>;

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
