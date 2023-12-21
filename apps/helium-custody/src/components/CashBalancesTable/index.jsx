import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import moment from "moment";
import v from "voca";

import { accountTypeRenderer, reportDateRenderer } from "../../constants/renderers";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import * as reportsActionCreators from "../../redux/actionCreators/reports";
import * as billingAndPaymentsSelectors from "../../redux/selectors/cashManagement";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import DatePicker from "../FilterComponents/DatePickerUpdated";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../FilterComponents/ExportButtons";
import FilterButton from "../FilterComponents/FilterButton";
import ReportingInfo from "../FilterComponents/ReportingInfo";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import ReactSelectCurrencyOption from "../ReactSelectCurrencyOption";
import ReactSelectCurrencySingleValueContainer from "../ReactSelectCurrencySingleValueContainer";

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
  safekeepingAccount: acc.portfolio.accountNumber,
  portfolio: acc.portfolio.name,
  currency: acc?.currency?.name ?? "",
  balance:
    acc.balance &&
    convertNumberToIntlFormat(acc?.balance, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  accountType: acc.accountType,
  lastMovement: acc.lastMovement,
});

const CashBalancesTable = ({ data, accounts, safekeepingAccounts }) => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports", "blotter"]);
  const [isEmrgoSelected, setEmrgoSelected] = useState(false);
  const [disabledCurrency, setDisabledCurrency] = useState(false);
  const [currentlySelectedSafekeepingAccount, setCurrentlySelectedSafekeepingAccount] =
    useState(null);
  const [currentlySelectedCashAccount, setCurrentlySelectedCashAccount] = useState(null);
  const [currentlySelectedCurrency, setCurrentlySelectedCurrency] = useState(null);
  const [safekeepingAccountOptions, setSafeAccountOptions] = useState(null);

  const [cashAccountOptions, setCashAccountOptions] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState(null);
  const emrgoOwnews = useSelector(billingAndPaymentsSelectors.selectEmrgoOwners);
  const entityList = [
    ...safekeepingAccounts.map((i) => ({
      label: i.entity?.name ?? i.entityName, //For EMRGO user
      value: i.entity?.id ?? i.id,
      data: i.entity ?? i,
    })),
  ];

  const entityOptions = [...new Map(entityList.map((item) => [item.value, item])).values()];

  if (Array.isArray(entityOptions) && entityOptions.length > 1) {
    entityOptions.unshift(ALL_ENTITIES_OPTION);
  }

  const safeekingAccountList = [
    ...safekeepingAccounts
      .filter((elem) => elem.entityName !== "Emrgo") //Remove EMRGO as it does not have safekeeping account, might change in a future
      .map((i) => ({
        label: `${i.name} (${i?.securitiesAccount?.accountNumber})`,
        value: i.id,
        entityId: i.entity_id,
        account: i,
      })),
  ];
  const handleEntityChange = (selectedEntity) => {
    if (selectedEntity && selectedEntity.data?.entityName === "Emrgo") {
      setEmrgoSelected(true);
      setSafeAccountOptions([]);
    } else if (selectedEntity && selectedEntity.value !== "all") {
      setEmrgoSelected(false);
      const filteredSafekeepingAccounts = safeekingAccountList.filter((account) =>
        selectedEntity ? account?.entityId === selectedEntity.value : false
      );
      setSafeAccountOptions(filteredSafekeepingAccounts);
    } else {
      setSafeAccountOptions(safeekingAccountList);
      setEmrgoSelected(false);
    }
    dispatch(reportsActionCreators.doResetCashBalances());
  };

  const handleFetch = (filters) => {
    const { date, entity, safekeepingAccount } = filters;
    const params = {
      date: date ? date.value.toISOString() : moment().endOf("day").toISOString(),
      portfolio_id: safekeepingAccount?.value?.value,
      entityId: entity?.value?.value,
    };

    const fetchCashBalances = (payload) =>
      dispatch(reportsActionCreators.doFetchCashBalances(payload));

    fetchCashBalances({ params });
  };

  useEffect(() => {
    if (data?.length > 0 || data !== null) {
      const cashAccountOptions = data?.map((cashAccount) => {
        return {
          data: cashAccount,
          value: cashAccount.account,
          currency: cashAccount.currency,
          label: `${cashAccount.account}`,
        };
      });

      const filteredCashAccounts = [
        ...new Map(cashAccountOptions?.map((item) => [item.value, item])).values(),
      ];

      setCashAccountOptions(filteredCashAccounts);
      const currencyOptions = data?.map((cashAccount) => {
        return {
          data: cashAccount,
          value: cashAccount.currency,
          label: `${cashAccount.currency}`,
        };
      });

      const filteredCurrencies = [
        ...new Map(currencyOptions?.map((item) => [item.value, item])).values(),
      ];

      setCurrencyOptions(filteredCurrencies);
    }
  }, [data]);

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
      title: t("Cash Balances.Headers.Cash Account"),
      field: "account",
      exportConfig: { width: 7 },
    },
    {
      id: "portfolio",
      title: t("Cash Balances.Headers.Portfolio"),
      field: "portfolio",
      exportConfig: { width: 7 },
    },
    {
      id: "safekeepingAccount",
      title: t("Cash Balances.Headers.Safekeeping Account"),
      field: "safekeepingAccount",
      exportConfig: { width: 7 },
    },
    {
      id: "currency",
      title: t("Cash Balances.Headers.Currency"),
      field: "currency",
      exportConfig: { width: 6 },
      // defaultFilter: currentlySelectedCurrency,
      // customFilterAndSearch: (term, rowData) => {
      //   if (!term) return true;
      //   return term === rowData?.currency;
      // },
    },
    {
      id: "balance",
      title: t("Cash Balances.Headers.Balance"),
      field: "balance",
      render: (rowData) => rowData.balance,
      exportConfig: { align: "right" },
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
  const matchCashAccCurrencyWithCurrency = (selectedAcccount) => {
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
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="entity"
                  label="Entity"
                  options={entityOptions}
                  customOnChange={(selectedEntity) => {
                    handleEntityChange(selectedEntity);
                  }}
                  customClearChange={() => {
                    handleEntityChange();
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="safekeepingAccount"
                  label="Safekeeping Account"
                  options={safekeepingAccountOptions || safeekingAccountList}
                  customOnChange={(selectedEntity) => {
                    setCurrentlySelectedSafekeepingAccount(selectedEntity);
                  }}
                  customClearChange={() => {
                    setCurrentlySelectedSafekeepingAccount();
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <DatePicker
                  name="date"
                  label="Date"
                  defaultFilter={moment()}
                  maxDate={moment()}
                  disableClear
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <FilterButton
                  label="Apply"
                  onClick={(filters) => {
                    handleFetch(filters);
                  }}
                  disabled={(filters) => {
                    return (
                      (!filters.entity || !filters.safekeepingAccount) &&
                      filters.entity?.value?.value !== "all" &&
                      !isEmrgoSelected
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={2} container></Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  setClearDisabled={setDisabledCurrency}
                  name="cashAccount"
                  label="Cash Account"
                  options={cashAccountOptions}
                  customComponent={{
                    Option: ReactSelectCurrencyOption,
                    ValueContainer: (props) =>
                      ReactSelectCurrencySingleValueContainer({
                        ...props,
                        currency: props?.getValue()[0]?.currency,
                      }),
                  }}
                  currentlySelectedOption={currentlySelectedCashAccount}
                  setCurrentlySelectedOption={setCurrentlySelectedCashAccount}
                  customOnChange={(selected) => {
                    matchCashAccCurrencyWithCurrency(selected);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3} container>
                <DropdownFilter
                  setClearDisabled={setDisabledCurrency}
                  name="currency"
                  label="Currency"
                  options={currencyOptions}
                  currentlySelectedOption={currentlySelectedCurrency}
                  setCurrentlySelectedOption={setCurrentlySelectedCurrency}
                  isDisabled={disabledCurrency}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3} container></Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ExportButtons tableRef={tableRef} name="Cash Balances Report" />
              </Grid>
              <FilterConsumer>
                {({ filters, filterColumns }) => {
                  return (
                    <Grid item xs={12}>
                      <ReportingInfo
                        cashAccount={filters?.cashAccount}
                        securityAccount={filters?.safekeepingAccount}
                      />
                    </Grid>
                  );
                }}
              </FilterConsumer>
            </Grid>
          </TableFiltersWrapper>
        </div>

        <FilterConsumer>
          {({ filterColumns, filters }) => {
            const filteredData = data
              ?.filter((row) => {
                if (filters?.cashAccount) {
                  return row.account === filters?.cashAccount?.value?.value;
                }
                return true;
              })
              ?.filter((row) => {
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
