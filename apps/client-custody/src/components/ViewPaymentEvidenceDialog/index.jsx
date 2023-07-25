import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import * as securitiesServicesSelectors from "../../redux/selectors/securitiesServices";
import DocumentIFrame from "../DocumentIFrame";
import LoadingIndicator from "../LoadingIndicator";

const ViewPaymentEvidenceDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const { t } = useTranslation(["reports"]);

  const fileURLsFetched = useSelector(securitiesServicesSelectors.selectFileURLsFetched);
  const isFetchingFileURL = useSelector(securitiesServicesSelectors.selectIsFetching);

  const { paymentConfirmationFileId, security } = currentlySelectedRowData;
  const paymentFileURL = fileURLsFetched[paymentConfirmationFileId];

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="view-payment-evidence-dialog"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
              }}
            >
              {`View Payment Evidence - ${security}`}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      {isFetchingFileURL ? (
        <DialogContent>
          <LoadingIndicator />
        </DialogContent>
      ) : (
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "80vh",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {paymentFileURL && <DocumentIFrame url={paymentFileURL} />}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ViewPaymentEvidenceDialog;

ViewPaymentEvidenceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
