import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const ReactSelectCurrencyOption = (props) => {
  const { innerProps, isDisabled, data, currency } = props;

  return !isDisabled ? (
    <div {...innerProps}>
      <Box p={1} className={style.selectContainer}>
        <Grid container justifyContent="space-between">
          <Typography className={style.wrapText}>{data.label}</Typography>
          <Typography color="primary" variant="subtitle2">
            {currency || data.value.currency || data.value?.currencyName}
          </Typography>
        </Grid>
      </Box>
    </div>
  ) : null;
};

ReactSelectCurrencyOption.propTypes = {
  innerProps: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.object,
  }).isRequired,
};

ReactSelectCurrencyOption.defaultProps = {};

export default ReactSelectCurrencyOption;
