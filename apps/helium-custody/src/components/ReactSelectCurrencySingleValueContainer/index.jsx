import { components } from "react-select";

import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const ReactSelectCurrencySingleValueContainer = ({ children, ...props }) => {
  const {
    getValue,
    hasValue,
    isMulti,
    currency,
    selectProps: { placeholder, inputValue },
  } = props;
  const numberOfValues = getValue().length;
  console.log(props.getValue());
  if (!hasValue || !isMulti) {
    return (
      <components.ValueContainer {...props}>
        {children}
        <Typography
          color="primary"
          variant={"subtitle2"}
          component={"span"}
          className={"self-start"}
          sx={{
            position: "absolute",
            top: "calc(50% - 11px)",
            right: "0",
            zIndex: "10",
          }}
        >
          {currency}
        </Typography>
      </components.ValueContainer>
    );
  }
  return (
    <components.ValueContainer {...props}>
      {!inputValue && (
        <components.Placeholder {...props}>
          {`${numberOfValues} ${placeholder}`}
        </components.Placeholder>
      )}
      {children[1]}
    </components.ValueContainer>
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
