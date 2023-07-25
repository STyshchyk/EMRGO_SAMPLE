import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

import LoadingIndicator from "../../../../../components/LoadingIndicator";
import * as kycActionCreators from "../../../../../redux/actionCreators/kyc";
import * as kycSelectors from "../../../../../redux/selectors/kyc";
import AddPaymentAccountForm from "../AddPaymentAccountForm";

const generateRequestPayload = (formikValues) => ({
  ...formikValues,
  countryId: formikValues.country.value,
  currencyId: formikValues.currency.value,
  country: undefined,
  currency: undefined,
});

const AddPaymentAccountFormDialog = ({ entityId, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management"]);
  const uploadedFiles = useSelector(kycSelectors.selectUploadedFiles);
  const isSubmitting = useSelector(kycSelectors.selectIsSubmitting);

  const handleSubmit = (values) => {
    const addPaymentAccount = (payload) => dispatch(kycActionCreators.doAddPaymentAccount(payload));
    const fetchPaymentAccountsByEntityID = (payload) =>
      dispatch(kycActionCreators.doFetchPaymentAccountsByEntityID(payload));

    const requestPayload = generateRequestPayload(values);
    requestPayload.supportingDoc = uploadedFiles?.supportingDoc?.fileIdentifier;

    addPaymentAccount({
      requestPayload,
      successCallback: () => {
        fetchPaymentAccountsByEntityID({
          entityId,
        });
      },
    });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="add-payment-account-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>{t("PaymentAccountManagement.AddPaymentAccountFormDialog.DialogTitle")}</strong>
          </Grid>

          <IconButton aria-label="close" onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          {isSubmitting ? (
            <div>
              <LoadingIndicator />
              <p>
                {t(
                  "PaymentAccountManagement.AddPaymentAccountFormDialog.Your form submission is being processed"
                )}
                ...
              </p>
            </div>
          ) : (
            <AddPaymentAccountForm handleSubmit={handleSubmit} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentAccountFormDialog;

AddPaymentAccountFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
