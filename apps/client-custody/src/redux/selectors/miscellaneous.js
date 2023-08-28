import { createSelector } from "reselect";

const selectIsFetchingDocument = (state) => state.miscellaneous.isFetchingDocument;
const selectDocumentLink = (state) => state.miscellaneous.documentLink;
const selectDocumentName = (state) => state.miscellaneous.documentName;
const selectStaticFileLink = (state) => state.miscellaneous.fileLink;
const selectAllTableConfig = (state) => state.miscellaneous.tableConfig;

const selectTableConfig = createSelector(
  [selectAllTableConfig, (state, tableKey) => tableKey],
  // Output selector gets (`items, category)` as args
  (items, tableKey) => items && items.find((item) => item.key === tableKey) || null
);

export default selectDocumentLink;
export {
  selectIsFetchingDocument,
  selectDocumentLink,
  selectDocumentName,
  selectStaticFileLink,
  selectAllTableConfig,
  selectTableConfig
};
