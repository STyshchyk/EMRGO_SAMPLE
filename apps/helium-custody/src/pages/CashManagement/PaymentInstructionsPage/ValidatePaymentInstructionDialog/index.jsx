import React from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import PropTypes from "prop-types";

import ExternalPayment2FA from "../ExternalPayment2FA";
import style from "./style.module.scss";

const ValidatePaymentInstructionDialog = ({
  dialogTitle,
  formLabel,
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  disabled,
  setSecurityCode,
  isViewSecurityCodeInput,
}) => {
  const { t } = useTranslation(["cash_management"]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="validate-payment-instruction-dialog"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <Box my={1} className="w-full">
          <FormControl className={style.input__form_control}>
            <FormLabel component="legend">{formLabel}</FormLabel>
          </FormControl>
        </Box>

        {isViewSecurityCodeInput && <ExternalPayment2FA setSecurityCode={setSecurityCode} />}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
          }}
          color="primary"
        >
          {t("Payment Instructions.Context Menu.Cancel")}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disabled}
          onClick={() => {
            handleSubmit();
            handleClose();
          }}
        >
          {t("Payment Instructions.Context Menu.Confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ValidatePaymentInstructionDialog.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  formLabel: PropTypes.string.isRequired,
  disabled: PropTypes.string,
  setSecurityCode: PropTypes.func,
  isViewSecurityCodeInput: PropTypes.bool,
};

ValidatePaymentInstructionDialog.defaultProps = {
  disabled: false,
  isViewSecurityCodeInput: false,
};

export default ValidatePaymentInstructionDialog;
