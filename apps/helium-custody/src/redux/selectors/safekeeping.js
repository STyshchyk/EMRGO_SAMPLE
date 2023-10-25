import { createSelector } from "reselect";





export const readAccounts = (state) => state.safekeeping.accounts;
export const readAccountAuditLogs = (state) => state.safekeeping.accountAuditLogs;