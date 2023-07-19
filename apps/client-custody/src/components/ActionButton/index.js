/* eslint-disable react/button-has-type */
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';
// import style from './style.module.scss';

const ActionButton = ({ text, link, onClick, disabled = false, type = 'button', hideArrow = false, logoColor = false }) => {
  if (disabled) {
    return (
      <button disabled className={cx('btn', 'btn--disabled--filled', 'full-width', 'btn-text--small-text', hideArrow ? '' : ' ')} type={type}>
        {text}
      </button>
    );
  }
  if (link) {
    return (
      <Link to={link}>
        <button href={link} className={cx('btn', logoColor ? 'btn--logo' : 'btn--primary', 'full-width', 'btn-text--small-text', hideArrow ? '' : ' ')}>
          {text}
        </button>
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cx('btn', logoColor ? 'btn--logo' : 'btn--primary', 'full-width', 'btn-text--small-text', hideArrow ? '' : ' ')} type={type}>
      {text}
    </button>
  );
};

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  hideArrow: PropTypes.bool,
  logoColor: PropTypes.bool,
};

ActionButton.defaultProps = {
  link: '',
  disabled: false,
  type: 'button',
  hideArrow: false,
  logoColor: false,
  onClick: () => {},
};

export default ActionButton;
