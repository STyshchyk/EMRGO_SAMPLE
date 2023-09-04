import React, { Fragment, useRef } from "react";

import MaterialTable from "@material-table/core";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import v from "voca";
import moment from "moment";
import PropTypes from "prop-types";

import { DEFAULT_DATE_TIME_FORMAT } from "../../constants/datetime";
import { internalTransferStatusEnum } from "../../constants/wethaqAPI/cashManagement";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import { floatRenderer } from "../../helpers/renderers";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import DateRangePicker from "../FilterComponents/DateRangePicker";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../FilterComponents/ExportButtons";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import ExportTableContent from "../PDFExporter/ExportTableContent";
import ReportingTablePDFExporter from "../ReportingTablePDFExporter";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const FALLBACK_VALUE = "--";

const TableActionMenu = ({ handleCloseMenu, actions, anchorEl }) => (
  <Fragment>
    {Boolean(anchorEl) && (
      <Menu
        data-testid="internal-transfer-transactions-table-menu-list"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {actions
          .filter((action) => !action.hidden)
          .map((action) => (
            <MenuItem
              key={action.id}
              disabled={action.disabled}
              onClick={() => {
                action.onClick();
              }}
            >
              <Typography variant="inherit">{action.label}</Typography>
            </MenuItem>
          ))}
      </Menu>
    )}
  </Fragment>
);

TableActionMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      label: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

const generateInternalTransferTransactionsTableRowData = (i) => ({
  id: i.id,
  currency: i.currency, // object
  date: i.date,
  description: i.description ?? FALLBACK_VALUE,
  destinationAccountBalance: i.destinationAccountBalance,
  destinationAccountId: i.destinationAccountId,
  destinationAccountNumber: i.destinationAccountNumber,
  destinationAccountOwner: i.destinationAccountOwner, // string
  destinationEntityId: i.destinationEntityId,
  journalStatus: i.journalStatus ?? FALLBACK_VALUE,
  sourceAccountBalance: i.sourceAccountBalance,
  sourceAccountId: i.sourceAccountId,
  sourceAccountNumber: i.sourceAccountNumber,
  sourceAccountOwner: i.sourceAccountOwner, // string
  sourceEntityId: i.sourceEntityId,
  transferAmount: floatRenderer(i.transferAmount),
  approvedByUser: i.approvedByUser ?? FALLBACK_VALUE,
  amendedByUser: i.amendedByUser ?? FALLBACK_VALUE,
  createdByUser: i.createdByUser ?? FALLBACK_VALUE,
});

const generateClientDropdownOptionsList = (tableData) => {
  const collectionOfClientNames = tableData
    .map(({ sourceAccountOwner, destinationAccountOwner }) => [
      sourceAccountOwner,
      destinationAccountOwner,
    ])
    .flat()
    .sort();

  return [...new Set(collectionOfClientNames)].map((i) => ({
    label: i,
    value: i,
  }));
};

