import { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import style from './style.module.scss';

const FormSection = ({ children, title, primary }) => (
  <Fragment>
    <h3 className={cx(style.title, primary ? style.primary : '')}>{title}</h3>
    {children}
  </Fragment>
);

FormSection.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  title: PropTypes.string.isRequired,
  primary: PropTypes.bool,
};

FormSection.defaultProps = {
  primary: false,
};

export default FormSection;
