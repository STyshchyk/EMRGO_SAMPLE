import { Fragment, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

import {
  BANK_AMOUNT_DP,
  BANK_RATE_DP,
  CLIENT_AMOUNT_DP,
  CLIENT_RATE_DP,
  MARKUP_AMOUNT_DP,
  MARKUP_RATE_DP,
} from "../../constants/currency/availableCurrencies";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import findDateRange from "../../helpers/dates";
import { dateRenderer, roundNumber } from "../../helpers/renderers";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import DateRangePicker from "../FilterComponents/DateRangePicker";
import FilterButton from "../FilterComponents/FilterButton";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import MaterialTableOverflowMenu from "../MaterialTableOverflowMenu";

const generateFXTransactionTableRowData = (i) => ({
  id: i.id,
  reference: i.reference,
  entity: i.entity,
  status: i.status,
  fromAmount: i.fromAmount,
  fromCurrency: i.fromCurrency,
  fromAccount: i.fromAccount,
  bankRate: i.bankRate,
  markupRate: i.markupRate,
  clientRate: i.clientRate,
  bankAmount: i.bankAmount,
  markupAmount: i.markupAmount,
  clientAmount: i.clientAmount,
  toCurrency: i.toCurrency,
  toAccount: i.toAccount,
  narrative: i?.narrative,
  createdAt: i.createdAt,
});

const FXTransactionTable = ({
  anchorEl,
  data,
  actions,
  setCurrentlySelectedRowData,
  setAnchorEl,
  setOpenAddFXTransactionDialog,
  fetchFxTransactionsList,
  setCurrentlySelectedDateRange,
}) => {
  const tableRef = useRef();
  const { t } = useTranslation(["fx_transactions", "reports"]);
  const mtableLocalization = useMaterialTableLocalization();
  const defaultFilter = "seven";
  // map translations
  const columns = [
    {
      id: "reference",
      title: t("Fx Table.Reference"),
      field: "reference",
    },
    {
      id: "status",
      title: t("Fx Table.Status"),
      field: "status",
    },
    {
      id: "entity",
      title: t("Fx Table.Entity"),
      field: "entity",
    },
    {
      id: "fromAmount",
      title: t("Fx Table.From Amount"),
      field: "fromAmount",
    },
    {
      id: "fromCurrency",
      title: t("Fx Table.From Currency"),
      field: "fromCurrency",
    },
    {
      id: "fromAccount",
      title: t("Fx Table.Debit Account"),
      field: "fromAccount",
    },
    {
      id: "bankRate",
      title: t("Fx Table.Bank FX Rate %"),
      field: "bankRate",
      render: (rowData) => roundNumber(rowData.bankRate, BANK_RATE_DP),
    },
    {
      id: "markupRate",
      title: t("Fx Table.Markup Rate %"),
      field: "markupRate",
      render: (rowData) => roundNumber(rowData.markupRate, MARKUP_RATE_DP),
    },
    {
      id: "clientRate",
      title: t("Fx Table.Client FX Rate %"),
      field: "clientRate",
      render: (rowData) => roundNumber(rowData.clientRate, CLIENT_RATE_DP),
    },
    {
      id: "bankAmount",
      title: t("Fx Table.Bank Amount"),
      field: "bankAmount",
      render: (rowData) => roundNumber(rowData.bankAmount, BANK_AMOUNT_DP),
    },
    {
      id: "markupAmount",
      title: t("Fx Table.Markup Amount"),
      field: "markupAmount",
      render: (rowData) => roundNumber(rowData.markupAmount, MARKUP_AMOUNT_DP),
    },
    {
      id: "clientAmount",
      title: t("Fx Table.Client Amount"),
      field: "clientAmount",
      render: (rowData) => roundNumber(rowData.clientAmount, CLIENT_AMOUNT_DP),
    },
    {
      id: "toCurrency",
      title: t("Fx Table.To Currency"),
      field: "toCurrency",
    },
    {
      id: "toAccount",
      title: t("Fx Table.Credit Account"),
      field: "toAccount",
    },

    {
      id: "date",
      title: t("Fx Table.Date"),
      field: "createdAt",
      render: (rowData) => dateRenderer(rowData.createdAt),
    },
    {
      id: "narrative",
      title: t("Fx Table.Narrative"),
      field: "narrative",
    },
  ];

  useEffect(() => {
    const defaultFilters = findDateRange(defaultFilter);
    const payload = {
      startDate: defaultFilters?.defaultStartDate.format(),
      endDate: defaultFilters?.defaultEndDate.format(),
    };
    fetchFxTransactionsList(payload);
    setCurrentlySelectedDateRange(payload);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFilter]);

  const fetchTransactions = (transactionDateRange) => {
    const payload = {
      startDate: transactionDateRange.value.startDate.format(),
      endDate: transactionDateRange.value.endDate.format(),
    };
    setCurrentlySelectedDateRange(payload);
    fetchFxTransactionsList(payload);
  };

  return (
    <Fragment>
      <Box pb={3}>
        <Grid alignItems="center" justifyContent="flex-end" item container md={12}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                setOpenAddFXTransactionDialog(true);
              }}
            >
              {t("New Fx Transaction")}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <FilterProvider tableKey="fx_transaction_list">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            tableRef={tableRef}
            columns={columns}
            tableKey="fx_transaction_list"
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker
                  name="transactionDateRange"
                  label={t("Security Transactions.Filters.Date")}
                  defaultFilter={defaultFilter}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}></Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FilterButton
                  label="Filter"
                  onClick={(filters) => {
                    const { transactionDateRange } = filters;
                    fetchTransactions(transactionDateRange);
                  }}
                />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>
        <FilterConsumer>
          {({ filterColumns }) => {
            const filteredData = data.filter(() => true);
            return (
              <Fragment>
                <MaterialTable
                  tableRef={tableRef}
                  size="small"
                  title=""
                  style={{
                    boxShadow: "none",
                  }}
                  columns={filterColumns.shownColumns}
                  data={filteredData}
                  actions={[
                    {
                      icon: "more_vert",
                      onClick: (event, rowData) => {
                        setAnchorEl(event.currentTarget);
                        setCurrentlySelectedRowData(rowData);
                      },
                    },
                  ]}
                  options={{
                    ...tableStyles,
                    toolbar: false,
                    pageSize: 5,
                    search: false,
                    fixedColumns: {
                      left: 0,
                    },
                    actionsColumnIndex: -1,
                    draggable: false,
                  }}
                  localization={mtableLocalization}
                />
                <MaterialTableOverflowMenu
                  actions={actions}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  selectedRow={setCurrentlySelectedRowData}
                />
              </Fragment>
            );
          }}
        </FilterConsumer>
      </FilterProvider>
    </Fragment>
  );
};

export default FXTransactionTable;

export { generateFXTransactionTableRowData };

FXTransactionTable.propTypes = {
  anchorEl: PropTypes.object,
  handleCloseMenu: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  setCurrentlySelectedRowData: PropTypes.func.isRequired,
  showAllFilters: PropTypes.bool,
  setAnchorEl: PropTypes.func.isRequired,
  setOpenDialog: PropTypes.func,
};
