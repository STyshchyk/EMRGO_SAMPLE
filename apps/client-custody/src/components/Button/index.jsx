import { forwardRef } from "react";

import { styled } from '@mui/material/styles';

import MuiButton from "@mui/material/Button";
import cx from "classnames";
import PropTypes from "prop-types";

const PREFIX = 'index';

const classes = {
  root: `${PREFIX}-root`
};

const StyledMuiButton = styled(MuiButton)({
  [`&.${classes.root}`]: {
    textTransform: "none",
    fontWeight: "bold",
    "&:disabled": {
      color: "black",
    },
  },
});

const Button = forwardRef(
  ({ className,  variant, color, children, size, ...rest }, ref) => (
    <StyledMuiButton
      ref={ref}
      disableFocusRipple
      disableRipple
      size={size}
      color={color}
      variant={variant}
      disableElevation
      {...rest}
      className={cx(classes.root, className)}
    >
      {children}
    </StyledMuiButton>
  )
);

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  classes: PropTypes.shape({
    root: PropTypes.string,
  }).isRequired,
  size: PropTypes.string,
  variant: PropTypes.oneOf(["text", "contained", "outlined"]),
  color: PropTypes.string,
  className: PropTypes.string,
};

Button.defaultProps = {
  children: "",
  size: "medium",
  variant: "contained",
  color: "primary",
  className: "",
};

Button.muiName = MuiButton.muiName;
export default (Button);
