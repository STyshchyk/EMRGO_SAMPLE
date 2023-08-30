import { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { StyleSheet, View } from "@react-pdf/renderer";
import { CsvBuilder } from "filefy";
import v from "voca";

import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../constants/datetime";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as paymentAndSettlementActionCreators from "../../redux/actionCreators/paymentAndSettlement";
import * as paymentAndSettlementSelectors from "../../redux/selectors/paymentAndSettlement";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import ExportTableContent from "../PDFExporter/ExportTableContent";
import Filters from "../PDFExporter/Filters";
import ReportingTablePDFExporter from "../ReportingTablePDFExporter";
import StyledDialogHeader from "../StyledDialogHeader";

const primary = "#23389c";

const pdfStyles = StyleSheet.create({
  content: {
    paddingTop: 5,
    paddingRight: 30,
    paddingLeft: 30,
  },
  filter: { width: 600, paddingBottom: 5 },
  label: { fontSize: "9px", fontFamily: "D-DIN Exp", color: primary, marginTop: "5px" },
  value: { fontSize: "9px", fontFamily: "D-DIN Exp", fontWeight: 700, color: primary },
});

// !Format Settlement Instruction field values
const formatSIFieldValue = (rawValue, fieldName) => {
  // !Return '--' if raw value is empty
  if (!rawValue) {
    return "--";
  }

  // !Format date fields
  if (["tradeDate", "settlementDate"].includes(fieldName)) {
    return dateFormatter(rawValue, DEFAULT_DATE_FORMAT);
  }

  if (["quantity"].includes(fieldName)) {
    return convertNumberToIntlFormat(rawValue);
  }

  if (["price", "principalAmount", "settlementAmount", "accruedInterest"].includes(fieldName)) {
    return convertNumberToIntlFormat(rawValue, { minimumFractionDigits: 2 });
  }

  // !Return raw value if no formatting is required
  return rawValue;
};

// TODO: DOCUMENT ME (SIGH)
const generateSIAuditHistoryStatement = (item) => {
  const { auditType, auditSubType, reason, prevStatus, newStatus, user, auditColumnLabel } = item;

  const userFullName = `${user.firstName} ${user.lastName}`;
  const reasonName = reason?.name ?? "N/A";

  let auditHistoryStatement = "--";

  if (auditType === "Action") {
    auditHistoryStatement = `${auditSubType} by ${userFullName}`;

    if (auditColumnLabel) {
      return `${v
        .chain(auditColumnLabel)
        .snakeCase()
        .upperCase.value()} changed from ${formatSIFieldValue(
        prevStatus,
        auditColumnLabel
      )} to ${formatSIFieldValue(newStatus, auditColumnLabel)} by ${userFullName}`;
    }
  }

  if (auditType === "Status") {
    auditHistoryStatement = `Status changed from ${prevStatus} to ${newStatus} by ${userFullName}`;
  }

  if (auditType === "Reason") {
    auditHistoryStatement = `${newStatus} Reason - ${reasonName}`;
  }

  return auditHistoryStatement;
};

const generateSIAuditHistoryTableRowData = (item) => ({
  auditTimestamp: item.auditTimestamp,
  description: generateSIAuditHistoryStatement(item),
  auditType: item.auditType,
  auditSubType: item.auditSubType ?? "--",
  auditColumnLabel: item.auditColumnLabel,
  prevStatus: item.prevStatus,
  newStatus: item.newStatus,
});

const SettlementInstructionAuditHistoryTable = ({ isLoading, data, columns }) => {
  const mtableLocalization = useMaterialTableLocalization();

  return (
    <MaterialTable
      isLoading={isLoading}
      data={data}
      size="small"
      style={{
        boxShadow: "none",
      }}
      columns={columns}
      options={{
        ...tableStyles,
        toolbar: false,
        pageSize: 10,
        search: false,
        draggable: false,
      }}
      localization={mtableLocalization}
    />
  );
};

const ViewSettlementInstructionAuditHistoryDialog = ({
  open,
  handleClose,
  currentlySelectedRowData,
}) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const settlementId = currentlySelectedRowData?.id;

  // selectors
  const isFetchingSettlementInstructionAuditData = useSelector(
    paymentAndSettlementSelectors.selectIsFetchingSettlementInstructionAuditData
  );
  const settlementInstructionAuditHistoryDataList = useSelector(
    paymentAndSettlementSelectors.selectSettlementInstructionAuditHistoryDataList
  );

  const tableData = settlementInstructionAuditHistoryDataList.map((item) =>
    generateSIAuditHistoryTableRowData(item)
  );

  useEffect(() => {
    const fetchSettlementInstructionAuditData = (payload) =>
      dispatch(paymentAndSettlementActionCreators.doFetchSettlementInstructionAuditData(payload));
    const resetSettlementInstructionAuditData = () =>
      dispatch(paymentAndSettlementActionCreators.doResetSettlementInstructionAuditData());

    fetchSettlementInstructionAuditData({
      settlementId,
    });

    return () => resetSettlementInstructionAuditData();
  }, [dispatch, settlementId]);

  // !TODO: FIX ME
  const handleCSVExportClick = (data) => {
    const generatedAtTimestamp = new Date().toISOString();
    const csvFileName = `settlement_instruction_audit_history_${generatedAtTimestamp}.csv`;

    const transformed = data.map(({ auditTimestamp, description }) => ({
      date: dateFormatter(auditTimestamp, DEFAULT_DATE_TIME_FORMAT),
      description,
    }));

    const listOfColumnNames = ["date", "description"];
    const listOfRows = transformed.map(({ date, description }) => [[date], [description]]);

    const csvBuilder = new CsvBuilder(csvFileName)
      .setColumns(listOfColumnNames)
      .addRows(listOfRows);

    csvBuilder.exportFile();
  };

  // !TODO: FIX ME
  const handlePDFExportClick = () => {
    ref.current.exportFile();
  };

  const columns = [
    {
      id: "auditTimestamp",
      title: "Date",
      field: "auditTimestamp",
      render: (rowData) => dateFormatter(rowData?.auditTimestamp, DEFAULT_DATE_TIME_FORMAT),
      defaultSort: "asc",
      customSort: (a, b) => new Date(a.auditTimestamp) - new Date(b.auditTimestamp),
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.auditTimestamp, DEFAULT_DATE_TIME_FORMAT),
      },
    },
    {
      id: "description",
      title: "Description",
      field: "description",
      sorting: false,
    },
    {
      id: "auditColumnLabel",
      title: "Field name",
      field: "auditColumnLabel",
      sorting: false,
      render: (rowData) => {
        if (rowData?.auditColumnLabel) {
          return constantCase(rowData?.auditColumnLabel);
        }

        return "STATUS";
      },
    },
    {
      id: "Old Value",
      title: "Old value",
      field: "prevStatus",
      sorting: false,
      render: (rowData) => {
        const formattedValue = formatSIFieldValue(rowData?.prevStatus, rowData?.auditColumnLabel);

        return formattedValue;
      },
    },
    {
      id: "New Value",
      title: "New value",
      field: "newStatus",
      sorting: false,
      render: (rowData) => {
        const formattedValue = formatSIFieldValue(rowData?.newStatus, rowData?.auditColumnLabel);

        return formattedValue;
      },
    },
  ];

  const exportFilters = [
    {
      label: "",
      value: currentlySelectedRowData?.security,
    },
    {
      label: "Reference no",
      value: currentlySelectedRowData?.referenceId,
    },
    {
      label: "Settlement Instruction Status",
      value: currentlySelectedRowData?.tradeSettlementOrSettlementInstructionStatus,
    },
  ];

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={(event, reason) => {
          if (reason && reason === "backdropClick") return;

          handleClose();
        }}
        aria-labelledby="view-settlement-instruction-audit-history-form-dialog"
      >
        <StyledDialogHeader
          title="View Settlement Instruction Audit History"
          handleClose={handleClose}
        />
        <DialogContent>
          <Box mb={2}>
            <Grid
              container
              direction="column"
              spacing={1}
              style={{
                marginBottom: "1rem",
              }}
            >
              <Grid item>
                <Typography>{`${currentlySelectedRowData?.security}`}</Typography>
              </Grid>
              <Grid item>
                <Typography>{`Reference no: ${currentlySelectedRowData?.referenceId}`}</Typography>
              </Grid>
              <Grid item>
                <Typography>{`Settlement Instruction Status: ${currentlySelectedRowData?.tradeSettlementOrSettlementInstructionStatus}`}</Typography>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <SettlementInstructionAuditHistoryTable
                isLoading={isFetchingSettlementInstructionAuditData}
                data={tableData}
                columns={columns}
              />
            </Grid>
            <Grid
              item
              container
              spacing={2}
              justifyContent="flex-end"
              style={{
                marginTop: "1rem",
              }}
            >
              <Grid item>
                <Button
                  color="primary"
                  startIcon={<CloudDownloadIcon />}
                  variant="contained"
                  type="submit"
                  disabled
                  onClick={() => {
                    handlePDFExportClick(tableData);
                  }}
                >
                  <strong>PDF</strong>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  startIcon={<CloudDownloadIcon />}
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    handleCSVExportClick(tableData);
                  }}
                >
                  <strong>CSV</strong>
                </Button>
              </Grid>

              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      <ReportingTablePDFExporter ref={ref} title="Audit History">
        <View style={pdfStyles.content}>
          {/* <View style={pdfStyles.filter}>
            {exportFilters.map((filter) => (
              <Text style={pdfStyles.label} key={shortid.generate()}>
                {filter.label ? `${filter.label}:` : ''} <Text style={pdfStyles.value}>{filter.value}</Text>
              </Text>
            ))}
          </View> */}

          <Filters
            filters={exportFilters}
            styleProps={{ filterPaddingBottom: 5, contentPaddingBottom: 0 }}
          />
        </View>

        <ExportTableContent
          columns={columns}
          tableOptions={{
            sliceRowCount: 5,
            tableOffset: 6,
          }}
          data={tableData}
          title={`Settlement Instruction History`}
        />
      </ReportingTablePDFExporter>
    </Fragment>
  );
};

export default ViewSettlementInstructionAuditHistoryDialog;
