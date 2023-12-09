import { NumericFormat } from "react-number-format";

import { useFormikContext } from "formik";
import PropTypes from "prop-types";

const CustomNumberInputField = ({
  name,
  inputRef,
  onChange,
  decimalScale,
  useFormik = true,
  ...rest
}) => {
  const formik = useFormikContext(); //Avoid page crush where component is used without formik
  const handleChange = (values) => {
    formik.setFieldTouched(name);
    onChange({ target: { name, value: values?.value } });
  };
  return (
    <NumericFormat
      {...rest}
      getInputRef={inputRef}
      onValueChange={handleChange}
      thousandSeparator
      isNumericString
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
