import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { snakeCase, capitalCase } from "change-case";
import { CsvBuilder } from "filefy";
import moment from "moment";

import { reportDateRenderer } from "../../../constants/renderers";
import { useFilters } from "../../../context/filter-context";
import * as authSelectors from "../../../redux/selectors/auth";
import * as cashManagementSelectors from "../../../redux/selectors/cashManagement";
import * as reportsSelectors from "../../../redux/selectors/reports";
import formatAddress from "../../../utils/reports";
import ExportTableContent from "../../PDFExporter/ExportTableContent";
import ReportingTablePDFExporter from "../../ReportingTablePDFExporter";

const ExportButtons = ({ tableRef, name }) => {
  let entityAddress;
  const fileName = snakeCase(name);
  const [dataCount, setDataCount] = useState(
    tableRef?.current?.dataManager?.filteredData.length || 0
  );
  const [tableData, setTableData] = useState(tableRef?.current?.dataManager?.filteredData);

  useEffect(() => {
    setTableData(tableRef?.current?.dataManager?.filteredData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTableData, tableRef?.current?.dataManager?.filteredData]);

  const childRef = useRef();
  const { t } = useTranslation(["miscellaneous"]);

  const userFullName = useSelector(authSelectors.selectUserFullName);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const currentCorporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);
  const securitiesAccounts = useSelector(reportsSelectors.selectSecuritiesAccounts);
  const cashManagementSecuritiesAccounts = useSelector(cashManagementSelectors.selectAccounts);
  const cashAccounts = useSelector(reportsSelectors.selectCashAccounts);

  const filterContext = useFilters();
  const { filterColumns, filters, allColumns } = filterContext;
  const { shownColumns } = filterColumns;

  const hashMap = new Map();
  filterColumns?.shownColumns.map(({ field }) => hashMap.set(field, field));

  if (securitiesAccounts.length || cashManagementSecuritiesAccounts.length) {
    const accounts =
      securitiesAccounts.length !== 0 ? securitiesAccounts : cashManagementSecuritiesAccounts;
    entityAddress = accounts?.filter(
      (account) => account?.group?.entity?.corporateEntityName === filters?.entity?.value?.label
    )[0];
  } else {
    entityAddress = cashAccounts?.filter(
      (account) => account?.group?.entity?.corporateEntityName === filters?.entity?.value?.label
    )[0];
  }

  const generateCashAccountName = () => {
    const { account: cashAccount } = filters;
    const caccount = cashAccount?.value?.data?.original.accountNo ?? null;
    const cname = capitalCase(cashAccount?.value?.data?.original.type) ?? null;

    if (caccount || cname) {
      const accountNameValue = `${caccount} | ${cname}`;
      return accountNameValue;
    }
    return null;
  };

  const processTableData = () => {
    const rows = [...tableRef?.current?.dataManager?.filteredData]?.map((rowData) => {
      const row = [];
      shownColumns.forEach((column) => {
        const foundData = column?.exportConfig?.render
          ? column?.exportConfig?.render(rowData)
          : rowData[column.field];
        row.push(foundData || "");
      });
      return row;
    });

    return rows;
  };

  const pdfColumns = shownColumns.map((shownColumn) => {
    const found = allColumns.find((column) => column.field === shownColumn.field);
    return found;
  });

  const exportPDF = (e) => {
    e.stopPropagation();
    if (tableData.length === 0) {
      const emptyData = {};
      pdfColumns.forEach((column) => {
        emptyData[column.id] = column.id === "balance" ? "0" : "-";
      });
      setTableData([emptyData]);
    }
    setDataCount(tableRef?.current?.dataManager?.filteredData.length || 1);
    setTimeout(() => {
      childRef.current.exportFile();
      // setTableData([]); // wdifc bug 562/569/536
    }, 1000);
  };

  const fetchFilterValue = (value, type) => {
    let exportedText = "";
    switch (type) {
      case "date":
        exportedText = moment(value).format("DD/MM/YYYY");
        break;
      case "dropdown":
        exportedText = value.label;
        break;
      case "text":
        exportedText = value;
        break;
      case "checkbox":
        exportedText = value;
        break;
      case "daterange":
        exportedText = `${
          value?.startDate
            ? moment(value?.startDate).format("DD/MM/YYYY")
            : moment().format("DD/MM/YYYY")
        } - ${
          value?.endDate
            ? moment(value?.endDate).format("DD/MM/YYYY")
            : moment().format("DD/MM/YYYY")
        }`;
        break;

      default:
        break;
    }

    return exportedText;
  };

  const processFilters = () => {
    const filterConfig = [];
    Object.entries(filters).forEach(([key, filter]) => {
      // remove this if condition if can set range as today date
      if (key === "daterange" && filter.value.startDate == null && filter.value.endDate == null) {
        // pdf was showing invalid date
        return;
      }

      filterConfig.push({
        key,
        label: filter.label,
        value: fetchFilterValue(filter.value, filter.type),
      });
    });

    return filterConfig;
  };

  const processMeta = () => {
    const exportFilters = processFilters();
    const exportConfig = [
      {
        label: t("miscellaneous:Export.Export Date"),
        value: reportDateRenderer(),
      },
      {
        label: "Generated By",
        value: `${userFullName} - ${capitalCase(currentEntityType)}, ${currentCorporateEntityName}`,
      },
      ...exportFilters,
      {
        label: "Account Name",
        value: generateCashAccountName(),
      },
      {
        label: "Address",
        value: entityAddress?.group?.addresses
          ? formatAddress(entityAddress?.group?.addresses)
          : null,
      },
    ];

    const filteredExportConfig = exportConfig.filter((v) => !!v.value);

    return filteredExportConfig;
  };

  const exportCSV = (e) => {
    e.stopPropagation();
    if (shownColumns) {
      // Creating file
      const csv = new CsvBuilder(`${fileName}.csv`);
      // Adding Filters
      csv.addRow(["Filters"]);
      const exportFilters = processMeta();
      exportFilters.map((filter) => {
        csv.addRow([filter.label, filter.value]);
        return false;
      });

      csv.addRow([""]).addRow([""]);

      // Adding Headers
      csv.addRow(shownColumns.map((header) => header.title));

      // Adding Data
      const processedData = processTableData();

      if (processedData.length === 0) {
        const emptyRow = [];
        shownColumns.forEach((column) => {
          const value = column.id === "balance" ? "0" : "-";
          emptyRow.push(value);
        });
        csv.addRow(emptyRow);
      } else {
        csv.addRows(processedData);
      }

      // Export
      csv.exportFile();
    }
  };

  const pdfFilters = processMeta();

  return (
    <Box mt={4} mb={1}>
      <Grid container className="h-full" alignContent="flex-end" spacing={2}>
        <Grid item xs={6}>
          <Button
            size="large"
            variant="contained"
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
            size="large"
            variant="contained"
            fullWidth
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={exportPDF}
          >
            PDF
          </Button>
        </Grid>
      </Grid>
      <ReportingTablePDFExporter ref={childRef} title={name}>
        <ExportTableContent
          key={dataCount}
          columns={pdfColumns}
          tableOptions={{
            sliceRowCount: 4,
            tableOffset: 3,
          }}
          data={tableData}
          filters={pdfFilters}
          title={name}
        />
      </ReportingTablePDFExporter>
    </Box>
  );
};

export default ExportButtons;
