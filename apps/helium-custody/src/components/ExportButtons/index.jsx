import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { CsvBuilder } from "filefy";

import { useFilters } from "../../context/filter-context";
import { getCsvData, removeCommas } from "../../helpers/table";

const ExportButtons = forwardRef(({ tableKey, exportData = {}, hideExportButtons }, ref) => {
  const { t } = useTranslation(["counterparty"]);
  const { exportFilters, transformedData } = exportData;

  const filterContext = useFilters();
  const { filterColumns } = filterContext;

  // to remove properties from csv file
  const removeHiddenProperties = (arr = [], properties = {}) =>
    arr.map((i) => {
      const newItem = {};
      Object.keys(i).map((key) => {
        if (properties.has(key)) {
          newItem[key] = i[key];
        }
        return null;
      });
      return newItem;
    });

  // const listOfHeaderColumnNames = ['', '', '', '', t('Counterparty SSI.Headers.DeliveryOrReceive Agent'), '', t('Counterparty SSI.Headers.SellerOrBuyer'), '', ''];
  // ['counterparty', 'ssiLabel', 'settlementLocation', 'deliveryOrReceiveAgentIdType', 'deliveryOrReceiveIdentifier', 'sellerOrBuyerIdType', 'sellerOrBuyerIdentifier', 'safekeepingAccount', 'status']

  const hashMap = new Map();
  filterColumns?.shownColumns.map(({ field }) => hashMap.set(field, field));

  // Improve this - repetitive on table.js
  // used on csv
  const listOfHeaderColumnNames = filterColumns?.shownColumns.map(({ field }, i) => {
    if (field === "deliveryOrReceiveAgentIdType") {
      if (hashMap.has("deliveryOrReceiveIdentifier")) {
        return t("Counterparty SSI.Headers.DeliveryOrReceive Agent");
      }
      return t("Counterparty SSI.Headers.DeliveryOrReceive Agent");
    }

    if (field === "deliveryOrReceiveIdentifier") {
      if (hashMap.has("deliveryOrReceiveAgentIdType")) {
        return null;
      }
      return t("Counterparty SSI.Headers.DeliveryOrReceive Agent");
    }

    if (field === "sellerOrBuyerIdType") {
      if (hashMap.has("sellerOrBuyerIdentifier")) {
        return t("Counterparty SSI.Headers.SellerOrBuyer");
      }

      return t("Counterparty SSI.Headers.SellerOrBuyer");
    }

    if (field === "sellerOrBuyerIdentifier") {
      if (hashMap.has("sellerOrBuyerIdType")) {
        return null;
      }

      return t("Counterparty SSI.Headers.SellerOrBuyer");
    }

    return "";
  });

  const result = removeHiddenProperties(transformedData, hashMap);

  const { listOfColumnNames, listOfRowValues } = getCsvData(result);

  const exportPDF = (e) => {
    e.stopPropagation();
    ref.current.exportFile();
  };

  const exportCSV = (e) => {
    e.stopPropagation();
    if (listOfColumnNames && listOfRowValues) {
      let csv;
      let filteredListRowValue = listOfRowValues.map((elem) => removeCommas(elem));
      if (tableKey === "ssiTable") {
        csv = new CsvBuilder("counterparty_ssi.csv")
          .addRow(listOfHeaderColumnNames)
          .addRow(listOfColumnNames[0])
          .addRows(filteredListRowValue)
          .addRow([""])
          .addRow([""])
          .addRow(["Filters"]);
      } else
        csv = new CsvBuilder(`${tableKey}.csv`)
          .setColumns(listOfColumnNames[0])
          .addRows(filteredListRowValue)
          .addRow([""])
          .addRow([""])
          .addRow(["Filters"]);

      exportFilters.map((filter) => {
        csv.addRow([filter.label, filter.value]);
        return false;
      });
      csv.exportFile();
    }
  };

  return (
    !hideExportButtons && (
      <>
        <Grid item xs={6}>
          <Button
            variant="contained"
            disabled={transformedData?.length === 0}
            fullWidth
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={exportCSV}
          >
            CSV
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            variant="contained"
            disabled={transformedData?.length === 0}
            fullWidth
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={exportPDF}
          >
            PDF
          </Button>
        </Grid>
      </>
    )
  );
});

export default ExportButtons;
