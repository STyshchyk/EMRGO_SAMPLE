import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const CancelSettlementInstructionDialog = ({ open, handleClose, handleCancel }) => {
  const { t } = useTranslation(['custody_and_settlement']);

  return (
    <Fragment>
      <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title" PaperProps={{ className: 'overflow-y-visible' }}>
        <DialogTitle id="edit-group-types-form-dialog-title">Are you sure you want to cancel the Settlement Instruction? </DialogTitle>
        <DialogContent className="overflow-y-visible"></DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>

          <Button onClick={handleCancel} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CancelSettlementInstructionDialog;
