import { NumericFormat } from "react-number-format";

import PropTypes from "prop-types";

const CustomNumberInputField = ({ name, inputRef, onChange, decimalScale, ...rest }) => {
  return (
    <NumericFormat
      {...rest}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      decimalScale={decimalScale || 2}
      fixedDecimalScale
    />
  );
};

CustomNumberInputField.propTypes = {
  name: PropTypes.string.isRequired,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomNumberInputField;
