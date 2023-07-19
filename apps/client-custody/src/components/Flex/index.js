import cx from 'classnames';
import PropTypes from 'prop-types';

import style from './style.module.scss';

const justifyOption = {
  center: 'justify-content--center',
  end: 'justify-content--end',
  start: 'justify-content--start',
  between: 'justify-content--between',
  around: 'justify-content--around',
};

const widthSize = {
  25: 'width--25',
  50: 'width--50',
  75: 'width--75',
  100: 'width--100',
};

const heightSize = {
  25: 'height--25',
  50: 'height--50',
  75: 'height--75',
  100: 'height--100',
  auto: 'height--auto',
};

const wrapOption = {
  flex: 'wrap--flex',
};

const Flex = ({ direction, justify, width, height, className, children, wrap }) => (
  <div
    className={cx(
      style.flex,
      direction === 'column' ? style['flex--column'] : style['flex--row'],
      style[justifyOption[justify]],
      style[wrapOption[wrap]],
      style[widthSize[width]],
      style[heightSize[height]],
      className,
    )}
  >
    {children}
  </div>
);

Flex.propTypes = {
  direction: PropTypes.string,
  justify: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  wrap: PropTypes.string,
};

Flex.defaultProps = {
  children: '',
  className: '',
  width: '100',
  height: 'auto',
  justify: 'start',
  direction: '',
  wrap: '',
};

export default Flex;
