import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

import * as accountsActionCreators from "../../../../redux/actionCreators/accounts";
import * as accountsSelectors from "../../../../redux/selectors/accounts";
import AddPaymentAccountForm from "../AddPaymentAccountForm";

const EditPaymentAccountFormDialog = ({ accountId, initialValues, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management"]);
  const uploadedFiles = useSelector(accountsSelectors.selectUploadedFiles);

  const handleSubmit = (values) => {
    const requestPayload = {
      ...values,
      countryId: values.country?.value,
      currencyId: values.currency?.value,
      intermediaryBankCountryId: values.intermediaryBankCountry?.value,
      country: undefined,
      currency: undefined,
      intermediaryBankCountry: undefined,
      accountNo:
        values.currency?.label !== "USD" && values.currency?.label !== "GBP"
          ? undefined
          : values.accountNo,
      routingNo: values.currency?.label !== "USD" ? undefined : values.routingNo,
      sortCode: values.currency?.label !== "GBP" ? undefined : values.sortCode,
      ifscCode: values.currency?.label !== "INR" ? undefined : values.ifscCode,
      bsbCode:
        values.currency?.label !== "AUD" || values.currency?.label !== "NZD"
          ? undefined
          : values.bsbCode,
    };

    requestPayload.supportingDoc = uploadedFiles?.supportingDoc?.fileIdentifier;
    const editPaymentAccount = (payload) =>
      dispatch(accountsActionCreators.doEditPaymentAccount(payload));

    editPaymentAccount({
      accountId,
      requestPayload,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>
              {t("PaymentAccountManagement.EditPaymentAccountFormDialog.DialogTitle")}
            </strong>
          </Grid>

          <IconButton aria-label="close" onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            padding: "1rem",
          }}
        >
          <AddPaymentAccountForm
            initialValues={initialValues}
            handleSubmit={handleSubmit}
            handleCloseDialog={() => {
              handleClose();
            }}
            disableSelectCurrencyField
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentAccountFormDialog;
