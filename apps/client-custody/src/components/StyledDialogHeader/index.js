import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const StyledDialogHeader = ({ title, handleClose }) => (
  <DialogTitle>
    <Grid container justifyContent="space-between">
      <Grid item>
        <Typography
          variant="h6"
          style={{
            fontWeight: 'bold',
          }}
        >
          <span
            style={{
              borderBottom: '2px solid #28ccbf',
              fontSize: '1rem',
              fontWeight: 'bold',
              paddingBottom: '0.25em',
            }}
          >
            {title}
          </span>
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
);

export default StyledDialogHeader;

StyledDialogHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};
