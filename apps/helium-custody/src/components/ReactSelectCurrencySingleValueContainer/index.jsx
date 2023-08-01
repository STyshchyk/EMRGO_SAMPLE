import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const ReactSelectCurrencySingleValueContainer = (props) => {
  const { innerProps, getValue, currency, selectProps } = props;
  const data = getValue()[0];
  return (
    <div {...innerProps} className={style.wrapper}>
      <Box p={1} className={style.selectContainer}>
        <Grid container justifyContent="space-between">
          {data ? (
            <Typography>{data.value}</Typography>
          ) : (
            <Typography style={{ color: "gray" }}>{selectProps.placeholder}</Typography>
          )}
          <Typography color="secondary" variant="subtitle2">
            {currency}
          </Typography>
        </Grid>
      </Box>
    </div>
  );
};

ReactSelectCurrencySingleValueContainer.propTypes = {
  innerProps: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.object,
  }).isRequired,
};

ReactSelectCurrencySingleValueContainer.defaultProps = {};

export default ReactSelectCurrencySingleValueContainer;
