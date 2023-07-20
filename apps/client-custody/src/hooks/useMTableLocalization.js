// import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

function useMaterialTableLocalization() {
  const { t } = useTranslation(["components"]);

  const localization = {
    pagination: {
      labelDisplayedRows: t("components:Material Table.pagination.Displayed Rows"),
      firstTooltip: t("components:Material Table.pagination.First Page"),
      previousTooltip: t("components:Material Table.pagination.Previous Page"),
      nextTooltip: t("components:Material Table.pagination.Next Page"),
      lastTooltip: t("components:Material Table.pagination.Last Page"),
      labelRowsSelect: t("components:Material Table.pagination.rows"),
    },
    header: {
      actions: t("components:Material Table.header.actions"),
    },
    body: {
      emptyDataSourceMessage: t("components:Material Table.body.No records to display"),
    },
    toolbar: {
      searchPlaceholder: t("components:Material Table.toolbar.Search"),
      searchTooltip: t("components:Material Table.toolbar.Search"),
    },
  };

  return localization;
}

export default useMaterialTableLocalization;
