import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import * as authActionCreators from '../../redux/actionCreators/auth';
import { selectIsAccessDeniedDialog } from '../../redux/selectors/auth';

const AccessDeniedDialog = () => {
  const dispatch = useDispatch();
  const isAccessDeniedDialog = useSelector(selectIsAccessDeniedDialog);

  const handleClose = () => {
    dispatch(authActionCreators.doAccessDeniedDialog(false));
  };

  return (
    <Dialog
      open={isAccessDeniedDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick');
      }}
    >
      <DialogTitle id="alert-dialog-title">{'Access Denied'}</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">You dont have permission to view this page!</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessDeniedDialog;
