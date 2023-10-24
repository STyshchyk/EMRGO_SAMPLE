import { useTranslation } from "react-i18next";

import { AuditLogs } from "@emrgo-frontend/shared-ui";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

const ViewSafekeepingAccountAuditLogsDialog = ({ open, handleClose, logs }) => {
  const { t } = useTranslation(["safekeeping_accounts", "miscellaneous"]);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // if (reason && reason === "backdropClick") return;
        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="add-payment-account-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <Typography variant="h6">{t("Modal.View Safekeeping Account")}</Typography>
          </Grid>

          <IconButton aria-label="close" onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <AuditLogs logs={logs} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {" "}
          {t("miscellaneous:Buttons.Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSafekeepingAccountAuditLogsDialog;

ViewSafekeepingAccountAuditLogsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
