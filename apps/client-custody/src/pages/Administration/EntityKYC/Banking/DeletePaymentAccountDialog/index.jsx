import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

import * as kycActionCreators from "../../../../../redux/actionCreators/kyc";

const DeleteAccountDialog = ({ entityId, accountId, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management"]);

  const handleSubmit = () => {
    const deleteAccount = (payload) => dispatch(kycActionCreators.doDeletePaymentAccount(payload));
    const fetchPaymentAccountsByEntityID = (payload) =>
      dispatch(kycActionCreators.doFetchPaymentAccountsByEntityID(payload));

    deleteAccount({
      accountId,
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
        <strong>{t("PaymentAccountManagement.DeleteAccountDialog.DialogTitle")}</strong>
      </DialogTitle>
      <DialogContent>
        {t("PaymentAccountManagement.DeleteAccountDialog.DialogContent")}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          <strong>
            {t("PaymentAccountManagement.DeleteAccountDialog.ConfirmDeletionButtonText")}
          </strong>
        </Button>
        <Button onClick={handleClose} color="primary">
          <strong>{t("PaymentAccountManagement.DeleteAccountDialog.CloseDialogButtonText")}</strong>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;

DeleteAccountDialog.propTypes = {
  accountId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
