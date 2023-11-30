import React, { useState } from "react";
// import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { CsvBuilder } from "filefy";

import { currencyRenderer, dateRenderer } from "../../constants/renderers";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";

const IncomingPaymentsTable = ({
  data,
  actions,
  setSelectedRow,
  selectedRow,
  loading,
  enableExportToCSV,
}) => {
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["cash_management"]);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const isTableDataNotEmpty = Array.isArray(data) && data.length > 0;

  const headCells = [
    {
      id: "valueDate",
      title: t("Incoming Payments.Headers.Value Date"),
      field: "valueDate",
      render: (rowData) => dateRenderer(rowData.valueDate),
    },
    {
      id: "entryDate",
      title: t("Incoming Payments.Headers.Entry Date"),
      field: "entryDate",
      render: (rowData) => dateRenderer(rowData.valueDate),
    },
    {
      id: "bankAccNo",
      title: t("Incoming Payments.Headers.Account No"),
      field: "bankAccNo",
    },
    {
      id: "currency",
      title: t("Incoming Payments.Headers.Currency"),
      field: "currency",
    },
    {
      id: "amount",
      title: t("Incoming Payments.Headers.Amount"),
      field: "amount",
      render: (rowData) => currencyRenderer(rowData.amount),
      type: "numeric",
    },
    {
      id: "transactionType",
      title: t("Incoming Payments.Headers.Transaction Type"),
      field: "transactionType",
    },
    {
      id: "customerRef",
      title: t("Incoming Payments.Headers.Customer Ref"),
      field: "customerRef",
    },
    {
      id: "bankRef",
      title: t("Incoming Payments.Headers.Bank Ref"),
      field: "bankRef",
    },
    {
      id: "supplementary",
      title: t("Incoming Payments.Headers.Supplementary"),
      field: "supplementary",
    },
    {
      id: "assignedClient",
      title: t("Incoming Payments.Headers.Assigned Client"),
      field: "assignedClient",
    },
    {
      id: "assignedAccount",
      title: t("Incoming Payments.Headers.Assigned Account"),
      field: "assignedAccountNo",
    },
  ];

  const handleExportToCSV = (tableData) => {
    const generatedAtTimestamp = new Date().toISOString();
    const csvFileName = `incoming_payments_${generatedAtTimestamp}.csv`;

    const listOfLocalizedColumnNames = headCells.map(({ title }) => title);
    // const orderedListOfFieldNames = headCells.map(({ field }) => field);

    const Rows = tableData.map((rowDataObject) =>
      headCells.map((fieldObject) =>
        fieldObject.render ? fieldObject.render(rowDataObject) : rowDataObject[fieldObject.field]
      )
    );

    const csvBuilder = new CsvBuilder(csvFileName)
      .setColumns(listOfLocalizedColumnNames)
      .addRows(Rows);

    csvBuilder.exportFile();
  };

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <h3>Incoming Payments</h3>
        </Grid>

        <Grid item>
          {enableExportToCSV && (
            <Button
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                handleExportToCSV(data);
              }}
              color="primary"
              disabled={!isTableDataNotEmpty}
            >
              <strong>Export to CSV</strong>
            </Button>
          )}
        </Grid>
      </Grid>
      <MaterialTable
        size="small"
        title=""
        isLoading={loading}
        columns={headCells}
        data={data}
        options={{
          ...tableStyles,
          toolbar: false,
          search: false,
          searchFieldVariant: "outlined",
          pageSize: 10,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
            onClick: (event, rowData) => {
              setMenuAnchorEl(event.currentTarget);
              setSelectedRow(rowData);
            },
          },
        ]}
        localization={mtableLocalization}
      />
      <MaterialTableOverflowMenu
        actions={actions}
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default IncomingPaymentsTable;

IncomingPaymentsTable.defaultProps = {
  enableExportToCSV: false,
};
