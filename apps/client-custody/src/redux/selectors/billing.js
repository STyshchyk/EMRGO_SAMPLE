export const selectIsLoading = (state) => state.billing?.isLoading;
export const selectRateCards = (state) => state.billing?.ratecards;
export const selectCurrentRateCard = (state) => state.billing?.currentRatecard;
export const selectInvoices = (state) => state.billing?.invoices;
export const selectCurrentInvoice = (state) => state.billing?.currentInvoice;
export const selectTotalInvoiceAmount = (state) => state.billing?.calculatedTotalInvoiceAmount;
