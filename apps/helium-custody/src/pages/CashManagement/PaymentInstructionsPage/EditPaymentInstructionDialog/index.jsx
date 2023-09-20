import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../../../redux/actionCreators/accounts";
import * as authSelectors from "../../../../redux/selectors/auth";
import AddPaymentInstructionForm from "../AddPaymentInstructionForm";

const EditPaymentInstructionDialog = ({
  instructionId,
  initialValues,
  isModalOpen,
  setIsModalOpen,
  options,
  disabled,
}) => {
  // const { t } = useTranslation(['cash_management']);
  const dispatch = useDispatch();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const isWethaqUser = currentEntityGroupEntityType === "EMRGO_SERVICES";

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values, { resetForm }) => {
    const updatePaymentInstruction = (payload) => {
      dispatch(accountsActionCreators.doUpdateOutgoingPaymentInstruction(payload));
    };

    const requestPayload = {
      wethaqAccountId: values?.sourceAccount.value.id,
      transferPurposeTypeId: values.transferPurpose.value,
      accountId: values?.paymentAccount.value.accountId,
      amount: parseFloat(values.paymentAmount),
      valueDate: values.valueDate,
      details: values.paymentDetails,
    };

    updatePaymentInstruction({
      instructionId,
      requestPayload,
    });

    setTimeout(() => {
      handleClose();
      resetForm();
    }, 1000);
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={(event, reason) => {
        if (disabled && reason && reason === "backdropClick") handleClose();
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="send-onboarding-invitation"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">Edit Payment Instruction</DialogTitle>
      <DialogContent>
        {!disabled ? (
          <AddPaymentInstructionForm
            initialValues={initialValues}
            options={options}
            isWethaqUser={isWethaqUser}
            handleSubmit={handleSubmit}
            handleCancel={() => handleClose()}
          />
        ) : (
          <p>Payment instruction cannot be modified at this stage</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

EditPaymentInstructionDialog.propTypes = {
  initialValues: PropTypes.shape({
    transferPurposeType: PropTypes.string,
    paymentAccount: PropTypes.string,
    valueDate: PropTypes.string,
    paymentAmount: PropTypes.string,
    paymentDetails: PropTypes.string,
  }).isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default EditPaymentInstructionDialog;
