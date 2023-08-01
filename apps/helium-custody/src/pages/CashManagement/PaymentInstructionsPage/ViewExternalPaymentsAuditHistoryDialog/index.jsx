import { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import ExportButtons from "../../../../components/FilterComponents/ExportButtons";
import StyledDialogHeader from "../../../../components/StyledDialogHeader";
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../../../constants/datetime";
import { currencyRenderer } from "../../../../constants/renderers";
import { FilterConsumer, FilterProvider, useFilters } from "../../../../context/filter-context";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import * as cashManagementActionCreators from "../../../../redux/actionCreators/cashManagement";
import * as cashManagementSelectors from "../../../../redux/selectors/cashManagement";
import tableStyles from "../../../../styles/cssInJs/materialTable";
import { dateFormatter } from "../../../../utils/formatter";

const columnsLabels = {
  accountId: "Account",
  amount: "Amount",
  details: "Details",
  transferPurposeTypeId: "Transfer Purpose",
  valueDate: "Value Date",
  wethaqAccountId: "Emrgo Account",
};

const getAuditColumnLabel = (columnLabel) => {
  const auditColumnLabel = columnsLabels[columnLabel];
  return auditColumnLabel ?? columnLabel;
};

const getColumnAuditTypeStatus = (status, columnLabel) => {
  if (columnLabel === "valueDate") {
    return dateFormatter(status, DEFAULT_DATE_FORMAT);
  }

  if (columnLabel === "amount") {
    return currencyRenderer(status);
  }

  return status;
};

const generatePaymentAuditHistoryStatement = (item) => {
  const { auditType, auditSubType, reason, prevStatus, newStatus, user, auditColumnLabel } = item;

  const userFullName = `${user?.firstName} ${user?.lastName}`;
  const reasonName = reason?.name ?? "N/A";

  let auditHistoryStatement = "--";

  if (auditType === "Action") {
    auditHistoryStatement = `${auditSubType} by ${userFullName}`;
  }

  // for cron jobs at the be when status changes from submitted to disbursed user obj is null
  if (auditType === "Status") {
    auditHistoryStatement = `Status changed from ${prevStatus} to ${newStatus} ${
      userFullName ? `by ${userFullName}` : ""
    }`;
  }

  if (auditType === "Reason") {
    auditHistoryStatement = `${newStatus} Reason - ${reasonName}`;
  }

  if (auditType === "Column") {
    auditHistoryStatement = `${getAuditColumnLabel(
      auditColumnLabel
    )} changed from ${getColumnAuditTypeStatus(
      prevStatus,
      auditColumnLabel
    )} to ${getColumnAuditTypeStatus(newStatus, auditColumnLabel)} by ${userFullName}`;
  }

  return auditHistoryStatement;
};

const generateExternalPaymentsTableRowData = (item) => ({
  auditTimestamp: item.auditTimestamp,
  description: generatePaymentAuditHistoryStatement(item),
});

const ExternalPaymentAuditHistoryTable = ({ isLoading, data, columns, tableRef }) => {
  const mtableLocalization = useMaterialTableLocalization();
  const filterContext = useFilters();
  const { setAllColumns, setTableData } = filterContext;

  useEffect(() => {
    setTableData(data);
  }, [data, setTableData]);

  useEffect(() => {
    setAllColumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FilterConsumer>
      {({ filterColumns }) => (
        <MaterialTable
          isLoading={isLoading}
          tableRef={tableRef}
          data={data}
          size="small"
          columns={filterColumns?.shownColumns}
          options={{
            ...tableStyles,
            toolbar: false,
            pageSize: 10,
            search: false,
            draggable: false,
          }}
          localization={mtableLocalization}
        />
      )}
    </FilterConsumer>
  );
};

const ViewExternalPaymentsAuditHistoryDialog = ({
  isModalOpen,
  handleClose,
  currentlySelectedRowData,
}) => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const externalPaymentId = currentlySelectedRowData?.id;

  // selectors
  const isFetchingExternalPaymentsAuditData = useSelector(
    cashManagementSelectors.selectIsFetchingExternalPaymentsAuditData
  );
  const externalPaymentsAuditHistoryDataList = useSelector(
    cashManagementSelectors.selectExternalPaymentsAuditHistoryDataList
  );

  const tableData = externalPaymentsAuditHistoryDataList.map((item) =>
    generateExternalPaymentsTableRowData(item)
  );

  const columns = [
    {
      id: "auditTimestamp",
      title: "Date",
      field: "auditTimestamp",
      render: (rowData) => dateFormatter(rowData?.auditTimestamp, DEFAULT_DATE_TIME_FORMAT),
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.auditTimestamp, DEFAULT_DATE_TIME_FORMAT),
      },
      defaultSort: "asc",
      customSort: (a, b) => new Date(a.auditTimestamp) - new Date(b.auditTimestamp),
    },
    {
      id: "description",
      title: "Description",
      field: "description",
      sorting: false,
    },
  ];

  useEffect(() => {
    const fetchExternalPaymentsAuditData = (payload) =>
      dispatch(cashManagementActionCreators.doFetctExternalPaymentsAuditData(payload));
    const resetExternalPaymentsAuditData = () =>
      dispatch(cashManagementActionCreators.doResetExternalPaymentsAuditData());

    fetchExternalPaymentsAuditData({
      externalPaymentId,
    });
    return () => resetExternalPaymentsAuditData();
  }, [dispatch, externalPaymentId]);

  return (
    <Fragment>
      <FilterProvider tableKey="external_payments_audit_history">
        <Dialog
          fullWidth
          maxWidth="md"
          open={isModalOpen}
          onClose={(event, reason) => {
            if (reason && reason === "backdropClick") return;

            handleClose();
          }}
          aria-labelledby="view-external-payments-audit-history-form-dialog"
        >
          <StyledDialogHeader
            title="View External Payments Audit History"
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
                  <Typography>{`Account no: ${currentlySelectedRowData?.accountNo}`}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{`Reference no: ${currentlySelectedRowData?.referenceNo}`}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{`External Payment Status: ${currentlySelectedRowData?.status}`}</Typography>
                </Grid>
              </Grid>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "bold",
                }}
                gutterBottom
              >
                External Payment Audit History
              </Typography>

              <ExternalPaymentAuditHistoryTable
                isLoading={isFetchingExternalPaymentsAuditData}
                tableRef={tableRef}
                data={tableData}
                columns={columns}
              />

              <Grid
                item
                container
                spacing={2}
                justifyContent="flex-end"
                style={{
                  marginTop: "1rem",
                }}
              >
                <ExportButtons tableRef={tableRef} name="External Payments Audit History Report" />

                <Box mt={2} ml={2}>
                  <Grid item>
                    <Button
                      size="large"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Close
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </FilterProvider>
    </Fragment>
  );
};

export default ViewExternalPaymentsAuditHistoryDialog;
