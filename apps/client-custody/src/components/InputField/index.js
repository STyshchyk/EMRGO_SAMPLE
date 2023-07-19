import cx from 'classnames';
import Required from 'components/Required';
import { useField } from 'formik';
import PropTypes from 'prop-types';

import style from './style.module.scss';

const InputField = (props) => {
  const [field, meta, helpers] = useField(props);
  const { name, label, type, placeholder, readOnly, className, disableLabel, align, fullWidth, customOnchange, isRequired } = props;

  return (
    <div className={cx(style.container, fullWidth ? style.fullWidth : '')}>
      <div className={cx(style['input-group'], align === 'left' ? style['label-left'] : style['label-center'])}>
        {label === '' ? (
          ''
        ) : (
          <label className={cx(style['input-group__label'], { [style['input-group__label--hidden']]: disableLabel })} htmlFor={name}>
            {label}
            {isRequired && <Required />}
          </label>
        )}
        <input
          {...field}
          value={field.value ?? ''}
          id={name}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cx(style['input-group__field'], fullWidth ? style.fullWidth : '', className)}
          type={type}
          onChange={(e) => {
            helpers.setValue(e.target.value);
            customOnchange(e.target.value);
          }}
        />
      </div>
      {meta.touched && meta.error ? <div className={style['input-group__error']}>{meta.error}</div> : null}
    </div>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  disableLabel: PropTypes.bool,
  align: PropTypes.string,
  fullWidth: PropTypes.bool,
  customOnchange: PropTypes.func,
};

InputField.defaultProps = {
  label: '',
  type: 'text',
  placeholder: '',
  readOnly: false,
  className: '',
  disableLabel: false,
  align: 'left',
  fullWidth: false,
  customOnchange: () => {},
};

export default InputField;
