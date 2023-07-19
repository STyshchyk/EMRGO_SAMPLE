import PropTypes from 'prop-types';
// import cx from 'classnames';
import style from './style.module.scss';

const Chip = ({ label }) => (
  <div className={style.chipContainer}>
    <span>{label}</span>
  </div>
);

Chip.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Chip;
