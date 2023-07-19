import { forwardRef } from 'react';
import MuiButton from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import cx from 'classnames';

const styles = {
  root: {
    textTransform: 'none',
    fontWeight: 'bold',
    '&:disabled': {
      color: 'black',
    },
  },
};

const Button = forwardRef(({ className, classes, variant, color, children, size, ...rest }, ref) => (
  <MuiButton ref={ref} disableFocusRipple disableRipple size={size} color={color} variant={variant} disableElevation {...rest} className={cx(classes.root, className)}>
    {children}
  </MuiButton>
));

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  classes: PropTypes.shape({
    root: PropTypes.string,
  }).isRequired,
  size: PropTypes.string,
  variant: PropTypes.oneOf(['text', 'contained', 'outlined']),
  color: PropTypes.string,
  className: PropTypes.string,
};

Button.defaultProps = {
  children: '',
  size: 'medium',
  variant: 'contained',
  color: 'primary',
  className: '',
};

Button.muiName = MuiButton.muiName;
export default withStyles(styles)(Button);
