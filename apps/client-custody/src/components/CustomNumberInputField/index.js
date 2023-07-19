import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const CustomNumberInputField = ({ name, inputRef, onChange, ...rest }) => (
  <NumberFormat
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
    decimalScale={3}
  />
);

CustomNumberInputField.propTypes = {
  name: PropTypes.string.isRequired,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomNumberInputField;
