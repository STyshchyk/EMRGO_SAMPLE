import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { CsvBuilder } from "filefy";
import v from "voca";

import LoadingPage from "../../../components/LoadingPage";
import PageTitle from "../../../components/PageTitle";
import { dateRenderer } from "../../../constants/paymentAndStatuses/renderers";
import { currencyRenderer } from "../../../constants/renderers";
import { useTheme } from "../../../context/theme-context";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../../redux/actionCreators/accounts";
import * as billingAndPaymentsActionCreators from "../../../redux/actionCreators/cashManagement";
import * as entitiesActionCreators from "../../../redux/actionCreators/entities";
import * as accountsSelectors from "../../../redux/selectors/accounts";
import * as authSelectors from "../../../redux/selectors/auth";
import * as billingAndPaymentsSelectors from "../../../redux/selectors/cashManagement";
import * as entitiesSelectors from "../../../redux/selectors/entities";
import { getDropdownValues } from "../../../utils/form";
import AddPaymentInstructionDialog from "./AddPaymentInstructionDialog";
import EditPaymentInstructionDialog from "./EditPaymentInstructionDialog";
import PaymentInstructionsTable from "./PaymentInstructionsTable";
import ValidatePaymentInstructionDialog from "./ValidatePaymentInstructionDialog";

const PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM = {
  "Wethaq Approval": "Wethaq Approval",
  "Wethaq Validation": "Wethaq Validation",
  "Client Approval": "Pending Approval",
  Approved: "Approved",
  Cancelled: "Cancelled",
  Disbursed: "Disbursed",
  Failed: "Failed",
  Initiated: "Initiated",
  Rejected: "Rejected",
  Submitted: "Submitted",
};

const generateInitialValues = (selectedPaymentInstructionRowData, options) => {
  const {
    allSourceAccountOptions,
    sourceEntityOptions,
    allPaymentAccountOptions,
    beneficiaryUserOptions,
  } = options;

  const sourceAccount = allSourceAccountOptions.find(
    (i) => i.value.id === selectedPaymentInstructionRowData?.wethaqAccountId
  );
  const sourceEntity = sourceEntityOptions.find((i) => i.value === sourceAccount?.value?.entityId);
  const paymentAccount =
    allPaymentAccountOptions &&
    allPaymentAccountOptions.find(
      (i) => i.value.accountId === selectedPaymentInstructionRowData?.accountId
    );
  const beneficiaryEntityGroupUser = beneficiaryUserOptions.find(
    (i) => i.value.id === paymentAccount?.value?.userId
  );

  const valueDate = selectedPaymentInstructionRowData?.valueDate;
  const paymentAmount = selectedPaymentInstructionRowData?.payment;
  const paymentDetails = selectedPaymentInstructionRowData?.details;
  const transferPurpose = options.paymentTransferPurposeOptions.find(
    (i) => i.value === selectedPaymentInstructionRowData?.transferPurposeTypeId
  );

  const initialValues = {
    instructionId: selectedPaymentInstructionRowData?.id,
    sourceEntity,
    sourceAccount,
    beneficiaryEntityGroupUser,
    paymentAccount,
    valueDate,
    paymentAmount,
    paymentDetails,
    transferPurpose,
  };

  return initialValues;
};

const generateSourceEntityOptions = (entities) =>
  entities.map((entity) => ({
    value: entity.id,
    label: entity.corporateEntityName,
  }));

const generateSourceAccountOptions = (sourceAccounts) =>
  sourceAccounts.map((internalWethaqAccount) => ({
    value: {
      id: internalWethaqAccount.id,
      currency: internalWethaqAccount.currency.name,
      entityId: internalWethaqAccount.group.entity.id,
    },
    label: `${internalWethaqAccount.accountNo} ${v.capitalize(internalWethaqAccount.type)}`,
    customLabel: internalWethaqAccount.accountNo,
  }));

const generateBeneficiaryUserOptions = (validatedPaymentAccounts) => {
  const uniqueUserSet = new Set();

  return validatedPaymentAccounts
    .map((validatedPaymentAccount) => {
      const { group } = validatedPaymentAccount;
      const fullName = `${group.user.firstName} ${group.user.lastName}`;
      const { entityType, name } = group;

      return {
        value: {
          id: validatedPaymentAccount.group.user.id,
          fullName,
          entityType,
        },
        label: `[${name} - ${v.capitalize(entityType ?? "")}]  ${fullName}`,
      };
    })
    .filter((user) => {
      const isPresentInSet = uniqueUserSet.has(user.value.id);

      uniqueUserSet.add(user.value.id);

      return !isPresentInSet;
    });
};

