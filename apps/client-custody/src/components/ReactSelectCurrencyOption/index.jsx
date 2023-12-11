import { components } from "react-select";

import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const ReactSelectCurrencyOption = ({ children, ...props }) => {
  // @ts-ignore
  const { innerProps, isDisabled, data, currency } = props;

  return (
    <components.Option {...props}>
      <span>{children}</span>
      <Typography color="primary" variant={"subtitle2"} component={"span"}>
        {currency || data.value.currency || data.value?.currencyName || data.currency}
      </Typography>
    </components.Option>
  );
};

ReactSelectCurrencyOption.propTypes = {
  innerProps: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
};

ReactSelectCurrencyOption.defaultProps = {};

export default ReactSelectCurrencyOption;
