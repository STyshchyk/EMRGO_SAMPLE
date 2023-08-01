import { useState } from "react";
import { styled } from '@mui/material/styles';
import Select from "react-select";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import style from "./style.module.scss";

const PREFIX = 'UserSelection';

const classes = {
  root: `${PREFIX}-root`,
  root2: `${PREFIX}-root2`,
  root3: `${PREFIX}-root3`,
  closeButton: `${PREFIX}-closeButton`
};

const StyledDialog = styled(Dialog)((
  {
    theme
  }
) => ({
  [`& .${classes.root3}`]: {
    margin: 0,
    padding: theme.spacing(2),
  },

  [`& .${classes.closeButton}`]: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
}));

const DialogTitle = ((props) => {
  const { children,  onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography align="left" variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const CustomOption = (props) => {
  const { innerProps, isDisabled, data } = props;

  return !isDisabled ? (
    <div {...innerProps}>
      <Box p={1} className={style.selectContainer}>
        <Grid container justifyContent="space-between">
          <Typography>{data.label}</Typography>
          <Typography>{data.type}</Typography>
        </Grid>
      </Box>
    </div>
  ) : null;
};

const DialogContent = MuiDialogContent;

const DialogActions = MuiDialogActions;

const UserSelection = ({
  options,
  onSubmit,
  onClose,
  open,
  submitText,
  headerText,
  multi,
  placeholder,
}) => {
  // Selectors
  const [selected, setSelected] = useState(null);

  const handleSelectReviewUser = (value) => {
    setSelected(value);
  };

  const handleSubmit = () => {
    if (multi) {
      const selectedOpts = [...selected];
      const res = [];
      selectedOpts.forEach((opt) => res.push(opt.value));
      onSubmit(res);
    } else {
      onSubmit(selected.value);
    }
  };

  const disabled = multi ? !selected?.length : !selected;
  return (
    <StyledDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {headerText}
      </DialogTitle>
      <DialogContent
        style={{ overflowY: "visible", minHeight: "400px" }}
        dividers
        classes={{
          root: classes.root
        }}>
        <Select
          components={{ Option: CustomOption }}
          isMulti={multi}
          value={selected}
          onChange={handleSelectReviewUser}
          isClearable={false}
          isSearchable={false}
          options={options}
          placeholder={placeholder}
        />
      </DialogContent>
      <DialogActions
        classes={{
          root: classes.root2
        }}>
        <Button autoFocus onClick={handleSubmit} color="primary" disabled={disabled}>
          {submitText}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

UserSelection.propTypes = {};

UserSelection.defaultProps = {};

export default UserSelection;
