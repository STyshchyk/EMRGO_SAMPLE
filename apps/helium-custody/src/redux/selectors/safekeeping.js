import { createSelector } from "reselect";

export const readAccountsKeep = (state) => state.safekeeping.accounts;
export const readAccounts = createSelector([readAccountsKeep], (safeAccounts) => {
  if (safeAccounts && Array.isArray(safeAccounts)) {
    return safeAccounts.filter((account) => account.status === "Active");
  }
  return [];
});
export const readAccountAuditLogs = (state) => state.safekeeping.accountAuditLogs;
