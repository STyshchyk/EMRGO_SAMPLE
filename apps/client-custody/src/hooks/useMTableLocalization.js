// import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

function useMaterialTableLocalization() {
  const { t } = useTranslation(["components"]);

  const localization = {
    pagination: {
      //**use one of the two texts */
      // labelDisplayedRows: t("Material Table.pagination.rows"),
      labelDisplayedRows: t("Material Table.pagination.Displayed Rows"),
      firstTooltip: t("Material Table.pagination.First Page"),
      previousTooltip: t("Material Table.pagination.Previous Page"),
      nextTooltip: t("Material Table.pagination.Next Page"),
      lastTooltip: t("Material Table.pagination.Last Page"),
    },
    header: {
      actions: t("Material Table.header.actions"),
    },
    body: {
      emptyDataSourceMessage: t("Material Table.body.No records to display"),
    },
    toolbar: {
      searchPlaceholder: t("Material Table.toolbar.Search"),
      searchTooltip: t("Material Table.toolbar.Search"),
    },
  };

  return localization;
}

export default useMaterialTableLocalization;
