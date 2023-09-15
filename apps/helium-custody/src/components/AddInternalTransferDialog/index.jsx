import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import * as billingAndPaymentsActionCreators from "../../redux/actionCreators/cashManagement";
import * as journalsActionCreators from "../../redux/actionCreators/journals";
import * as paymentAndSettlementSelectors from "../../redux/selectors/paymentAndSettlement";
import AddInternalTransferForm from "../AddInternalTransferForm";

const AddInternalTransferDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  // selectors
  const isSubmitting = useSelector(paymentAndSettlementSelectors.selectIsSubmitting);

  const handleSubmit = (values, { setSubmitting }) => {
    const fetchInternalTransactions = () =>
      dispatch(journalsActionCreators.doFetchInternalTransactions());
    const createInternalTransfer = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doMoneyTransferInternal(payload));

    setTimeout(() => {
      setSubmitting(false);
    }, 1000);

    const requestPayload = {
      amount: parseFloat(values.transferAmount),
      description: values.description,
      sourceAccountId: values.sourceAccount.value.accountId,
      destinationAccountId: values.destinationAccount.value.accountId,
    };

    createInternalTransfer({
      requestPayload,
      successCallback: () => {
        handleClose();
        fetchInternalTransactions();
      },
    });
  };

  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="add-settlement-instruction-form-dialog"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
              }}
            >
              New Internal Transfer
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
      <DialogContent>
        <Box mb={2}>
          <AddInternalTransferForm
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            handleCloseDialog={() => handleClose()}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddInternalTransferDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddInternalTransferDialog;
