import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";
import UpdateIcon from "@mui/icons-material/Update";
import VisibilityIcon from "@mui/icons-material/Visibility";

import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as billingAndPaymentsActionCreators from "../../redux/actionCreators/cashManagement";
import * as authSelectors from "../../redux/selectors/auth";
import * as billingAndPaymentsSelectors from "../../redux/selectors/cashManagement";
import AssignAccountModal from "../BillingAndPayments/AssignAccountModal";
import IncomingPaymentsTable from "../BillingAndPayments/IncomingPaymentsTable";
import MoveToSuspenseModal from "../BillingAndPayments/MoveToSuspenseModal";
import ReleaseFundsModal from "../BillingAndPayments/ReleaseFundsModal";
import ViewTransactionDetailsModal from "../BillingAndPayments/ViewTransactionDetailsModal";

//! NOT USED
const IncomingTable = () => {
  const { t } = useTranslation(["cash_management"]);

  const dispatch = useDispatch();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [moveToSuspenseModalOpen, setMoveToSuspenseModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  // selectors
  const accounts = useSelector(billingAndPaymentsSelectors.selectAccounts);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentUserId = useSelector(authSelectors.selectUserId);

  const unallocatedTransfers = useSelector(
    billingAndPaymentsSelectors.selectUnallocatedTransactions
  );
  const isFetchingTransfers = useSelector(billingAndPaymentsSelectors.selectFetchingTransfers);
  const currentEntityGroupID = currentEntityGroup?.id;

  const fetchAccounts = useCallback(
    (payload) => dispatch(billingAndPaymentsActionCreators.doFetchAccounts(payload)),
    [dispatch]
  );
  const fetchUnallocatedTransactions = useCallback(
    (payload) => dispatch(billingAndPaymentsActionCreators.doFetchUnallocatedTransactions(payload)),
    [dispatch]
  );

  useEffect(() => {
    fetchAccounts();
    fetchUnallocatedTransactions();
  }, [fetchAccounts, fetchUnallocatedTransactions]);

  const handleAssignAccount = (payload) => {
    dispatch(billingAndPaymentsActionCreators.doUpdateUnallocatedTransactions(payload));
  };

  const handleRelease = (payload) => {
    const requestPayload = { cb: fetchUnallocatedTransactions, ...payload };
    dispatch(billingAndPaymentsActionCreators.doMoneyTransfer(requestPayload));
  };

  const handleMoveToSuspense = (payload) => {
    const requestPayload = { cb: fetchUnallocatedTransactions, ...payload };
    dispatch(billingAndPaymentsActionCreators.doMoneyTransfer(requestPayload));
  };

  const handlePaymentDetailsClick = (row) => {
    setSelectedTransaction(row);
    setViewModalOpen(true);
  };

  const handleReleaseClick = (row) => {
    setSelectedTransaction(row);
    setReleaseModalOpen(true);
  };

  const handleAssignAccountClick = (row) => {
    setSelectedTransaction(row);
    setAddModalOpen(true);
  };

  const handleViewEvidenceClick = (row) => {
    setSelectedTransaction(row);
    // setEditModalOpen(true);
  };

  const handleMoveToSuspenseClick = (row) => {
    setSelectedTransaction(row);
    setMoveToSuspenseModalOpen(true);
  };

  const actions = [
    {
      callback: handlePaymentDetailsClick,
      icon: <DescriptionIcon fontSize="small" />,
      label: t("Incoming Payments.Context Menu.Payment Details"),
    },
    {
      callback: handleAssignAccountClick,
      icon: <AssignmentIndIcon fontSize="small" />,
      label: t("Incoming Payments.Context Menu.Assign Account"),
      disabled: selectedRow.assignedAccountId,
    },
    {
      callback: handleViewEvidenceClick,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("Incoming Payments.Context Menu.View Evidence"),
      disabled: true,
    },
    {
      callback: handleMoveToSuspenseClick,
      icon: <UpdateIcon fontSize="small" />,
      label: t("Incoming Payments.Context Menu.Move to Suspense"),
    },
    {
      callback: handleReleaseClick,
      icon: <SendIcon fontSize="small" />,
      label: t("Incoming Payments.Context Menu.Release"),
      disabled: !selectedRow.assignedAccountId || selectedRow.approver1 === currentUserId,
    },
  ];

  const getEntities = (accs) => {
    const entries = [];
    const pushed = [];
    accs.forEach((acc) => {
      if (pushed.indexOf(acc.group.id) === -1) {
        entries.push({
          id: acc.group.id,
          label: acc.group.entity.corporateEntityName,
          value: acc.group.id,
        });
        pushed.push(acc.group.id);
      }
    });
    return entries;
  };

  const getTableData = (transfers) => {
    const entries = [];
    transfers.forEach((transfer) => {
      entries.push({
        id: transfer.id,
        valueDate: transfer.valueDate,
        entryDate: transfer.entryDate,
        bankAccNo: transfer.bankAccountNumber,
        currency: transfer.currency,
        amount: transfer.amount,
        transactionType: transfer.transactionType,
        customerRef: transfer.customerReference,
        bankRef: transfer.bankReference,
        supplementary: transfer.supplementary,
        assignedClient: transfer?.assignedEntityGroup?.entity?.corporateEntityName,
        assignedAccountNo: transfer?.assignedAccount?.accountNo,
        detailSegments: transfer?.detailSegments,
        sourceAccount: transfer?.sourceAccount,
        assignedAccount: transfer?.assignedAccount,
        assignedAccountId: transfer?.assignedAccountId,
        approver1: transfer?.approver1,
        approver2: transfer?.approver2,
      });
    });
    return entries;
  };

  const rows = getTableData(unallocatedTransfers);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchDropdownValues(payload));
    fetchFormOptions({
      options: ["bankAccountTypes", "currency"],
    });
  }, [dispatch]);

  const dropdownValues = useSelector(billingAndPaymentsSelectors.selectDropDowns);
  const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];
  const currency = dropdownValues ? dropdownValues?.currency || [] : [];
  const entities = getEntities(accounts);

  const suspenseAccounts = accounts.filter((account) => account.type === "SUSPENSE");

  return (
    <Fragment>
      <IncomingPaymentsTable
        loading={isFetchingTransfers}
        data={rows}
        actions={actions}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
      />
      <ViewTransactionDetailsModal
        isModalOpen={viewModalOpen}
        setIsModalOpen={setViewModalOpen}
        selectedTransaction={selectedTransaction}
      />
      <ReleaseFundsModal
        isModalOpen={releaseModalOpen}
        setIsModalOpen={setReleaseModalOpen}
        selectedTransaction={selectedTransaction}
        handleRelease={handleRelease}
      />
      <MoveToSuspenseModal
        isModalOpen={moveToSuspenseModalOpen}
        setIsModalOpen={setMoveToSuspenseModalOpen}
        selectedTransaction={selectedTransaction}
        suspenseAccounts={suspenseAccounts}
        handleMoveToSuspense={handleMoveToSuspense}
      />
      <AssignAccountModal
        selectedTransaction={selectedTransaction}
        isModalOpen={addModalOpen}
        options={{ currency, bankAccountTypes, entities }}
        setIsModalOpen={setAddModalOpen}
        handleAssignAccount={handleAssignAccount}
      />
    </Fragment>
  );
};

export default IncomingTable;
