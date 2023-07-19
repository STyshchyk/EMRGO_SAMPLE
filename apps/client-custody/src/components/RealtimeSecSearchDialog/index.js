import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import RealtimeSecuritySearch from '../RealtimeSecuritySearch';

const RealtimeSecSearchDialog = ({ open, handleClose, handleSecurityResultItemSelect, assetTypeFilterValue }) => (
  <Dialog
    scroll="body"
    maxWidth="lg"
    disableEscapeKeyDown
    open={open}
    onClose={(event, reason) => {
      if (reason && reason === 'backdropClick') return;

      handleClose();
    }}
    aria-labelledby="security-data-search-form-dialog"
  >
    <DialogTitle>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography
            variant="h6"
            style={{
              fontWeight: 'bold',
            }}
          >
            Real-time Security lookup
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="close"
            onClick={() => {
              handleClose();
            }}
            size="large">
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    </DialogTitle>
    <DialogContent>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <RealtimeSecuritySearch onSecurityResultItemSelect={handleSecurityResultItemSelect} assetTypeFilterValue={assetTypeFilterValue} />
        </Grid>
        <Grid item container justifyContent="flex-end">
          <Grid item>
            {
              // !SAVE BUTTON BASICALLY JUST CLOSES THE DIALOG FOR NOW
            }
            <Button variant="contained" color="primary" onClick={handleClose}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DialogContent>
  </Dialog>
);

RealtimeSecSearchDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSecurityResultItemSelect: PropTypes.func.isRequired,
  assetTypeFilterValue: PropTypes.string.isRequired,
};

export default RealtimeSecSearchDialog;