const InternalTransferTransactionsTable = ({
  anchorEl,
  handleCloseMenu,
  data,
  actions,
  setCurrentlySelectedRowData,
  setAnchorEl,
  isLoading,
}) => {
  const tableRef = useRef();
  const ref = useRef();
  const mtableLocalization = useMaterialTableLocalization();

  const tableColumns = [
    {
      id: "date",
      title: "Date",
      field: "date",
      defaultSort: "desc",
      render: (rowData) => dateFormatter(rowData?.date, DEFAULT_DATE_TIME_FORMAT),
      exportConfig: { render: (rowData) => dateFormatter(rowData?.date, DEFAULT_DATE_TIME_FORMAT) },
    },
    {
      id: "journalStatus",
      title: "Status",
      field: "journalStatus",
    },
    {
      id: "amendedByUser",
      title: "Amended by",
      field: "amendedByUser",
    },
    {
      id: "approvedByUser",
      title: "Approved by",
      field: "approvedByUser",
    },
    {
      id: "currency",
      title: "CCY",
      field: "currency",
      render: (rowData) => rowData?.currency?.name,
      exportConfig: { render: (rowData) => rowData?.currency?.name },
    },
    {
      id: "transferAmount",
      title: "Transfer Amount",
      field: "transferAmount",
      type: "numeric",
      render: (rowData) =>
        rowData.transferAmount &&
        convertNumberToIntlFormat(rowData.transferAmount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      id: "sourceAccountOwner",
      title: "Source Account Owner",
      field: "sourceAccountOwner",
      exportConfig: { width: 5 },
    },
    {
      id: "sourceAccountNumber",
      title: "Source Account Number",
      field: "sourceAccountNumber",
      type: "numeric",
      exportConfig: { width: 5 },
    },
    {
      id: "sourceAccountBalance",
      title: "Source Account Balance",
      field: "sourceAccountBalance",
      type: "numeric",
      exportConfig: { width: 5 },
      render: (rowData) =>
        rowData.sourceAccountBalance &&
        convertNumberToIntlFormat(rowData.sourceAccountBalance, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      id: "destinationAccountOwner",
      title: "Destination Account Owner",
      field: "destinationAccountOwner",
      exportConfig: { width: 5 },
    },
    {
      id: "destinationAccountNumber",
      title: "Destination Account Number",
      field: "destinationAccountNumber",
      type: "numeric",
      exportConfig: { width: 5 },
    },
    {
      id: "destinationAccountBalance",
      title: "Destination Account Balance",
      field: "destinationAccountBalance",
      type: "numeric",
      exportConfig: { width: 5 },
      render: (rowData) =>
        rowData.destinationAccountBalance &&
        convertNumberToIntlFormat(rowData.destinationAccountBalance, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      id: "description",
      title: "Description",
      field: "description",
    },
  ];

  return (
    <Fragment>
      <div
        style={{
          marginBottom: "1rem",
        }}
      >
        <FilterProvider tableKey="internal_transfer_transactions">
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <TableFiltersWrapper
              tableRef={tableRef}
              data={data}
              columns={tableColumns}
              open={true}
              hideExportButtons
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={6}>
                  <DateRangePicker name="date" label={"Date"} defaultFilter="none" />
                </Grid>
                <Fragment>
                  <Grid item xs={12} md={6} lg={3}>
                    <DropdownFilter
                      name="client"
                      label="Client"
                      options={generateClientDropdownOptionsList(data)}
                    />
                  </Grid>
                </Fragment>
                <Grid item xs={12} md={6} lg={3}>
                  <DropdownFilter
                    name="status"
                    label="Status"
                    options={[
                      {
                        label: "Done",
                        value: internalTransferStatusEnum.DONE,
                      },
                      {
                        label: "Awaiting Approval",
                        value: internalTransferStatusEnum.AWAITING_APPROVAL,
                      },
                      {
                        label: "Cancelled",
                        value: internalTransferStatusEnum.CANCELLED,
                      },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <ExportButtons tableRef={tableRef} name="Internal Transfer Transactions Report" />
                </Grid>
              </Grid>
            </TableFiltersWrapper>
          </div>
          <FilterConsumer>
            {({ filters, filterColumns }) => {
              const filteredData = data
                .filter((row) => {
                  if (filters?.date?.value?.startDate && filters?.date?.value?.endDate) {
                    const { startDate, endDate } = filters?.date.value;

                    return moment(row.date).isBetween(startDate, endDate);
                  }
                  return true;
                })
                .filter((row) => {
                  if (filters?.client) {
                    const clientFilterValue = filters?.client?.value?.value;

                    return (
                      row.sourceAccountOwner === clientFilterValue ||
                      row.destinationAccountOwner === clientFilterValue
                    );
                  }
                  return true;
                })
                .filter((row) => {
                  if (filters?.status) {
                    return row.journalStatus === filters?.status?.value?.value;
                  }
                  return true;
                });

              return (
                <div data-testid="security-trades-table">
                  <MaterialTable
                    tableRef={tableRef}
                    size="small"
                    title=""
                    style={{
                      boxShadow: "none",
                    }}
                    columns={[...filterColumns.shownColumns]}
                    data={filteredData}
                    actions={[
                      {
                        icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
                        onClick: (event, rowData) => {
                          setAnchorEl(event.currentTarget);
                          setCurrentlySelectedRowData(rowData);
                        },
                      },
                    ]}
                    options={{
                      ...tableStyles,
                      toolbar: false,
                      pageSize: 15,
                      search: false,
                      draggable: false,
                    }}
                    localization={mtableLocalization}
                    isLoading={isLoading}
                  />
                  <TableActionMenu
                    anchorEl={anchorEl}
                    actions={actions}
                    handleCloseMenu={handleCloseMenu}
                  />

                  <ReportingTablePDFExporter
                    ref={ref}
                    title="Internal Transfer Transactions"
                    pageSize="A2"
                  >
                    <ExportTableContent
                      columns={tableColumns}
                      tableOptions={{
                        sliceRowCount: 8,
                        tableOffset: 4,
                      }}
                      data={data}
                      title={`Internal Transfer Transactions Report`}
                    />
                  </ReportingTablePDFExporter>
                </div>
              );
            }}
          </FilterConsumer>
        </FilterProvider>
      </div>
    </Fragment>
  );
};

export default InternalTransferTransactionsTable;

export { generateInternalTransferTransactionsTableRowData };
