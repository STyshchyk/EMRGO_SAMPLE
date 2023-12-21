import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import v from "voca";

import DateRangePicker from "../../../components/FilterComponents/DateRangePicker";
import DropdownFilter from "../../../components/FilterComponents/DropdownFilter";
import ExportButtons from "../../../components/FilterComponents/ExportButtons";
import FilterButton from "../../../components/FilterComponents/FilterButton";
import ReportingInfo from "../../../components/FilterComponents/ReportingInfo";
import TableFiltersWrapper from "../../../components/FilterComponents/TableFiltersWrapper";
import PageTitle from "../../../components/PageTitle";
import ReactSelectCurrencyOption from "../../../components/ReactSelectCurrencyOption";
import ReactSelectCurrencySingleValueContainer from "../../../components/ReactSelectCurrencySingleValueContainer";
import { currencyRenderer, reportDateRenderer } from "../../../constants/renderers";
import { FilterConsumer, FilterProvider } from "../../../context/filter-context";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
import tableStyles from "../../../styles/cssInJs/materialTable";
import { dateWithinRange } from "../../../utils/dates";
import { dateFormatter } from "../../../utils/formatter";
import ReportingDisclaimer from "../ReportingDisclaimer";

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
      transactionType: acc.activityType ? getFormattedBalanceType(acc.activityType) : "N/A",
      refNo: acc.sourceReference,
      isin: acc.isin, // isin wsn not fetched ?
      narrative: acc?.description ?? "",
      debit: acc.transactionType === "D" ? acc.amount : "",
      credit: acc.transactionType === "C" ? acc.amount : "",
      balance: acc.balance,
    });
  });
  return entries;
};

