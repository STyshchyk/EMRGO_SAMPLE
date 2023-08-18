import { baseAxiosInstance } from "./helpers";

const getInternalTransactions = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/payments/v1/journals/internal-transactions`,
  });

const updateInternalTransactionByJournalId = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/payments/v1/journals/internal-transactions/${payload.journalId}`,
    data: payload.requestPayload,
  });

const journalsAPI = {
  getInternalTransactions,
  updateInternalTransactionByJournalId,
};

export default journalsAPI;
