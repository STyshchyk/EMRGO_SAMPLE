import { Children, cloneElement } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';

import style from './style.module.scss';

const renderErrorMessageCallback = (errorMessage) => <div className={style['radio-button-group__error']}>{errorMessage}</div>;

const RadioButtonGroupV2 = ({ label, name, className, children, displayInline }) => (
  <div className={cx(style['radio-button-group'], className)}>
    <div className={cx(displayInline ? style.displayInline : '')}>
      <span className={style['radio-button-group__label']}>{label}</span>
      {Children.map(children, (child) => cloneElement(child, { radioButtonGroupName: name }))}
    </div>
    <ErrorMessage name={name}>{renderErrorMessageCallback}</ErrorMessage>
  </div>
);

RadioButtonGroupV2.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  displayInline: PropTypes.bool,
};

RadioButtonGroupV2.defaultProps = {
  label: '',
  className: '',
  children: '',
  displayInline: false,
};

export default RadioButtonGroupV2;