const CashStatementReportPage = () => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const navigate = useNavigate();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports"]);
  const defaultDateRangeFilter = "none";
  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const transactions = useSelector(reportsSelectors.selectCashTransactions);
  // console.log('🚀 ~ file: index.js ~ line 61 ~ CashStatementReportPage ~ transactions', transactions);
  const [entityFilterValue, setEntityFilterValue] = useState(null);
  const [currentlySelectedEntity, setCurrentlySelectedEntity] = useState(null);
  const [securityAccountFilterValue, setSecurityAccountFilterValue] = useState(null);
  const [currentlySelectedSecurityAccount, setCurrentlySelectedSecurityAccount] = useState(null);
  const [cashAccountFilterValue, setCashAccountFilterValue] = useState(null);
  const [currentlySelectedCashAccount, setCurrentlySelectedCashAccount] = useState(null);
  const [cashAccountOptions, setCashAccountOptions] = useState([]);
  const [transactionTypeValue, setTransactionTypeValue] = useState("all");
  const [currentlySelectedTransactionType, setCurrentlySelectedTransactionType] = useState({
    label: "All",
    value: "all",
  });
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);

  const startDate = startDateValue ?? null;
  const endDate = endDateValue ?? null;

  const currentEntityGroupID = currentEntityGroup?.id;
  const accounts = useSelector(reportsSelectors.selectCashAccounts);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });
  useEffect(() => {
    const fetchAccounts = (payload) => dispatch(reportsActionCreators.doFetchCashAccounts(payload));
    fetchAccounts();
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

  const getEntityAndAccounts = (accs) => {
    const entityOpts = [];
    const cashAccountOpts = [];
    const securityAccountOpts = [];
    const pushedEntity = [];
    const pushedSecAccount = [];
    const pushedCashAccount = [];
    accs.forEach((acc) => {
      if (pushedEntity.indexOf(acc.group.entity.id) === -1) {
        entityOpts.push({
          id: acc.group.entity.id,
          label: acc.group.entity.corporateEntityName,
          value: acc.group.entity.id,
        });

        pushedEntity.push(acc.group.entity.id);
      }
      if (pushedSecAccount.indexOf(acc.group.clientSecuritiesAccount.id) === -1) {
        securityAccountOpts.push({
          id: acc.group.clientSecuritiesAccount?.id,
          label: `${acc.group.clientSecuritiesAccount?.accountNumber} | ${acc.portfolio?.name}`,
          value: acc.group.clientSecuritiesAccount?.id,
          original: acc,
        });
        pushedSecAccount.push(acc.group.clientSecuritiesAccount.id);
      }

      if (pushedCashAccount.indexOf(acc.accountNo) === -1) {
        cashAccountOpts.push({
          id: acc.accountNo,
          label: `${acc.accountNo}`,
          // label: `${acc.accountNo} ${v.capitalize(acc.type)}`,
          value: acc.accountNo,
          original: acc,
        });
        pushedCashAccount.push(acc.accountNo);
      }
    });
    return { entityOpts, cashAccountOpts, securityAccountOpts };
  };

  const { entityOpts, cashAccountOpts, securityAccountOpts } = getEntityAndAccounts(accounts);

  const entityOptions = entityOpts.map((entity) => ({
    data: entity,
    value: entity.id,
    label: entity.label,
  }));

  const securityAccountOptions = securityAccountOpts.map((account) => ({
    data: account,
    value: account.id,
    label: account.label,
    original: account.original,
  }));

  const entityChange = (selectedEntity) => {
    setEntityFilterValue(selectedEntity?.value);
    setCurrentlySelectedEntity(selectedEntity);
    dispatch(reportsActionCreators.doResetCashTransactions());
  };

  const securityAccountChange = (selectedAccount) => {
    setSecurityAccountFilterValue(selectedAccount.value);
    setCurrentlySelectedSecurityAccount(selectedAccount);
    setCurrentlySelectedCashAccount(null);
  };

  const cashAccountChange = (selectedAccount) => {
    setCashAccountFilterValue(selectedAccount?.value);
    setCurrentlySelectedCashAccount(selectedAccount);
    dispatch(reportsActionCreators.doResetCashTransactions());
  };

  const transactionTypeChange = (selectedTransactionType) => {
    setTransactionTypeValue(selectedTransactionType.value);
    setCurrentlySelectedTransactionType(selectedTransactionType);
  };

  const handleFetch = (filters) => {
    let qs = "";

    const { entity, securityAccount } = filters;

    if (startDate) {
      qs += `startDate=${startDate.toISOString()}&`;
    }
    if (endDate) {
      qs += `endDate=${endDate.toISOString()}&`;
    }
    if (entity) {
      qs += `entityName=${entity.value?.label}&`;
    }
    if (securityAccount) {
      qs += `portfolio_id=${securityAccount?.value?.original.portfolioId}&`;
    }
    if (cashAccountFilterValue) {
      qs += `accountNo=${cashAccountFilterValue}`;
    }
    dispatch(reportsActionCreators.doFetchCashTransactions({ qs }));
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
    { id: "isin", title: t("Cash Statement.Headers.WSN"), field: "isin", defaultHidden: true },
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

  useEffect(() => {
    if (securityAccountOptions.length === 1) {
      setCurrentlySelectedSecurityAccount(() => securityAccountOptions[0]);
    }
  }, [accounts]);

  useEffect(() => {
    const filteredCashAccounts = cashAccountOpts
      .filter((account) =>
        currentlySelectedSecurityAccount
          ? account?.original?.group.clientSecuritiesAccount.id ===
            currentlySelectedSecurityAccount.data.id
          : false
      )
      .map((account) => ({
        data: account,
        value: account.id,
        currency: account.original.currency.name,
        label: `${account.label}  `,
      }));

    setCashAccountOptions(filteredCashAccounts);

    return () => {
      dispatch(reportsActionCreators.doResetCashTransactions());
    };
  }, [currentlySelectedSecurityAccount]);

  return (
    <Fragment>
      <PageTitle title={t("Cash Statement.Cash Statement")} />
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
                  currentlySelectedOption={
                    entityOptions.length === 1 ? entityOptions[0] : currentlySelectedEntity
                  }
                  setCurrentlySelectedOption={setCurrentlySelectedEntity}
                  customOnChange={(selectedEntity) => {
                    entityChange(selectedEntity);
                  }}
                  hasDefaultValue={entityOptions.length === 1}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="securityAccount"
                  label="Safekeeping Account"
                  options={securityAccountOptions}
                  currentlySelectedOption={currentlySelectedSecurityAccount}
                  setCurrentlySelectedOption={setCurrentlySelectedSecurityAccount}
                  setCustomClear={() => {
                    setCashAccountOptions([]);
                    setCurrentlySelectedCashAccount(null);
                  }}
                  customOnChange={(selectedAccount) => {
                    securityAccountChange(selectedAccount);
                  }}
                  hasDefaultValue={securityAccountOptions.length === 1}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="account"
                  label="Cash Account"
                  options={cashAccountOptions}
                  currentlySelectedOption={currentlySelectedCashAccount}
                  setCurrentlySelectedOption={setCurrentlySelectedCashAccount}
                  customComponent={{
                    Option: ReactSelectCurrencyOption,
                    ValueContainer: (props) =>
                      ReactSelectCurrencySingleValueContainer({
                        ...props,
                        currency: props?.getValue()[0]?.currency,
                      }),
                  }}
                  customOnChange={(selectedAccount) => {
                    cashAccountChange(selectedAccount);
                  }}
                />
              </Grid>

              {/* <Grid item xs={12} lg={1} container></Grid> */}

              <Grid item xs={12} md={12} lg={3} justifyContent="flex-end">
                {/* <ReportingButtons handleClear={handleClear} handleFilter={handleFilter} disableApplyBtn={cashAccountFilterValue === null} data={filteredRows} /> */}
                <FilterButton
                  label="Apply"
                  onClick={(filters) => {
                    handleFetch(filters);
                  }}
                  disabled={(filters) =>
                    !filters.entity || !filters.securityAccount || !filters.account
                  }
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
                  currentlySelectedOption={currentlySelectedTransactionType}
                  setCurrentlySelectedOption={setCurrentlySelectedTransactionType}
                  customOnChange={(selectedType) => {
                    transactionTypeChange(selectedType);
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <DateRangePicker
                  name="entryDate"
                  label="Entry Date"
                  defaultFilter="none"
                  setStartDateValue={setStartDateValue}
                  setEndDateValue={setEndDateValue}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                {/* <Grid container>
                  <Typography variant="body1" className="white-text">
                    .
                  </Typography>
                </Grid> */}

                <ExportButtons tableRef={tableRef} name="Cash Statement Report" />
              </Grid>

              <Grid item xs={12}>
                <ReportingInfo
                  cashAccount={currentlySelectedCashAccount}
                  securityAccount={currentlySelectedSecurityAccount}
                />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
        </div>

        <FilterConsumer>
          {({ filters, filterColumns }) => {
            console.log(filterColumns, "consumer");
            const filteredData = filteredRows
              .filter((row) => {
                //  Entry Date range Filter
                if (filters?.entryDate?.value?.startDate && filters?.entryDate?.value?.endDate) {
                  const { startDate: fromDate, endDate: toDate } = filters?.entryDate.value;
                  const isInRange = dateWithinRange(row?.date, fromDate, toDate);
                  return row?.date ? isInRange : null;

                  // return moment(row.date).isBetween(fromDate, toDate);
                }
                return true;
              })
              .filter((row) => {
                if (filters?.transactionType) {
                  let returnValue = false;

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
              })
              ?.filter((row) => {
                if (filters?.account) {
                  return row.account !== filters?.account?.value?.label;
                }
                return false;
              })
              ?.filter((row) => {
                if (filters?.securityAccount) {
                  return row.securityAccount !== filters?.securityAccount?.value?.label;
                }

                return false;
              })
              ?.filter((row) => {
                if (filters?.entity) {
                  return row.entity !== filters?.entity?.value?.label;
                }

                return false;
              });
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

export default CashStatementReportPage;
