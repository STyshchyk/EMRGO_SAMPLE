import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import Select from 'react-select';

import style from './style.module.scss';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
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
          size="large">
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: 500,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const UserSelection = ({ options, onSubmit, onClose, open, submitText, headerText, multi, placeholder }) => {
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
    <Dialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {headerText}
      </DialogTitle>
      <DialogContent style={{ overflowY: 'visible', minHeight: '400px' }} dividers>
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
      <DialogActions>
        <Button autoFocus onClick={handleSubmit} color="primary" disabled={disabled}>
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UserSelection.propTypes = {};

UserSelection.defaultProps = {};

export default UserSelection;
