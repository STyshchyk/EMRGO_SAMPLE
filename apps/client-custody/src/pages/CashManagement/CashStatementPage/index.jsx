import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import moment from "moment";
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
import * as billingAndPaymentsActionCreators from "../../../redux/actionCreators/cashManagement";
import * as authSelectors from "../../../redux/selectors/auth";
import * as billingAndPaymentsSelectors from "../../../redux/selectors/cashManagement";
import tableStyles from "../../../styles/cssInJs/materialTable";
import { dateWithinRange } from "../../../utils/dates";
import { dateFormatter } from "../../../utils/formatter";

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
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["cash_management", "blotter", "reports"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const transactions = useSelector(billingAndPaymentsSelectors.selectTransactions);

  const currentEntityGroupID = currentEntityGroup?.id;
  const accounts = useSelector(billingAndPaymentsSelectors.selectAccounts);

  const [entityFilterValue, setEntityFilterValue] = useState(null);
  const [accountFilterValue, setAccountFilterValue] = useState(null);
  const [securityAccountFilterValue, setSecurityAccountFilterValue] = useState(null);
  const [transactionTypeValue, setTransactionTypeValue] = useState("all");
  const [currentlySelectedEntity, setCurrentlySelectedEntity] = useState(null);
  const [currentlySelectedAccount, setCurrentlySelectedAccount] = useState(null);
  const [cashAccountOptions, setCashAccountOptions] = useState([]);
  const cashAccountClearRef = useRef(null);
  const [currentlySelectedSecurityAccount, setCurrentlySelectedSecurityAccount] = useState(null);
  const [currentlySelectedTransactionType, setCurrentlySelectedTransactionType] = useState({
    label: "All",
    value: "all",
  });
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);

  const startDate = startDateValue ?? null;
  const endDate = endDateValue ?? null;

  // const entities = useSelector(authSelectors.selectOwnEntityNames);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchDropdownValues(payload));
    fetchFormOptions({
      options: ["bankAccountTypes"],
    });
  }, [dispatch]);

  useEffect(() => {
    const fetchAccounts = (payload) =>
      dispatch(billingAndPaymentsActionCreators.doFetchAccounts(payload));
    fetchAccounts();

    return () => {
      dispatch(billingAndPaymentsActionCreators.doResetTransactions());
    };
  }, [dispatch]);

  useEffect(() => {
    setFilteredRows(getTableData(transactions));
  }, [transactions]);

  useEffect(() => {
    if (
      !currentlySelectedEntity ||
      !currentlySelectedSecurityAccount ||
      !currentlySelectedAccount
    ) {
      setFilteredRows([]);
    }
  }, [currentlySelectedEntity, currentlySelectedSecurityAccount, currentlySelectedAccount]);

  const getEntityAndAccounts = (accs) => {
    const entityOpts = [];
    const accountOpts = [];
    const securityAccountOpts = [];
    const pushedEntity = [];
    const pushedSecurityAccountOpts = [];
    const pushedAccount = [];
    accs.forEach((acc) => {
      if (pushedEntity.indexOf(acc.group.entity.id) === -1) {
        entityOpts.push({
          id: acc.group.entity.id,
          label: acc.group.entity.corporateEntityName,
          value: acc.group.entity.id,
        });
        pushedEntity.push(acc.group.entity.id);
      }
      if (pushedSecurityAccountOpts.indexOf(acc.group.clientSecuritiesAccount?.id) === -1) {
        securityAccountOpts.push({
          id: acc.group.clientSecuritiesAccount?.id,
          label: `${acc.group.clientSecuritiesAccount?.accountNumber} | ${acc.portfolio.name}`,
          value: acc.group.clientSecuritiesAccount?.id,
          original: acc,
        });
        pushedSecurityAccountOpts.push(acc.group.clientSecuritiesAccount?.id);
      }
      if (pushedAccount.indexOf(acc.accountNo) === -1) {
        accountOpts.push({
          id: acc.accountNo,
          label: `${acc.accountNo}`,
          value: acc.accountNo,
          original: acc,
        });
        pushedAccount.push(acc.accountNo);
      }
    });
    return { entityOpts, accountOpts, securityAccountOpts };
  };

  const { entityOpts, accountOpts, securityAccountOpts } = getEntityAndAccounts(accounts);

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
    { id: "refNo", title: "Reference no", field: "refNo" },
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
          rowData.debit !== "-" ? currencyRenderer(rowData.debit, decimalFormat) : "-",
        align: "right",
      },
    },
    {
      id: "credit",
      title: t("Cash Statement.Headers.Credit"),
      field: "credit",
      render: (rowData) => currencyRenderer(rowData.credit, decimalFormat),
      exportConfig: {
        render: (rowData) =>
          rowData.credit !== "-" ? currencyRenderer(rowData.credit, decimalFormat) : "-",
        align: "right",
      },
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
    },
  ];

  // let filteredAccounts = accountOpts
  //   .filter((account) => {
  //     return entityFilterValue ? account.original.group.entity.id === entityFilterValue : false;
  //   })
  //   .map((acc) => ({
  //     data: acc,
  //     value: acc.id,
  //     label: acc.label,
  //   }));

  const handleFetch = (filters) => {
    const { entity, securityAccount } = filters;
    let qs = "";

    if (startDate) {
      qs += `startDate=${startDate.toISOString()}&`;
    }
    if (endDate) {
      qs += `endDate=${endDate.toISOString()}&`;
    }
    if (currentlySelectedEntity) {
      qs += `entityName=${entity?.value.label}&`;
    }
    if (currentlySelectedSecurityAccount) {
      qs += `portfolio_id=${securityAccount?.value.original.portfolioId}&`;
    }
    if (currentlySelectedAccount) {
      qs += `accountNo=${currentlySelectedAccount.value}`;
    }
    dispatch(billingAndPaymentsActionCreators.doFetchTransactions({ qs }));
  };

  const entityChange = (selectedEntity) => {
    setEntityFilterValue(selectedEntity.value);
    setCurrentlySelectedEntity(selectedEntity);
    dispatch(billingAndPaymentsActionCreators.doResetTransactions());
  };

  const accountChange = (selectedAccount) => {
    setAccountFilterValue(selectedAccount.value);
    setCurrentlySelectedAccount(selectedAccount);
    dispatch(billingAndPaymentsActionCreators.doResetTransactions());
  };

  const securityAccountChange = (selectedAccount) => {
    setSecurityAccountFilterValue(selectedAccount.value);
    setCurrentlySelectedSecurityAccount(selectedAccount);
    setCurrentlySelectedAccount(null);

    dispatch(billingAndPaymentsActionCreators.doResetTransactions());
  };

  const transactionTypeChange = (selectedTransactionType) => {
    setTransactionTypeValue(selectedTransactionType.value);
    setCurrentlySelectedTransactionType(selectedTransactionType);
  };

  useEffect(() => {
    if (securityAccountOptions.length === 1) {
      setCurrentlySelectedSecurityAccount(() => securityAccountOptions[0]);
    }
  }, [accounts]);

  useEffect(() => {
    const filteredCashAccounts = accountOpts
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
      dispatch(billingAndPaymentsActionCreators.doResetTransactions());
    };
  }, [currentlySelectedSecurityAccount]);
  return (
    <Fragment>
      <PageTitle title={t("Cash Statement.Cash Statement")} />

      <FilterProvider tableKey="cash_management_statement">
        <TableFiltersWrapper
          tableRef={tableRef}
          data={filteredRows}
          columns={columns}
          open={true}
          hideExportButtons
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
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

            <Grid item xs={12} md={6} lg={3}>
              <DropdownFilter
                name="securityAccount"
                label="Safekeeping Account"
                options={securityAccountOptions}
                currentlySelectedOption={currentlySelectedSecurityAccount}
                setCurrentlySelectedOption={setCurrentlySelectedSecurityAccount}
                setCustomClear={() => {
                  setTimeout(() => {
                    cashAccountClearRef.current.click();
                  }, 0);
                  setCashAccountOptions([]);
                  setCurrentlySelectedAccount(null);
                }}
                customOnChange={(selectedAccount) => {
                  securityAccountChange(selectedAccount);
                }}
                hasDefaultValue={securityAccountOptions.length === 1}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <DropdownFilter
                name="account"
                label=" Cash Account"
                clearButtonRef={cashAccountClearRef}
                options={cashAccountOptions}
                customComponent={{
                  Option: ReactSelectCurrencyOption,
                  ValueContainer: (props) =>
                    ReactSelectCurrencySingleValueContainer({
                      ...props,
                      currency: props?.getValue()[0]?.currency,
                    }),
                }}
                currentlySelectedOption={currentlySelectedAccount}
                setCurrentlySelectedOption={setCurrentlySelectedAccount}
                customOnChange={(selectedAccount) => {
                  accountChange(selectedAccount);
                }}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={3} className="w-full">
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
                maxDate={moment()}
              />
            </Grid>
            {/*
              <Grid item xs={12} md={6} lg={2} container>
                <Grid container justify="space-between" alignItems="flex-start">
                  <Typography variant="body1" className="bold">
                    {t('cash_management:Cash Statement.Filters.Export')}
                  </Typography>
                </Grid>
                <Box my={1} className="w-full">
                  <Button disabled={filteredRows.length === 0} variant="contained" color="primary" startIcon={<CloudDownloadIcon />} onClick={exportCSV}>
                    {t('cash_management:Cash Statement.Filters.Export Report')}
                  </Button>
                </Box>
              </Grid> */}

            <Grid item xs={12} md={6} lg={3}>
              <ExportButtons tableRef={tableRef} name="Cash Statement Report" />
            </Grid>

            {/* <Grid item xs={12}>
                <Grid item xs={12} container>
                  <Typography className={style.accountInfo__label}>{t('cash_management:Cash Statement.Account')} : </Typography>
                  <Typography className={style.accountInfo__value}>{`${currentlySelectedAccount ? currentlySelectedAccount.data.original.accountNo : t('cash_management:Cash Statement.NA')} | ${
                    currentlySelectedAccount ? currentlySelectedAccount.data.original.type : t('cash_management:Cash Statement.NA')
                  }`}</Typography>
                  <Typography className={style.accountInfo__label}>{t('cash_management:Cash Statement.Currency')} : </Typography>
                  <Typography className={style.accountInfo__value}>{`${
                    currentlySelectedAccount ? currentlySelectedAccount.data.original.currency.name : t('cash_management:Cash Statement.NA')
                  }`}</Typography>
                </Grid>

                <Grid item xs={12} container>
                  <Typography className={style.accountInfo__label}>{t('cash_management:Cash Statement.Address')} : </Typography>
                  <Typography className={style.accountInfo__value}>{`${
                    currentlySelectedSecurityAccount?.data?.original?.group?.addresses
                      ? formatAddress(currentlySelectedSecurityAccount?.data?.original?.group?.addresses)
                      : t('cash_management:Cash Statement.NA')
                  }`}</Typography>
                </Grid>
              </Grid> */}

            <Grid item xs={12}>
              <ReportingInfo
                cashAccount={currentlySelectedAccount}
                securityAccount={currentlySelectedSecurityAccount}
              />
            </Grid>
          </Grid>
        </TableFiltersWrapper>

        {/* <CashStatementTable data={rows} loading={false} /> */}

        <FilterConsumer>
          {({ filterColumns, filters }) => {
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
              });

            return (
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
            );
          }}
        </FilterConsumer>
      </FilterProvider>
    </Fragment>
  );
};

export default CashStatementPage;
