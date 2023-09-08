import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { CsvBuilder } from "filefy";
import moment from "moment";
import v from "voca";

import DateRangePicker from "../../../components/FilterComponents/DateRangePicker";
import DropdownFilter from "../../../components/FilterComponents/DropdownFilter";
import ExportButtons from "../../../components/FilterComponents/ExportButtons";
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
import { dateFormatter } from "../../../utils/formatter";

const getFormattedBalanceType = (accType) => v.capitalize(accType.split("_").join(" "));

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
  const { t } = useTranslation(["cash_management", "reports"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const transactions = useSelector(billingAndPaymentsSelectors.selectTransactions);

  const currentEntityGroupID = currentEntityGroup?.id;
  const accounts = useSelector(billingAndPaymentsSelectors.selectAccounts);

  const [entityFilterValue, setEntityFilterValue] = useState(null);
  console.log(
    "🚀 ~ file: index.jsx:66 ~ CashStatementPage ~ entityFilterValue:",
    entityFilterValue
  );
  const [accountFilterValue, setAccountFilterValue] = useState(null);
  const [securityAccountFilterValue, setSecurityAccountFilterValue] = useState(null);
  const [transactionTypeValue, setTransactionTypeValue] = useState("all");
  const [currentlySelectedEntity, setCurrentlySelectedEntity] = useState(null);
  const [currentlySelectedAccount, setCurrentlySelectedAccount] = useState(null);
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

  const getRowsForCSV = () => {
    const boxes = [];
    filteredRows.forEach((row) => {
      boxes.push([
        row.date || "--",
        row.transactionType || "--",
        row.refNo || "--",
        row.isin || "--",
        row.narrative || "--",
        row.debit || "--",
        row.credit || "--",
        row.balance || "--",
      ]);
    });
    return boxes;
  };

  const getEntityAndAccounts = (accs) => {
    const entityOpts = [];
    const accountOpts = [];
    const securityAccountOpts = [];
    const pushedEntity = [];
    const pushedAccount = [];

    accs.forEach((acc) => {
      if (pushedEntity.indexOf(acc.group.entity.id) === -1) {
        entityOpts.push({
          id: acc.group.entity.id,
          label: v.capitalize(acc.group.entity.corporateEntityName),
          value: acc.group.entity.id,
        });

        if (acc.group.clientSecuritiesAccount) {
          securityAccountOpts.push({
            id: acc.group.clientSecuritiesAccount?.id,
            label: acc.group.clientSecuritiesAccount?.accountNumber,
            value: acc.group.clientSecuritiesAccount?.id,
            original: acc,
          });
        }
        pushedEntity.push(acc.group.entity.id);
      }

      if (pushedAccount.indexOf(acc.accountNo) === -1) {
        accountOpts.push({
          id: acc.accountNo,
          label: `${acc.accountNo} ${v.capitalize(acc.type)}`,
          value: acc.accountNo,
          original: acc,
        });
        pushedAccount.push(acc.accountNo);
      }
    });
    return { entityOpts, accountOpts, securityAccountOpts };
  };

  const { entityOpts, accountOpts, securityAccountOpts } = getEntityAndAccounts(accounts);

  const filteredEntity = entityOpts.map((entity) => ({
    data: entity,
    value: entity.id,
    label: entity.label,
  }));

  const filteredSecurityAccounts = securityAccountOpts.map((account) => ({
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
      render: (rowData) => currencyRenderer(rowData.debit),
      exportConfig: {
        render: (rowData) => (rowData.debit !== "-" ? currencyRenderer(rowData.debit) : "-"),
        align: "right",
      },
      // type: 'numeric',
    },
    {
      id: "credit",
      title: t("Cash Statement.Headers.Credit"),
      field: "credit",
      render: (rowData) => currencyRenderer(rowData.credit),
      exportConfig: {
        render: (rowData) => (rowData.credit !== "-" ? currencyRenderer(rowData.credit) : "-"),
        align: "right",
      },
      // type: 'numeric',
    },
    {
      id: "balance",
      title: t("Cash Statement.Headers.Balance"),
      field: "balance",
      render: (rowData) => currencyRenderer(rowData.balance),
      exportConfig: { render: (rowData) => currencyRenderer(rowData.balance), align: "right" },
      // type: 'numeric',
    },
  ];

  let filteredAccounts = accountOpts
    .filter((account) =>
      entityFilterValue ? account.original.group.entity.id === entityFilterValue : false
    )
    .map((acc) => ({
      data: acc,
      value: acc.id,
      label: acc.label,
    }));

  const exportCSV = () => {
    new CsvBuilder("cash_statement.csv")
      .addRow([
        t("Cash Statement.Account"),
        `${
          currentlySelectedAccount
            ? currentlySelectedAccount.data.original.accountNo
            : t("Cash Statement.NA")
        } | ${
          currentlySelectedAccount
            ? currentlySelectedAccount.data.original.type
            : t("Cash Statement.NA")
        }`,
        "",
        t("Cash Statement.Currency"),
        `${
          currentlySelectedAccount
            ? currentlySelectedAccount.data.original.currency.name
            : t("Cash Statement.NA")
        }`,
      ])
      .addRow([""])
      .addRow([
        t("Cash Statement.Headers.Date"),
        t("Cash Statement.Headers.Transaction_Balance Type"),
        t("Cash Statement.Headers.Reference No"),
        t("Cash Statement.Headers.Related ISIN"),
        t("Cash Statement.Headers.Narrative"),
        t("Cash Statement.Headers.Debit"),
        t("Cash Statement.Headers.Credit"),
        t("Cash Statement.Headers.Balance"),
      ])
      .addRows(getRowsForCSV())
      .exportFile();
  };

  const handleFilter = () => {
    let qs = "";
    if (startDate) {
      qs += `startDate=${startDate.toISOString()}&`;
    }
    if (endDate) {
      qs += `endDate=${endDate.toISOString()}&`;
    }
    if (currentlySelectedEntity) {
      qs += `entityName=${currentlySelectedEntity.label}&`;
    }
    if (currentlySelectedAccount) {
      qs += `accountNo=${currentlySelectedAccount.value}`;
    }
    dispatch(billingAndPaymentsActionCreators.doFetchTransactions({ qs }));
  };

  const entityChange = (selectedEntity) => {
    setEntityFilterValue(selectedEntity.value);
    setCurrentlySelectedEntity(selectedEntity);
    setAccountFilterValue(null);
    filteredAccounts = accountOpts
      .filter((account) =>
        selectedEntity !== null ? account.original.group.entity.id === selectedEntity.value : false
      )
      .map((account) => ({
        data: account,
        value: account.id,
        label: account.label,
      }));

    const tempSecurityAccountList = securityAccountOpts
      .filter((securityAccount) =>
        selectedEntity ? securityAccount.original.group.entity.id === selectedEntity.data.id : true
      )
      .map((entity) => ({ data: entity, value: entity.id, label: entity.label }));

    if (
      selectedEntity &&
      Array.isArray(tempSecurityAccountList) &&
      tempSecurityAccountList.length > 0
    ) {
      setSecurityAccountFilterValue(tempSecurityAccountList[0].value);
      setCurrentlySelectedSecurityAccount(tempSecurityAccountList[0]);
    }

    dispatch(billingAndPaymentsActionCreators.doResetTransactions());
  };

  const accountChange = (selectedAccount) => {
    setAccountFilterValue(selectedAccount.value);
    setCurrentlySelectedAccount(selectedAccount);
    const tempEntitiesList = entityOpts
      .filter((entity) =>
        selectedAccount ? entity.id === selectedAccount.data.original.group.entity.id : true
      )
      .map((entity) => ({ data: entity, value: entity.id, label: entity.label }));

    if (selectedAccount && Array.isArray(tempEntitiesList) && tempEntitiesList.length > 0) {
      setEntityFilterValue(tempEntitiesList[0].value);
      setCurrentlySelectedEntity(tempEntitiesList[0]);
    }
    dispatch(billingAndPaymentsActionCreators.doResetTransactions());
  };

  const securityAccountChange = (selectedAccount) => {
    setSecurityAccountFilterValue(selectedAccount.value);
    setCurrentlySelectedSecurityAccount(selectedAccount);

    const tempEntitiesList = entityOpts
      .filter((entity) =>
        selectedAccount ? entity.id === selectedAccount.data.original.group.entity.id : true
      )
      .map((entity) => ({ data: entity, value: entity.id, label: entity.label }));

    if (selectedAccount && Array.isArray(tempEntitiesList) && tempEntitiesList.length > 0) {
      setEntityFilterValue(tempEntitiesList[0].value);
      setCurrentlySelectedEntity(tempEntitiesList[0]);
    }
    dispatch(billingAndPaymentsActionCreators.doResetTransactions());
  };

  const transactionTypeChange = (selectedTransactionType) => {
    setTransactionTypeValue(selectedTransactionType.value);
    setCurrentlySelectedTransactionType(selectedTransactionType);
  };

  // const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];
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
                options={filteredEntity}
                currentlySelectedOption={currentlySelectedEntity}
                setCurrentlySelectedOption={setCurrentlySelectedEntity}
                customOnChange={(selectedEntity) => {
                  entityChange(selectedEntity);
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <DropdownFilter
                name="securityAccount"
                label="Security Account"
                options={filteredSecurityAccounts}
                currentlySelectedOption={currentlySelectedSecurityAccount}
                setCurrentlySelectedOption={setCurrentlySelectedSecurityAccount}
                customOnChange={(selectedAccount) => {
                  securityAccountChange(selectedAccount);
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <DropdownFilter
                name="account"
                label=" Cash Account"
                options={filteredAccounts}
                currentlySelectedOption={currentlySelectedAccount}
                setCurrentlySelectedOption={setCurrentlySelectedAccount}
                customComponent={{
                  Option: (props) =>
                    ReactSelectCurrencyOption({
                      ...props,
                      currency: props?.data?.data.original.currency.name,
                    }),
                  ValueContainer: (props) =>
                    ReactSelectCurrencySingleValueContainer({
                      ...props,
                      currency: props.getValue()[0]?.data?.original.currency.name,
                    }),
                }}
                customOnChange={(selectedAccount) => {
                  accountChange(selectedAccount);
                }}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={3} className="w-full">
              <Box mt={4} mb={1}>
                <Button
                  fullWidth
                  size="large"
                  disabled={currentlySelectedAccount === null}
                  variant="contained"
                  color="primary"
                  onClick={() => handleFilter()}
                >
                  {t("Cash Statement.Filters.Apply")}
                </Button>
              </Box>
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
                name="daterange"
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
            const filteredData = filteredRows.filter((row) => {
              // // Entry Date range Filter
              // if (filters?.entryDate?.value?.startDate && filters?.entryDate?.value?.endDate) {
              //   const { startDate: fromDate, endDate: toDate } = filters?.entryDate.value;
              //   return moment(row.date).isBetween(fromDate, toDate);
              // }
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