const generatePaymentAccountOptions = (validatedPaymentAccounts) =>
  validatedPaymentAccounts.map((paymentAccount) => ({
    value: {
      accountId: paymentAccount.id,
      entityGroupId: validatedPaymentAccounts.entityGroupId,
      currencyId: paymentAccount.currency.id,
      currency: paymentAccount.currency.name,
      userId: paymentAccount.group.user.id,
      isDefault: paymentAccount.isDefault,
    },
    label: `${paymentAccount.name} - ${paymentAccount.label}`,
  }));

const PaymentInstructionsPage = () => {
  const { theme } = useTheme();
  const { locale } = theme;

  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management"]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [clientApproveModalOpen, setClientApproveModalOpen] = useState(false);
  const [viewExternalPaymentsAuditHistory, setViewExternalPaymentsAuditHistory] = useState(false);
  const [securityCode, setSecurityCode] = useState(null);

  const [selectedPaymentInstruction, setSelectedPaymentInstruction] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const dropdownValues = useSelector(billingAndPaymentsSelectors.selectDropDowns);
  const entities = useSelector(entitiesSelectors.selectEntities);
  const paymentInstructions = useSelector(accountsSelectors.selectOutgoingInstructionsData);
  const validatedPaymentAccounts = useSelector(accountsSelectors.selectedValidatedPaymentAccounts);
  const sourceAccounts = useSelector(billingAndPaymentsSelectors.selectAccounts);
  const currentUserId = useSelector(authSelectors.selectUserId);
  const isFetching = useSelector(billingAndPaymentsSelectors.selectIsFetching);

  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const isWethaqUser = currentEntityGroupEntityType === "EMRGO_SERVICES";

  const hasPaymentApproveACL = currentEntityGroup?.accessControls?.some(
    (i) => i.key === "Payment/Approve"
  );
  const hasPaymentFinalizeACL = currentEntityGroup?.accessControls?.some(
    (i) => i.key === "Payment/Finalize"
  );
  const hasPaymentClientApproveACL = currentEntityGroup?.accessControls?.some(
    (i) => i.key === "Payment/Client/Approve"
  );
  const hasPaymentClientInitializeACL = currentEntityGroup?.accessControls?.some(
    (i) => i.key === "Payment/Client/Initialize"
  );

  const allPaymentAccountOptions = generatePaymentAccountOptions(validatedPaymentAccounts);
  const allSourceAccountOptions = generateSourceAccountOptions(sourceAccounts);
  const bankAccountTypeOptions = dropdownValues?.bankAccountTypes ?? [];
  const beneficiaryUserOptions = generateBeneficiaryUserOptions(validatedPaymentAccounts);
  const currencyOptions = dropdownValues?.currency ?? [];
  const paymentTransferPurposeOptions =
    getDropdownValues(dropdownValues?.paymentTransferPurpose, locale) ?? [];
  const sourceEntityOptions = generateSourceEntityOptions(entities);

  const options = {
    allPaymentAccountOptions,
    allSourceAccountOptions,
    bankAccountTypeOptions,
    beneficiaryUserOptions,
    currencyOptions,
    paymentTransferPurposeOptions,
    sourceEntityOptions,
  };

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchPaymentAccounts = (payload) =>
      dispatch(accountsActionCreators.doFetchPaymentAccounts(payload));
    fetchPaymentAccounts({ entityId: currentEntityGroup.entity.id });

    if (isWethaqUser) {
      const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));

      fetchEntities();
    }
  }, [currentEntityGroup, isWethaqUser, dispatch]);

  useEffect(() => {
    const fetchOutgoingInstructions = () =>
      dispatch(accountsActionCreators.doFetchOutgoingInstructions());
    fetchOutgoingInstructions();

    const fetchAccounts = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchAccounts(payload));
    fetchAccounts();
  }, [dispatch, currentEntityGroup]);

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchDropdownValues(payload));
    fetchFormOptions({
      options: ["bankAccountTypes", "currency", "paymentTransferPurpose"],
    });
  }, [dispatch]);

  const handleModifyClick = (data) => {
    setSelectedPaymentInstruction(data);
    setEditModalOpen(true);
  };

  const handleCancelClick = (data) => {
    setSelectedPaymentInstruction(data);
    setCancelModalOpen(true);
  };

  const handleSubmitClick = (data) => {
    setSelectedPaymentInstruction(data);
    setEditModalOpen(true);
  };

  const handleApproveClick = (data) => {
    setSelectedPaymentInstruction(data);
    setApproveModalOpen(true);
  };

  const handleFinalizeClick = (data) => {
    setSelectedPaymentInstruction(data);
    setFinalizeModalOpen(true);
  };

  const handleRejectClick = (data) => {
    setSelectedPaymentInstruction(data);
    setRejectModalOpen(true);
  };

  const handleClientApproveClick = (data) => {
    setSelectedPaymentInstruction(data);
    setClientApproveModalOpen(true);
  };

  const handleApprovePaymentInstructionOnSubmit = () => {
    const payload = {
      instructionId: selectedPaymentInstruction.id,
      requestPayload: {
        status: true,
      },
    };

    dispatch(accountsActionCreators.doApproveOutgoingPaymentInstruction(payload));
  };

  const handleFinalizePaymentInstructionOnSubmit = () => {
    const payload = {
      instructionId: selectedPaymentInstruction.id,
      requestPayload: {
        otp: securityCode,
        status: true,
      },
    };

    dispatch(accountsActionCreators.doFinalizeOutgoingPaymentInstruction(payload));
  };

  const handleRejectPaymentInstructionOnSubmit = () => {
    const payload = {
      instructionId: selectedPaymentInstruction.id,
      requestPayload: {
        status: false,
      },
    };

    if (hasPaymentApproveACL) {
      return dispatch(accountsActionCreators.doApproveOutgoingPaymentInstruction(payload));
    }

    return dispatch(accountsActionCreators.doFinalizeOutgoingPaymentInstruction(payload));
  };

  const handleCancelPaymentInstructionOnSubmit = () => {
    const payload = {
      instructionId: selectedPaymentInstruction.id,
      requestPayload: {
        isCancelled: true,
      },
    };

    dispatch(accountsActionCreators.doUpdateOutgoingPaymentInstruction(payload));
  };

  const handleClientApprovePaymentInstructionOnSubmit = () => {
    const payload = {
      instructionId: selectedPaymentInstruction.id,
      requestPayload: {
        status: true,
      },
    };

    dispatch(accountsActionCreators.doClientApproveOutgoingPaymentInstruction(payload));
  };

  const getActions = (entry) => ({
    handleModifyClick: () => handleModifyClick(entry),
    handleCancelClick: () => handleCancelClick(entry),
    handleSubmitClick: () => handleSubmitClick(entry),
    handleApproveClick: () => handleApproveClick(entry),
    handleRejectClick: () => handleRejectClick(entry),
    handleClientApproveClick: () => handleClientApproveClick(entry),
  });

  const actions = [
    {
      callback: handleModifyClick,
      icon: <EditIcon fontSize="small" />,
      label: t("Payment Instructions.Context Menu.Modify"),
    },

    {
      callback: handleCancelClick,
      icon: <CloseIcon fontSize="small" />,
      label: t("Payment Instructions.Context Menu.Cancel"),
    },
    {
      callback: handleSubmitClick,
      icon: <SendIcon fontSize="small" />,
      label: t("Payment Instructions.Context Menu.Submit"),
    },
    {
      callback: handleApproveClick,
      icon: <DoneIcon fontSize="small" />,
      label: t("Payment Instructions.Context Menu.Approve"),
      disabled: !hasPaymentApproveACL,
    },
    {
      callback: handleFinalizeClick,
      icon: <DoneAllIcon fontSize="small" />,
      label: t("Payment Instructions.Context Menu.Finalize"),
      disabled: !hasPaymentFinalizeACL,
    },
    {
      callback: handleRejectClick,
      icon: <BlockIcon fontSize="small" />,
      label: t("Payment Instructions.Context Menu.Reject"),
      disabled: !hasPaymentApproveACL && !hasPaymentFinalizeACL,
    },
    {
      callback: handleClientApproveClick,
      icon: <BlockIcon fontSize="small" />,
      label: "Client-Approve",
      disabled: !hasPaymentClientApproveACL,
    },
  ];

  const getTableData = () => {
    const entries = [];
    // console.log(paymentInstructions);
    paymentInstructions?.forEach((paymentInstruction) => {
      // if not true then it's assumed that the instruction is initiated by either the CO or the OPS
      const isAdminInitiated = currentUserId !== paymentInstruction.userId;

      entries.push({
        id: paymentInstruction.id,
        accountNo: paymentInstruction.wethaqAccount?.accountNo,
        bank: paymentInstruction.account.bankName,
        bic: paymentInstruction.account?.swift,
        clientBalance: paymentInstruction.wethaqAccount?.accountBalance,
        country: paymentInstruction.account.country
          ? paymentInstruction.account.country.name
          : paymentInstruction.account.countryId,
        currency: paymentInstruction.providerCurrency,
        details: paymentInstruction.details,
        iban: paymentInstruction.account?.iban,
        investor: paymentInstruction.account?.group?.entity?.name,
        payment: paymentInstruction.amount,
        // referenceNo: paymentInstruction.providerTransactionReferenceNumber,
        referenceNo: paymentInstruction.sequenceNumber,
        status: paymentInstruction.status,
        transferPurposeType: paymentInstruction.transferPurposeType?.name,
        transferPurposeTypeId: paymentInstruction.transferPurposeType?.id,
        valueDate: paymentInstruction.valueDate,
        actions: getActions(paymentInstruction),
        userId: paymentInstruction.userId,
        wethaqAccountId: paymentInstruction.wethaqAccount?.id,
        accountId: paymentInstruction.account?.id,
        createdAt: paymentInstruction.createdAt,
        isAdminInitiated,
        intermediaryBankName: paymentInstruction.account?.intermediaryBankName,
        intermediaryBankIBAN: paymentInstruction.account?.intermediaryBankIBAN,
        intermediaryBankBIC: paymentInstruction.account?.intermediaryBankBIC,
        providerBeneficiaryName: paymentInstruction.providerBeneficiaryName,
      });
    });
    return entries;
  };

  const rows = getTableData();

  const transformData = (originalData) => {
    if (!originalData) return {};

    const {
      accountNo,
      clientBalance,
      createdAt,
      valueDate,
      investor,
      payment,
      currency,
      country,
      bank,
      iban,
      bic,
      status,
      transferPurposeType,
      referenceNo,
    } = originalData;

    return {
      accountNo: {
        label: t("Payment Instructions.Headers.Account No"),
        value: accountNo,
      },
      clientBalance: {
        label: t("Payment Instructions.Headers.Client Balance"),
        value: currencyRenderer(clientBalance),
      },
      createdAt: {
        label: t("Payment Instructions.Headers.Created At Date"),
        value: dateRenderer(createdAt),
      },
      valueDate: {
        label: t("Payment Instructions.Headers.Value Date"),
        value: dateRenderer(valueDate),
      },
      investor: {
        label: t("Payment Instructions.Headers.Investor/Owner"),
        value: investor,
      },
      payment: {
        label: t("Payment Instructions.Headers.Payment Amount"),
        value: currencyRenderer(payment),
      },
      currency: {
        label: t("Payment Instructions.Headers.CCY"),
        value: currency,
      },
      country: {
        label: t("Payment Instructions.Headers.Country"),
        value: country,
      },
      bank: {
        label: t("Payment Instructions.Headers.Bank"),
        value: bank,
      },
      iban: {
        label: t("Payment Instructions.Headers.IBAN/Account"),
        value: iban,
      },
      bic: {
        label: t("Payment Instructions.Headers.BIC"),
        value: bic,
      },
      status: {
        label: t("Payment Instructions.Headers.Status"),
        value: status,
      },
      transferPurposeType: {
        label: t("Payment Instructions.Headers.Transfer Purpose"),
        value: transferPurposeType,
      },
      referenceNo: {
        label: t("Payment Instructions.Headers.Reference No"),
        value: referenceNo,
      },
    };
  };

  const transformedData = rows.map((d) => transformData(d));

  const listOfRowValues = [];
  const listOfColumnNames = [];

  transformedData.forEach((td) => {
    const rowsList = [];
    const columnsList = [];
    Object.entries(td)
      .filter(([, { hidden }]) => !hidden)
      .forEach(([, { label, value }]) => {
        rowsList.push(value);
        columnsList.push(label);
      });
    listOfRowValues.push(rowsList);
    listOfColumnNames.push(columnsList);
  });

  const handleExportToCSV = () => {
    const csv = new CsvBuilder("external_payments.csv")
      .setColumns(listOfColumnNames[0])
      .addRows(listOfRowValues)
      .addRow([""]);
    // exportFilters.map((filter) => {
    //   csv.addRow([filter.label, filter.value]);
    //   return false;
    // });
    csv.exportFile();
  };

  if (isFetching) return <LoadingPage />;

  return (
    <Fragment>
      <Grid container alignItems="center">
        <Grid container lg={3}>
          <PageTitle title={t("PaymentAccountManagement.ManagePaymentAccountsPage.PageTitle")} />
        </Grid>

        <Grid container alignItems="flex-start" justifyContent="flex-end" spacing={2} lg={9}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                handleExportToCSV(rows);
              }}
              color="primary"
              disabled={rows.length === 0}
            >
              <strong>Export to CSV</strong>
            </Button>
          </Grid>

          {hasPaymentClientInitializeACL && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setAddModalOpen(true);
                }}
              >
                {t("Payment Instructions.New Payment Instructions")}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>

      <PaymentInstructionsTable
        data={rows}
        actions={actions}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
      />
      <AddPaymentInstructionDialog
        isModalOpen={addModalOpen}
        options={options}
        setIsModalOpen={setAddModalOpen}
      />
      <EditPaymentInstructionDialog
        instructionId={selectedRow?.id}
        initialValues={generateInitialValues(selectedRow, options)}
        isModalOpen={editModalOpen}
        setIsModalOpen={setEditModalOpen}
        options={options}
        disabled={
          ![
            PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Initiated,
            PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Rejected,
          ].includes(selectedRow?.status)
        }
      />

      <ValidatePaymentInstructionDialog
        dialogTitle={t("Payment Instructions.Context Menu.Approve")}
        formLabel={t("Payment Instructions.ApproveDialog.label", {
          currency: selectedRow?.currency,
          payment_amount: selectedRow?.payment,
        })}
        isModalOpen={approveModalOpen}
        setIsModalOpen={setApproveModalOpen}
        handleSubmit={handleApprovePaymentInstructionOnSubmit}
        disabled={
          ![PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Initiated].includes(selectedRow?.status)
        }
      />

      <ValidatePaymentInstructionDialog
        dialogTitle={t("Payment Instructions.Context Menu.Finalize")}
        formLabel={t("Payment Instructions.FinalizeDialog.label", {
          currency: selectedRow?.currency,
          payment_amount: selectedRow?.payment,
        })}
        isModalOpen={finalizeModalOpen}
        setIsModalOpen={setFinalizeModalOpen}
        handleSubmit={handleFinalizePaymentInstructionOnSubmit}
        disabled={
          ![PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Approved].includes(selectedRow?.status) ||
          securityCode?.length !== 6
        } // or when security code isn't true
        setSecurityCode={setSecurityCode}
        isViewSecurityCodeInput={[PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Approved].includes(
          selectedRow?.status
        )} // shows the otp input in dialog only when status is Approved
      />

      <ValidatePaymentInstructionDialog
        dialogTitle={t("Payment Instructions.Context Menu.Reject")}
        formLabel={t("Payment Instructions.RejectDialog.label", {
          currency: selectedRow?.currency,
          payment_amount: selectedRow?.payment,
        })}
        isModalOpen={rejectModalOpen}
        setIsModalOpen={setRejectModalOpen}
        handleSubmit={handleRejectPaymentInstructionOnSubmit}
        disabled={
          hasPaymentApproveACL
            ? ![PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Initiated].includes(selectedRow?.status)
            : ![PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Approved].includes(selectedRow?.status)
        }
      />
      <ValidatePaymentInstructionDialog
        dialogTitle={t("Payment Instructions.Context Menu.Cancel")}
        formLabel={t("Payment Instructions.CancelDialog.label", {
          currency: selectedRow?.currency,
          payment_amount: selectedRow?.payment,
        })}
        isModalOpen={cancelModalOpen}
        setIsModalOpen={setCancelModalOpen}
        handleSubmit={handleCancelPaymentInstructionOnSubmit}
        disabled={
          [PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Cancelled].includes(selectedRow?.status) ||
          ![
            PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Initiated,
            PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM.Rejected,
          ].includes(selectedRow?.status)
        }
      />
      <ValidatePaymentInstructionDialog
        dialogTitle="Client-Approve"
        formLabel={t("Payment Instructions.ApproveDialog.label", {
          currency: selectedRow?.currency,
          payment_amount: selectedRow?.payment,
        })}
        isModalOpen={clientApproveModalOpen}
        setIsModalOpen={setClientApproveModalOpen}
        handleSubmit={handleClientApprovePaymentInstructionOnSubmit}
        disabled={
          ![PAYMENT_INSTRUCTION_INTERNAL_STATUS_ENUM["Client Approval"]].includes(
            selectedRow?.status
          )
        }
      />
    </Fragment>
  );
};

export default PaymentInstructionsPage;
