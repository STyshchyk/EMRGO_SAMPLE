import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

import * as kycActionCreators from "../../../../../redux/actionCreators/kyc";
import * as kycSelectors from "../../../../../redux/selectors/kyc";
import AddPaymentAccountForm from "../AddPaymentAccountForm";

const EditPaymentAccountFormDialog = ({
  entityId,
  accountId,
  initialValues,
  open,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management"]);
  const uploadedFiles = useSelector(kycSelectors.selectUploadedFiles);

  const handleSubmit = (values) => {
    const requestPayload = {
      ...values,
      countryId: values.country?.value,
      currencyId: values.currency?.value,
      country: undefined,
      currency: undefined,
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
      dispatch(kycActionCreators.doEditPaymentAccount(payload));
    const fetchPaymentAccountsByEntityID = (payload) =>
      dispatch(kycActionCreators.doFetchPaymentAccountsByEntityID(payload));

    editPaymentAccount({
      accountId,
      requestPayload,
      successCallback: () => {
        fetchPaymentAccountsByEntityID({
          entityId,
        });
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
            disableSelectCurrencyField
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentAccountFormDialog;

EditPaymentAccountFormDialog.propTypes = {
  accountId: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    accountNo: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    currency: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    iban: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    postcode: PropTypes.string,
    routingNo: PropTypes.string,
    swift: PropTypes.string,
    sortCode: PropTypes.string,
    ifscCode: PropTypes.string,
    bsbCode: PropTypes.string,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
