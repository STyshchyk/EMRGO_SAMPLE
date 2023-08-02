import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingPage from "../../components/LoadingPage";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as accountsActionCreators from "../../redux/actionCreators/accounts";
import * as accountsSelectors from "../../redux/selectors/accounts";
import * as authSelectors from "../../redux/selectors/auth";
import ReconciliationTable, { generateReconciliationTableRowData } from "./ReconciliationTable";

const MOCK_DATA = [
  {
    id: "4ef7b9c3-a5f8-4eb6-b903-8b44fda71549",
    valueDate: "2021-11-28T00:00:00.000Z",
    entryDate: "2021-11-28T00:00:00.000Z",
    bankAccountNumber: "0108050053560021",
    currency: "SAR",
    transactionType: "NTRF",
    customerReference: "RG test",
    bankReference: "5274854318-مدفوع",
    supplementary: null,
    detailSegments: "SDC492770",
    amount: "1000000.00",
    assignedAccountId: null,
    sourceAccountId: "b0c7a633-2230-4aa9-b4d9-7c5b251e7c22",
    hasPaymentReleased: false,
    createdAt: "2021-12-03T08:45:12.701Z",
    updatedAt: "2021-12-03T08:45:12.497Z",
    assignedEntityGroupId: null,
    assignedEntityGroup: null,
    assignedAccount: null,
    sourceAccount: {
      id: "b0c7a633-2230-4aa9-b4d9-7c5b251e7c22",
      accountBalance: "30000000.00",
      createdAt: "2021-09-21T15:07:54.764Z",
      updatedAt: "2021-09-21T15:07:54.764Z",
      entityGroupId: "cc566fd6-b731-44d5-84ea-45e2bb82cd9c",
      currencyId: "ef355c7f-81fb-4365-9d43-c50a1d850b0b",
      isVirtualIBAN: true,
      iban: "BH70BZWQ6E828825457014",
      accountNo: "8999993",
      type: "UNALLOCATED_CLIENT_ACCOUNT",
      isActive: true,
      isArchived: false,
      lastStatementFetchDate: null,
      externalAccountNumber: null,
    },
  },
  {
    id: "d7a937e6-11e9-43dc-91bc-34383a2a5fb2",
    valueDate: "2021-11-28T00:00:00.000Z",
    entryDate: "2021-11-28T00:00:00.000Z",
    bankAccountNumber: "0108050053560021",
    currency: "SAR",
    transactionType: "NTRF",
    customerReference: "RG test",
    bankReference: "5274854318-مدفوع",
    supplementary: null,
    detailSegments: "SDC492769",
    amount: "1000000.00",
    assignedAccountId: null,
    sourceAccountId: "b0c7a633-2230-4aa9-b4d9-7c5b251e7c22",
    hasPaymentReleased: false,
    createdAt: "2021-12-03T08:45:12.693Z",
    updatedAt: "2021-12-03T08:45:12.497Z",
    assignedEntityGroupId: null,
    assignedEntityGroup: null,
    assignedAccount: null,
    sourceAccount: {
      id: "b0c7a633-2230-4aa9-b4d9-7c5b251e7c22",
      accountBalance: "30000000.00",
      createdAt: "2021-09-21T15:07:54.764Z",
      updatedAt: "2021-09-21T15:07:54.764Z",
      entityGroupId: "cc566fd6-b731-44d5-84ea-45e2bb82cd9c",
      currencyId: "ef355c7f-81fb-4365-9d43-c50a1d850b0b",
      isVirtualIBAN: true,
      iban: "BH70BZWQ6E828825457014",
      accountNo: "8999993",
      type: "UNALLOCATED_CLIENT_ACCOUNT",
      isActive: true,
      isArchived: false,
      lastStatementFetchDate: null,
      externalAccountNumber: null,
    },
  },
];

const Reconciliation = () => {
  const dispatch = useDispatch();

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const isFetching = useSelector(accountsSelectors.selectIsFetching);
  const reconciledTransactions = useSelector(accountsSelectors.selectReconciledTransactions);

  const generatedTableData = reconciledTransactions.map((i) =>
    generateReconciliationTableRowData(i)
  );

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchReconciledTransactionsData = () =>
      dispatch(accountsActionCreators.doFetchReconciledTransactions());

    fetchReconciledTransactionsData();
  }, [dispatch]);

  if (isFetching) {
    return <LoadingPage />;
  }

  return <ReconciliationTable data={generatedTableData} />;
};

export default Reconciliation;
