import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../../../redux/actionCreators/accounts";
import * as formActionCreators from "../../../../redux/actionCreators/form";
import * as accountSelectors from "../../../../redux/selectors/accounts";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as selectFormValues from "../../../../redux/selectors/form";
import AddPaymentInstructionForm from "../AddPaymentInstructionForm";

const AddPaymentInstructionDialog = ({ isModalOpen, setIsModalOpen, options }) => {
  const formvalues = useSelector(selectFormValues.selectFormValues);
  const fetchingValues = useSelector(selectFormValues.formValuesFetching);
  const initial = {
    sourceEntity: null,
    sourceAccount: null,
    paymentAccount: null,
    valueDate: null,
    paymentAmount: null,
    paymentDetails: null,
    transferPurpose: null,
  };
  const [initialValues, setInitialValues] = useState(initial);

  const { t } = useTranslation(["cash_management", "components"]);
  const dispatch = useDispatch();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isSubmitting = useSelector(accountSelectors.selectIsSubmitting);

  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const isWethaqUser = currentEntityGroupEntityType === "EMRGO_SERVICES";

  // const workableAccounts = sourceAccounts.filter((account) => account.accountBalance !== '0.00').filter((account) => account.currency.name === 'SAR');
  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const handleClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (isModalOpen) {
      const fetchFormValues = (payload) => dispatch(formActionCreators.doFetchForm(payload));
      fetchFormValues({ keys: ["AddPaymentInstructionDialogForm"] });
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!formvalues || !formvalues?.settings) return;
    const data = formvalues?.settings[0];
    if (
      !fetchingValues &&
      data?.value &&
      data?.value !== "null" &&
      data?.key === "AddPaymentInstructionDialogForm"
    ) {
      setInitialValues(JSON.parse(data.value));
    }
  }, [formvalues, fetchingValues]);

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: "AddPaymentInstructionDialogForm",
          value: JSON.stringify(value),
          isActive: false,
        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };
  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    const createPaymentInstruction = (payload) => {
      dispatch(accountsActionCreators.doCreateOutgoingInstructions(payload));
    };

    const requestPayload = {
      wethaqAccountId: values?.sourceAccount?.value.id,
      transferPurposeTypeId: values.transferPurpose.value,
      accountId: values.paymentAccount.value.accountId,
      amount: parseFloat(values.paymentAmount),
      valueDate: values.valueDate,
      details: values.paymentDetails,
    };

    setSubmitting(true);

    createPaymentInstruction({
      requestPayload,
      successCallback: () => {
        setSubmitting(false);
        saveFormValues(values);
        handleClose();
        resetForm();
      },
    });
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="send-onboarding-invitation"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">
        {t("Payment Instructions.Modals.New Payment Instruction")}
      </DialogTitle>
      <DialogContent>
        <AddPaymentInstructionForm
          initialValues={initialValues}
          options={options}
          isWethaqUser={isWethaqUser}
          initial={initial}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          handleCancel={() => {
            saveFormValues("clear");
            setInitialValues(initial);
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

AddPaymentInstructionDialog.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default AddPaymentInstructionDialog;
