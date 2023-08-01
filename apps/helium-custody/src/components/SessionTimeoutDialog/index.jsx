import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import * as authActionCreators from "../../redux/actionCreators/auth";
import { selectIsSessionTimeoutDialog } from "../../redux/selectors/auth";

const SessionTimeoutDialog = () => {
  const dispatch = useDispatch();
  const isSessionTimeoutDialog = useSelector(selectIsSessionTimeoutDialog);

  const handleClose = () => {
    dispatch(authActionCreators.doSessionTimeoutDialog(false));
    dispatch(authActionCreators.doLogoutUser());
  };

  return (
    <Dialog
      open={isSessionTimeoutDialog}
      aria-describedby="alert-dialog-description"
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick");
      }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Session has timed out. Please Login again.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutDialog;
