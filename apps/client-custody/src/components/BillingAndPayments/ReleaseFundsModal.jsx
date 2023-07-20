import React from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import PropTypes from "prop-types";

import style from "./style.module.scss";

const ReleaseFundsModal = ({ isModalOpen, setIsModalOpen, selectedTransaction, handleRelease }) => {
  const { t } = useTranslation(["cash_management"]);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const payload = {
    incomingPaymentId: selectedTransaction?.id,
    sourceAccountId: selectedTransaction?.sourceAccount?.id,
    destinationAccountId: selectedTransaction.assignedAccount
      ? selectedTransaction.assignedAccount.id
      : null,
    amount: parseFloat(selectedTransaction?.amount),
    description: "Funds released to client account by Emrgo Services",
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="send-onboarding-invitation"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        {t("cash_management:Incoming Payments.Modals.Release Payment")}
      </DialogTitle>
      <DialogContent>
        <Box className={style.detailsWrapper}>
          <Typography variant="body1">
            Source Account : {selectedTransaction?.sourceAccount?.accountNo} ({" "}
            {capitalCase(selectedTransaction?.sourceAccount?.type)} )
          </Typography>
          <Typography variant="body1">
            Source Balance : {selectedTransaction?.sourceAccount?.accountBalance}
          </Typography>
          <br />
          <Typography variant="body1">
            Destination Account :{" "}
            {selectedTransaction.assignedAccount
              ? `${selectedTransaction.assignedAccount.accountNo} ( ${capitalCase(
                  selectedTransaction?.assignedAccount?.type
                )} ) `
              : "N/A"}
          </Typography>
          <Typography variant="body1">Currency : {selectedTransaction?.currency}</Typography>
          <Typography variant="body1">Amount : {selectedTransaction?.amount}</Typography>
          <Typography variant="body1">Description : {payload.description}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
          }}
          color="primary"
        >
          {t("cash_management:Entity Accounts.Cancel")}
        </Button>
        <Button
          disabled={selectedTransaction.assignedAccount === null}
          onClick={() => {
            handleRelease(payload);
            handleClose();
          }}
          variant="contained"
          color="primary"
        >
          {t("cash_management:Entity Accounts.Release")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReleaseFundsModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ReleaseFundsModal;
