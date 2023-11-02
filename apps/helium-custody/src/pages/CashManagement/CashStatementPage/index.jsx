import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import moment from "moment";
import v from "voca";

import DateRangePicker from "../../../components/FilterComponents/DateRangePicker";
import DropdownFilter from "../../../components/FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../../../components/FilterComponents/ExportButtons";
import FilterButton from "../../../components/FilterComponents/FilterButton";
import ReportingInfo from "../../../components/FilterComponents/ReportingInfo";
import TableFiltersWrapper from "../../../components/FilterComponents/TableFiltersWrapper";
import PageTitle from "../../../components/PageTitle";
import { currencyRenderer, reportDateRenderer } from "../../../constants/renderers";
import { FilterConsumer, FilterProvider } from "../../../context/filter-context";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as safekeepingActionCreators from "../../../redux/actionCreators/safekeeping";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
import * as safekeepingSelectors from "../../../redux/selectors/safekeeping";
import tableStyles from "../../../styles/cssInJs/materialTable";
import { dateWithinRange } from "../../../utils/dates";
import { dateFormatter } from "../../../utils/formatter";
import ReportingDisclaimer from "../../Reports/ReportingDisclaimer";

const getFormattedBalanceType = (accType) => v.capitalize(accType.split("_").join(" "));

const decimalFormat = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const getTableData = (accs) => {
  const entries = [];
  accs.forEach((acc) => {
    entries.push({
      id: acc.id,
      date: acc.date,
      transactionType: getFormattedBalanceType(acc.activityType),
      refNo: acc.sourceReference,
      isin: acc.isin,
      narrative: acc?.description ?? "",
      debit: acc.transactionType === "D" ? acc.amount : "",
      credit: acc.transactionType === "C" ? acc.amount : "",
      balance: acc.balance,
    });
  });
  return entries;
};

