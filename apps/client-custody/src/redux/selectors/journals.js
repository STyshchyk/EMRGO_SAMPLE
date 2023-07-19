import { createSelector } from 'reselect';

export const selectInternalTransactions = (state) => state.journals.internalTransactionsData;

export const selectIsFetching = (state) => state.fxTransactions.isFetching;
export const selectIsRequesting = (state) => state.fxTransactions.isRequesting;

export const selectInternalTransfersList = createSelector([selectInternalTransactions], (internalTransactionsData) => {
  const internalTransfersList = [];

  if (Array.isArray(internalTransactionsData) && internalTransactionsData.length > 0) {
    const listOfJournalIds = [...new Set(internalTransactionsData.map((i) => i.journalId))];

    listOfJournalIds.forEach((i) => {
      const journalEntries = internalTransactionsData.filter(({ journalId }) => i === journalId);

      const debitTx = journalEntries.find(({ transactionType }) => transactionType === 'D');
      const creditTx = journalEntries.find(({ transactionType }) => transactionType === 'C');

      const common = {
        id: i, // !journalId
        currency: debitTx?.account?.currency,
        date: debitTx?.date,
        description: debitTx?.description,
        journalStatus: debitTx?.journalStatus,
        transferAmount: debitTx?.amount,
        createdByUser: debitTx?.createdByUser ? `${debitTx?.createdByUser?.firstName} ${creditTx?.createdByUser?.lastName}` : null,
        approvedByUser: debitTx?.approvedByUser ? `${debitTx?.approvedByUser?.firstName} ${creditTx?.approvedByUser?.lastName}` : null,
        amendedByUser: debitTx?.amendedByUser ? `${debitTx?.amendedByUser?.firstName} ${creditTx?.amendedByUser?.lastName}` : null,
        approvedAt: debitTx?.approvedAt,
      };

      const sourceAccountDetails = {
        sourceAccountId: debitTx?.account?.id,
        sourceEntityId: debitTx?.account?.group?.entity?.id,
        sourceAccountOwner: debitTx?.account?.group?.entity?.corporateEntityName,
        sourceAccountNumber: debitTx?.account?.accountNo,
        sourceAccountBalance: debitTx?.account?.accountBalance,
        sourceAccountType: debitTx?.account?.type,
        sourceJournalLine: debitTx?.journalLine,
        sourceTransactionType: debitTx?.transactionType,
      };

      const destinationAccountDetails = {
        destinationAccountId: creditTx?.account?.id,
        destinationEntityId: creditTx?.account?.group?.entity?.id,
        destinationAccountOwner: creditTx?.account?.group?.entity?.corporateEntityName,
        destinationAccountNumber: creditTx?.account?.accountNo,
        destinationAccountBalance: creditTx?.account?.accountBalance,
        destinationAccountType: creditTx?.account?.type,
        destinationJournalLine: creditTx?.journalLine,
        destinationTransactionType: creditTx?.transactionType,
      };

      internalTransfersList.push({
        ...common,
        ...sourceAccountDetails,
        ...destinationAccountDetails,
      });
    });

    return internalTransfersList;
  }

  return internalTransfersList;
});
