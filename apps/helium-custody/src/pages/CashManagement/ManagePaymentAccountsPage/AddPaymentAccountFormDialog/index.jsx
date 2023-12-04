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

import LoadingIndicator from "../../../../components/LoadingIndicator";
import * as accountsActionCreators from "../../../../redux/actionCreators/accounts";
import * as accountsSelectors from "../../../../redux/selectors/accounts";
import * as authSelectors from "../../../../redux/selectors/auth";
import AddPaymentAccountForm from "../AddPaymentAccountForm";

const generateRequestPayload = (formikValues) => {
  const hasIntermediaryBank = formikValues?.hasIntermediaryBank;

  const {
    intermediaryBankAccountNo,
    intermediaryBankAddress,
    intermediaryBankBIC,
    intermediaryBankCity,
    intermediaryBankCountry,
    intermediaryBankIBAN,
    intermediaryBankName,
    intermediaryBankPostCode,
    intermediaryBankRouteCode,
    intermediaryBankSortCode,
    ...restFormikValues
  } = formikValues;

  if (hasIntermediaryBank) {
    return {
      ...formikValues,
      entityGroupId: formikValues.sourceEntity?.groups,
      countryId: formikValues.country?.value,
      currencyId: formikValues.currency?.value,
      country: undefined,
      currency: undefined,
      intermediaryBankCountryId: formikValues.intermediaryBankCountry?.value,
      intermediaryBankCountry: undefined,
    };
  } else {
    return {
      ...restFormikValues,
      entityGroupId: formikValues.sourceEntity?.groups,
      countryId: formikValues.country?.value,
      currencyId: formikValues.currency?.value,
      country: undefined,
      currency: undefined,
    };
  }
};

const AddPaymentAccountFormDialog = ({ open, handleClose, entitiesList }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management"]);
  const uploadedFiles = useSelector(accountsSelectors.selectUploadedFiles);
  const isSubmitting = useSelector(accountsSelectors.selectIsSubmitting);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

  const currentEntityGroupID = currentEntityGroup?.id;
  const handleSubmit = (values, actions) => {
    const addPaymentAccount = (payload) =>
      dispatch(accountsActionCreators.doAddPaymentAccount(payload));
    const requestPayload = generateRequestPayload({ ...values, currentEntityGroupID });
    requestPayload.supportingDoc = uploadedFiles?.supportingDoc?.fileIdentifier;

    addPaymentAccount({
      requestPayload,
      successCallback: () => {
        handleClose();
      },
    });

    actions.resetForm();
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
            <AddPaymentAccountForm
              handleSubmit={handleSubmit}
              handleCloseDialog={() => {
                handleClose();
              }}
              entitiesList={entitiesList}
            />
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