const CashStatementPage = () => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const navigate = useNavigate();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports"]);
  const defaultDateRangeFilter = "none";

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const transactions = useSelector(reportsSelectors.selectCashTransactions);
  const safekeepingAccounts = useSelector(safekeepingSelectors.readAccounts);
  // console.log('🚀 ~ file: index.js ~ line 61 ~ CashStatementReportPage ~ transactions', transactions);
  const [transactionTypeValue, setTransactionTypeValue] = useState("all");
  const [safekeepingAccountOptions, setSafeAccountOptions] = useState(null);
  const [cashAccountOptions, setCashAccountOptions] = useState(null);

  const [filteredRows, setFilteredRows] = useState([]);

  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });
  useEffect(() => {
    const fetchAccounts = (payload) => dispatch(reportsActionCreators.doFetchCashAccounts(payload));
    fetchAccounts();

    const fetchSafekeepingAccounts = (payload) =>
      dispatch(safekeepingActionCreators.doReadAccounts(payload));
    fetchSafekeepingAccounts();

    return () => {
      dispatch(reportsActionCreators.doResetCashTransactions());
    };
  }, [dispatch]);

  useEffect(() => {
    setFilteredRows(getTableData(transactions));
  }, [transactions]);

  const transactionTypeOptionsList = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Credit",
      value: "credit",
    },
    {
      label: "Debit",
      value: "debit",
    },
  ];

  const rows = getTableData(transactions);

  const entityList = [
    ...safekeepingAccounts.map((i) => ({
      label: i.entity?.name,
      value: i.entity?.id,
      data: i.entity,
    })),
  ];

  const entityOptions = [...new Map(entityList.map((item) => [item.value, item])).values()];

  const safeekingAccountList = [
    ...safekeepingAccounts.map((i) => ({
      label: `${i.name} (${i?.securitiesAccount?.accountNumber})`,
      value: i.id,
      entityId: i.entity_id,
      account: i,
    })),
  ];

  const handleEntityChange = (selectedEntity) => {
    if (selectedEntity && selectedEntity.value !== "all") {
      const filteredSafekeepingAccounts = safeekingAccountList.filter((account) =>
        selectedEntity ? account?.entityId === selectedEntity.value : false
      );
      setSafeAccountOptions(filteredSafekeepingAccounts);
    } else {
      setSafeAccountOptions(safeekingAccountList);
    }

    dispatch(reportsActionCreators.doResetCashTransactions());
  };

  const handleSafekeepingAccountChange = (selectedSafekeepingAccount) => {
    if (selectedSafekeepingAccount && selectedSafekeepingAccount.value !== "all") {
      const filteredCashAccounts = selectedSafekeepingAccount.account.wethaqAccounts.map(
        (account) => ({
          label: `${account?.currency?.name} ( ${account?.accountNo} )`,
          value: account?.id,
          data: account,
        })
      );
      setCashAccountOptions(filteredCashAccounts);
    } else {
      setCashAccountOptions([]);
    }

    dispatch(reportsActionCreators.doResetCashTransactions());
  };

  const handleFetch = (filters) => {
    const { entity, safekeepingAccount, account, entryDate } = filters;

    const startDate = entryDate ? entryDate?.value?.startDate : null;
    const endDate = entryDate ? entryDate?.value?.endDate : null;

    const params = {
      startDate: startDate ? startDate.toISOString() : moment([1970, 1, 1]).toISOString(),
      endDate: endDate ? endDate.toISOString() : moment().endOf("day").toISOString(),
      portfolio_id: safekeepingAccount?.value?.value,
      entityName: entity?.value?.label,
      accountNo: account?.value?.data?.accountNo,
    };

    const fetchCashTransactions = (payload) =>
      dispatch(reportsActionCreators.doFetchCashTransactions(payload));

    fetchCashTransactions({ params });
  };

  const columns = [
    {
      id: "date",
      title: t("Cash Statement.Headers.Date"),
      field: "date",
      defaultSort: "asc",
      render: (rowData) => dateFormatter(rowData?.date, "DD/MM/YYYY"),
      exportConfig: {
        width: 8,
        render: (rowData) => reportDateRenderer(rowData?.date),
      },
    },
    {
      id: "transactionType",
      title: t("Cash Statement.Headers.Transaction Type"),
      field: "transactionType",
      exportConfig: { width: 15 },
    },
    { id: "isin", title: t("Cash Statement.Headers.WSN"), field: "isin" },
    {
      id: "narrative",
      title: t("Cash Statement.Headers.Narrative"),
      field: "narrative",
      exportConfig: { width: 25 },
    },
    {
      id: "debit",
      title: t("Cash Statement.Headers.Debit"),
      field: "debit",
      render: (rowData) => currencyRenderer(rowData.debit, decimalFormat),
      exportConfig: {
        render: (rowData) =>
          rowData.debit !== "-" ? currencyRenderer(rowData.debit, decimalFormat) : "--",
        align: "right",
      },
      // type: 'numeric',
    },
    {
      id: "credit",
      title: t("Cash Statement.Headers.Credit"),
      field: "credit",
      render: (rowData) => currencyRenderer(rowData.credit, decimalFormat),
      exportConfig: {
        render: (rowData) =>
          rowData.debit !== "-" ? currencyRenderer(rowData.credit, decimalFormat) : "--",
        align: "right",
      },
      // type: 'numeric',
    },
    {
      id: "balance",
      title: t("Cash Statement.Headers.Balance"),
      field: "balance",
      render: (rowData) => currencyRenderer(rowData.balance, decimalFormat),
      exportConfig: {
        render: (rowData) => currencyRenderer(rowData.balance, decimalFormat),
        align: "right",
      },
      // type: 'numeric',
    },
  ];

  return (
    <Fragment>
      <PageTitle title={t("Cash Statement.Cash Statement")} />
      {/* <RouteLeavingGuard
        when={transactions?.length > 0}
        title={t("Leave Guard.Title")}
        message={t("Leave Guard.Message")}
        navigate={(path) => navigate(path)}
        shouldBlockNavigation={() => true}
      /> */}
      <FilterProvider tableKey="cash_statement">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            tableRef={tableRef}
            data={filteredRows}
            columns={columns}
            open={true}
            hideExportButtons
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="entity"
                  label="Entity"
                  options={entityOptions}
                  customOnChange={(selectedEntity) => {
                    handleEntityChange(selectedEntity);
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="safekeepingAccount"
                  label="Safekeeping Account"
                  options={safekeepingAccountOptions || safeekingAccountList}
                  customOnChange={(selectedSafekeepingAccount) => {
                    handleSafekeepingAccountChange(selectedSafekeepingAccount);
                  }}
                  customClearChange={() => {
                    handleSafekeepingAccountChange();
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter name="account" label="Cash Account" options={cashAccountOptions} />
              </Grid>

              {/* <Grid item xs={12} lg={1} container></Grid> */}

              <Grid item xs={12} md={12} lg={3} justifyContent="flex-end">
                {/* <ReportingButtons handleClear={handleClear} handleFilter={handleFilter} disableApplyBtn={cashAccountFilterValue === null} data={filteredRows} /> */}
                <FilterButton
                  label="Apply"
                  onClick={(filters) => {
                    handleFetch(filters);
                  }}
                  disabled={(filters) => !filters.account}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="transactionType"
                  label="Credit/Debit"
                  options={transactionTypeOptionsList}
                />
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker name="entryDate" label="Entry Date" defaultFilter="none" />
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <ExportButtons tableRef={tableRef} name="Cash Statement" />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>

        <FilterConsumer>
          {({ filters, filterColumns }) => {
            console.log("🚀 ~ file: index.jsx:328 ~ CashStatementPage ~ filters:", filters);
            const filteredData = filteredRows
              .filter((row) => {
                //  Entry Date range Filter
                if (filters?.entryDate?.value?.startDate && filters?.entryDate?.value?.endDate) {
                  const { startDate: fromDate, endDate: toDate } = filters?.entryDate.value;
                  const isInRange = dateWithinRange(row?.date, fromDate, toDate);
                  return row?.date ? isInRange : null;
                }
                return true;
              })
              .filter((row) => {
                if (filters?.transactionType) {
                  let returnValue = false;
                  const transactionTypeValue = filters?.transactionType.value.value;
                  switch (transactionTypeValue) {
                    case "credit":
                      returnValue = row.credit !== "";
                      break;
                    case "debit":
                      returnValue = row.debit !== "";
                      break;
                    default:
                      returnValue = true;
                  }
                  return returnValue;
                }
                return true;
              });
            return (
              <Fragment>
                <Grid item xs={12}>
                  <ReportingInfo
                    cashAccount={filters?.account}
                    securityAccount={filters?.safekeepingAccount}
                  />
                </Grid>
                <MaterialTable
                  tableRef={tableRef}
                  size="small"
                  title=""
                  style={{
                    boxShadow: "none",
                  }}
                  columns={filterColumns.shownColumns}
                  data={filteredData}
                  options={{
                    ...tableStyles,
                    toolbar: false,
                    pageSize: 10,
                  }}
                  localization={mtableLocalization}
                />
              </Fragment>
            );
          }}
        </FilterConsumer>
      </FilterProvider>
      <ReportingDisclaimer />
    </Fragment>
  );
};

export default CashStatementPage;
