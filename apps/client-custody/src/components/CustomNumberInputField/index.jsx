import { NumericFormat } from "react-number-format";

import { useFormikContext } from "formik";
import PropTypes from "prop-types";

const CustomNumberInputField = ({ name, inputRef, onChange, decimalScale, ...rest }) => {
  const formik = useFormikContext();

  return (
    <NumericFormat
      {...rest}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values?.value,
          },
        });
        formik?.setFieldTouched(name);
      }}
      thousandSeparator
      isNumericString
      allowNegative={false}
      decimalScale={decimalScale || 2}
      fixedDecimalScale
    />
  );
};

CustomNumberInputField.propTypes = {
  name: PropTypes.string.isRequired,
  inputRef: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default CustomNumberInputField;
