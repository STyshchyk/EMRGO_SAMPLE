import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import MaterialTable from "@material-table/core";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import moment from "moment";
import v from "voca";

import {
  accountTypeRenderer,
  currencyRenderer,
  reportDateRenderer,
} from "../../constants/renderers";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as reportsActionCreators from "../../redux/actionCreators/reports";
import tableStyles from "../../styles/cssInJs/materialTable";
import { dateFormatter } from "../../utils/formatter";
import DatePicker from "../FilterComponents/DatePickerUpdated";
import DropdownFilter from "../FilterComponents/DropdownFilter";
import ExportButtons from "../FilterComponents/ExportButtons";
import FilterButton from "../FilterComponents/FilterButton";
import ReportingInfo from "../FilterComponents/ReportingInfo";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";

const ALL_ENTITIES_OPTION = {
  label: "All",
  value: "all",
};

const generateTransactions = (acc) => ({
  id: acc.id,
  date: dateFormatter(acc.date, "DD/MM/YYYY"),
  // transactionType: getFormattedBalanceType(acc.activityType),
  entity: acc.entity,
  account: acc.account,
  currency: acc?.currency?.name ?? "",
  balance: acc.balance,
  accountType: acc.accountType,
  lastMovement: acc.lastMovement,
});

const CashBalancesTable = ({ data, accounts }) => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports", "blotter"]);

  const [currentlySelectedEntity, setCurrentlySelectedEntity] = useState(null);
  const [disabledCurrency, setDisabledCurrency] = useState(false);
  const [currentlySelectedSecurityAccount, setCurrentlySelectedSecurityAccount] = useState(null);
  const [currentlySelectedCashAccount, setCurrentlySelectedCashAccount] = useState(null);
  const [currentlySelectedCurrency, setCurrentlySelectedCurrency] = useState(null);

  const [cashAccountOptions, setCashAccountOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const [dateFilterValue, setDateFilterValue] = useState(moment());
  const [isAllEntitiesOptionSelected, setIsAllEntitiesOptionSelected] = useState(false);

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
          entityId: acc.group.entity.id,
          label: acc.group.entity.corporateEntityName,
          value: acc.group.entity.id,
        });

        pushedEntity.push(acc.group.entity.id);
      }
      if (pushedSecAccount.indexOf(acc.group.clientSecuritiesAccount.id) === -1) {
        securityAccountOpts.push({
          id: acc.group.clientSecuritiesAccount?.id,
          label: acc.group.clientSecuritiesAccount?.accountNumber,
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

  if (Array.isArray(entityOptions) && entityOptions.length > 1) {
    entityOptions.unshift(ALL_ENTITIES_OPTION);
  }

  const securityAccountOptions = securityAccountOpts.map((account) => ({
    data: account,
    value: account.id,
    label: account.label,
    original: account.original,
  }));

  const handleEntityChange = (selectedEntity) => {
    // const tempSecurityAccountList = securityAccountOpts
    //   .filter((securityAccount) =>
    //     selectedEntity ? securityAccount.original.group.entity.id === selectedEntity.data.id : true
    //   )
    //   .map((entity) => ({ data: entity, value: entity.id, label: entity.label }));
    //
    //  if (selectedEntity) {
    //    setCurrentlySelectedSecurityAccount(tempSecurityAccountList[0]);
    //  }
    dispatch(reportsActionCreators.doResetCashBalances());
  };

  const handleSecurityAccountChange = (selectedAccount) => {
    setCurrentlySelectedSecurityAccount(selectedAccount);

    const tempEntitiesList = entityOpts
      .filter((entity) =>
        selectedAccount ? entity.id === selectedAccount.data.original.group.entity.id : true
      )
      .map((entity) => ({ data: entity, value: entity.id, label: entity.label }));

    if (selectedAccount) {
      setCurrentlySelectedEntity(tempEntitiesList[0]);
    }

    const filteredCashAccounts = cashAccountOpts
      .filter((account) =>
        selectedAccount
          ? account?.original?.group.clientSecuritiesAccount.id === selectedAccount.data.id
          : false
      )
      .map((account) => ({
        data: account,
        value: account.id,
        label: `${account.label}  ${account?.original?.currency?.name}`,
      }));

    setCashAccountOptions(filteredCashAccounts);

    const filteredCurrencies = [
      ...new Map(
        filteredCashAccounts?.map((cashAccount) => [
          cashAccount?.data?.original?.currency.id,
          cashAccount,
        ])
      ).values(),
    ].map((currency) => {
      const currencyObject = {
        label: currency.data?.original?.currency.name,
        value: currency.data?.original?.currency.id,
      };
      return currencyObject;
    });

    setCurrencyOptions(filteredCurrencies);

    dispatch(reportsActionCreators.doResetCashBalances());
  };

  const handleFetch = (filters) => {
    let qs = "";
    const { date } = filters;

    qs += `date=${date?.value?.toISOString()}&`;

    if (currentlySelectedEntity.value !== "all") {
      qs += `entityId=${currentlySelectedEntity?.data.entityId}`;
    }
    if (currentlySelectedSecurityAccount && false) {
      // FIX THIS
      qs += `portfolio_id=${currentlySelectedSecurityAccount?.original.group.clientSecuritiesAccount.portfolioId}`;
    }

    dispatch(reportsActionCreators.doFetchCashBalances({ qs }));
  };

  const columns = [
    {
      id: "date",
      title: t("Cash Balances.Headers.Date"),
      field: "date",
      exportConfig: { width: 8 },
    },
    { id: "entity", title: t("Cash Balances.Headers.Entity"), field: "entity" },
    {
      id: "account",
      title: t("Cash Balances.Headers.Account"),
      field: "account",
      exportConfig: { width: 7 },
      defaultFilter: currentlySelectedSecurityAccount,
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        return term === rowData?.account;
      },
    },
    {
      id: "currency",
      title: t("Cash Balances.Headers.Currency"),
      field: "currency",
      exportConfig: { width: 6 },
      defaultFilter: currentlySelectedCurrency,
      customFilterAndSearch: (term, rowData) => {
        if (!term) return true;
        return term === rowData?.currency;
      },
    },
    {
      id: "balance",
      title: t("Cash Balances.Headers.Balance"),
      field: "balance",
      render: (rowData) => rowData.balance,
      exportConfig: { render: (rowData) => currencyRenderer(rowData.balance), align: "right" },
      // type: 'numeric',
    },
    {
      id: "accountType",
      title: t("Cash Balances.Headers.Account Type"),
      field: "accountType",
      render: (rowData) => v.capitalize(rowData.accountType),
      exportConfig: { render: (rowData) => accountTypeRenderer(rowData.accountType), width: 20 },
    },
    {
      id: "lastMovement",
      title: t("Cash Balances.Headers.Last Movement"),
      field: "lastMovement",
      render: (rowData) => reportDateRenderer(rowData.lastMovement),
      exportConfig: { render: (rowData) => reportDateRenderer(rowData.lastMovement) },
    },
  ];

  const transformData = (originalData) => {
    if (!originalData) return {};

    const { date, entity, account, currency, balance, accountType, lastMovement } = originalData;

    return {
      date: {
        label: t("Cash Balances.Headers.Date"),
        value: date || "",
      },
      entity: {
        label: t("Cash Balances.Headers.Entity"),
        value: entity || "",
      },
      account: {
        label: t("Cash Balances.Headers.Account"),

        value: account || "",
      },
      currency: {
        label: t("Cash Balances.Headers.Currency"),

        value: currency || "",
      },
      balance: {
        label: t("Cash Balances.Headers.Balance"),

        value: balance || "",
      },
      accountType: {
        label: t("Cash Balances.Headers.Account Type"),

        value: v.capitalize(accountType) || "",
      },
      lastMovement: {
        label: t("Cash Balances.Headers.Last Movement"),

        value: reportDateRenderer(lastMovement) || "",
      },
    };
  };

  const transformedData = data?.map((d) => transformData(d));
  const matchCashAccCurrencyWithCurrency = (selectedAcccount) => {
    const currenctSelectedAcc = selectedAcccount?.data?.original?.currency?.id;
    const filteredCurrency =
      currencyOptions &&
      currencyOptions.filter((currency) => currency.value === currenctSelectedAcc);
    setCurrentlySelectedCurrency(...filteredCurrency);
    setDisabledCurrency(true);
  };
  return (
    <Fragment>
      <FilterProvider tableKey="cash_balances">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <TableFiltersWrapper
            tableRef={tableRef}
            data={data}
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
                  setClearDisabled={setDisabledCurrency}
                  customOnChange={(selectedEntity) => {
                    if (selectedEntity.value !== ALL_ENTITIES_OPTION.value) {
                      setIsAllEntitiesOptionSelected(false);
                      handleEntityChange(selectedEntity);
                      return;
                    }

                    setIsAllEntitiesOptionSelected(true);
                    setCurrentlySelectedEntity(ALL_ENTITIES_OPTION);
                  }}
                  currentlySelectedOption={currentlySelectedEntity}
                  setCurrentlySelectedOption={setCurrentlySelectedEntity}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="securityAccount"
                  setClearDisabled={setDisabledCurrency}
                  label="Safekeeping Account"
                  options={securityAccountOptions}
                  currentlySelectedOption={currentlySelectedSecurityAccount}
                  setCurrentlySelectedOption={setCurrentlySelectedSecurityAccount}
                  customOnChange={(selectedAccount) => {
                    handleSecurityAccountChange(selectedAccount);
                  }}
                  isDisabled={isAllEntitiesOptionSelected}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FilterButton
                  label="Apply"
                  onClick={(filters) => {
                    handleFetch(filters);
                  }}
                  disabled={(filters) => !(filters.entity || filters.securityAccount)}
                />
              </Grid>
              <Grid item xs={12} lg={2} container></Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="account"
                  label="Cash Account"
                  setClearDisabled={setDisabledCurrency}
                  options={cashAccountOptions}
                  currentlySelectedOption={currentlySelectedCashAccount}
                  setCurrentlySelectedOption={setCurrentlySelectedCashAccount}
                  customOnChange={(selected) => {
                    matchCashAccCurrencyWithCurrency(selected);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  name="currency"
                  label="Currency"
                  setClearDisabled={setDisabledCurrency}
                  options={currencyOptions}
                  currentlySelectedOption={currentlySelectedCurrency}
                  setCurrentlySelectedOption={setCurrentlySelectedCurrency}
                  isDisabled={disabledCurrency}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3} container>
                <DatePicker
                  name="date"
                  label="Date"
                  defaultFilter={moment()}
                  maxDate={moment()}
                  disableClear
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ExportButtons tableRef={tableRef} name="Cash Balances Report" />
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
          {({ filterColumns, filters }) => {
            const filteredData = data
              ?.filter((row) => {
                if (filters?.account) {
                  return row.account === filters?.account?.value?.value;
                }
                return true;
              })
              .filter((row) => {
                if (filters?.currency) {
                  return row.currency === filters?.currency?.value?.label;
                }
                return true;
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
    </Fragment>
  );
};

export { generateTransactions };

export default CashBalancesTable;
