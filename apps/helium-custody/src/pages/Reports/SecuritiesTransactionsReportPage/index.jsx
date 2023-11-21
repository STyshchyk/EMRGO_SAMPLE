import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import makeAnimated from "react-select/animated";

import MaterialTable from "@material-table/core";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import moment from "moment";
import v from "voca";

import DateRangePicker from "../../../components/FilterComponents/DateRangePicker";
import DropdownFilter from "../../../components/FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../../../components/FilterComponents/ExportButtons";
import FilterButton from "../../../components/FilterComponents/FilterButton";
import TableFiltersWrapper from "../../../components/FilterComponents/TableFiltersWrapper";
import PageTitle from "../../../components/PageTitle";
// import RouteLeavingGuard from "../../../components/RouteLeavingGuard";
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../../constants/datetime";
import { reportDateRenderer } from "../../../constants/renderers";
import { FilterConsumer, FilterProvider } from "../../../context/filter-context";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as safekeepingActionCreators from "../../../redux/actionCreators/safekeeping";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
import * as safekeepingSelectors from "../../../redux/selectors/safekeeping";
import tableStyles from "../../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../../utils/formatter";
import ReportingDisclaimer from "../ReportingDisclaimer";
import style from "./style.module.scss";

const ALL_ENTITIES_OPTION = {
  label: "All",
  value: "all",
};
const FALLBACK_VALUE = "--";

const intlFormatOpts = {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
};

const animatedComponents = makeAnimated();

const SecuritiesTransactionsReportPage = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports"]);
  const childRef = useRef();
  const [isEmrgoSelected, setEmrgoSelected] = useState(false);
  const [safekeepingAccountOptions, setSafeAccountOptions] = useState(null);
  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const transactions = useSelector(reportsSelectors.selectSecuritiesTransactions) || [];

  const securitiesAccounts = useSelector(reportsSelectors.selectSecuritiesAccounts);
  const safekeepingAccounts = useSelector(safekeepingSelectors.readAccounts);

  const currentEntityGroupID = currentEntityGroup?.id;

  // const entities = useSelector(authSelectors.selectOwnEntityNames);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  let filteredRows = [];

  const entityList = [
    ...securitiesAccounts.map((i) => ({
      label: i.group?.entity?.corporateEntityName,
      value: i.group?.entity?.id,
    })),
  ];

  const entityOptionsList = [...new Map(entityList.map((item) => [item.value, item])).values()];

  if (Array.isArray(securitiesAccounts) && securitiesAccounts.length > 1) {
    entityOptionsList.unshift(ALL_ENTITIES_OPTION);
  }
  const safeekingAccountList = [
    ...securitiesAccounts.map((i) => ({
      label: `${i.portfolio?.name} (${i?.accountNumber})`,
      value: i.portfolioId,
      entityId: i.portfolio.entity_id,
      name: i.accountNumber,
    })),
  ];

  const listOfSecurities = transactions?.map(({ externalSecurity }) => externalSecurity);

  const listOfUniqueSecurities = [
    ...new Map(listOfSecurities.map((item) => [item.id, item])).values(),
  ];

  const securityOptionsList = listOfUniqueSecurities?.map((security) => ({
    label: security.shortName, // table is rendering shortName instead of security.name
    value: security.id,
  }));

  let currencyOptionsList = listOfUniqueSecurities.map((security) => ({
    label: security.currencyName.name,
    value: security.currencyName.id,
  }));

  currencyOptionsList = [
    ...new Map(currencyOptionsList.map((item) => [item.value, item])).values(),
  ];

  useEffect(() => {
    const fetchAccounts = (payload) =>
      dispatch(reportsActionCreators.doFetchSecuritiesAccounts(payload));
    const fetchSafekeepingAccounts = (payload) =>
      dispatch(safekeepingActionCreators.doReadAccounts(payload));

    fetchAccounts();

    fetchSafekeepingAccounts();

    return () => {
      dispatch(reportsActionCreators.doResetSecuritiesTransactions());
    };
  }, [dispatch]);

  // const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];

  const generateSecuritiesTransactionsTableRowData = (i) => {
    // const issueDate = i.sukuk?.issueDate || i.externalSecurity?.issueDate;
    return {
      tradeDate: i?.settlementInsTradeDate,
      currency: i.externalSecurity?.currencyName?.name,
      // entity: i.externalSecurity.name ?? FALLBACK_VALUE,
      wsn: i.wsn ?? FALLBACK_VALUE,
      isin: i?.externalSecurity?.isin ?? FALLBACK_VALUE,
      securityShortName: i.sukuk?.securityShortName || i.externalSecurity?.shortName,
      issuerName: i.issuerName ?? FALLBACK_VALUE,
      settlementType: i?.settlementType?.name ?? FALLBACK_VALUE,
      fromSecurityAccount: i.fromSecurityAccount,
      investorName: i.investorName,
      toSecurityAccount: i.toSecurityAccount,
      netSettleAmount: convertNumberToIntlFormat(i.netSettleAmount, intlFormatOpts),
      price: i.price ? convertNumberToIntlFormat(i.price, intlFormatOpts) : FALLBACK_VALUE, // !Dev notes: externalSecurity object doesn't have this field
      settleDate: i?.settlementInsSettlementDate, // !Dev notes: By design?,
    };
  };

  const getSecurityFieldObject = (securitiesTransactionObject) => {
    if (securitiesTransactionObject?.sukuk) {
      return securitiesTransactionObject.sukuk;
    }

    if (securitiesTransactionObject?.externalSecurity) {
      return securitiesTransactionObject.externalSecurity;
    }

    return null;
  };

  const handleFetch = (filters) => {
    const { entity, safekeepingAccount, settlementDateRange } = filters;
    const startDate = settlementDateRange ? settlementDateRange?.value?.startDate : null;
    const endDate = settlementDateRange ? settlementDateRange?.value?.endDate : null;

    const params = {
      fromDate: startDate ? startDate.toISOString() : moment([1970, 1, 1]).toISOString(),
      toDate: endDate ? endDate.toISOString() : moment().endOf("day").toISOString(),
      portfolio_id: entity?.value?.value === "all" ? undefined : safekeepingAccount?.value?.value,
      entityId: entity?.value?.value,
    };

    const fetchSecuritiesTransactions = (payload) =>
      dispatch(reportsActionCreators.doFetchSecuritiesTransactions(payload));

    fetchSecuritiesTransactions({ params });
  };

  const handleEntityChange = (selectedEntity) => {
    if (!selectedEntity) return;
    console.log(selectedEntity);
    if (selectedEntity.label === "Emrgo") {
      setEmrgoSelected(true);
      setSafeAccountOptions([]);
    } else if (selectedEntity.value !== "all") {
      const filteredSafekeepingAccounts = safeekingAccountList.filter((account) =>
        selectedEntity ? account?.entityId === selectedEntity.value : false
      );
      setSafeAccountOptions(filteredSafekeepingAccounts);
      setEmrgoSelected(false);
    } else {
      setSafeAccountOptions(safeekingAccountList);
      setEmrgoSelected(false);
    }
    dispatch(reportsActionCreators.doResetSecuritiesTransactions());
  };

  const columns = [
    {
      id: "tradeDate",
      title: t("Security Transactions.Headers.Trade Date"),
      field: "tradeDate",
      // render: (rowData) => (rowData?.tradeDate ? reportDateRenderer(rowData?.tradeDate) : null),
      render: (rowData) =>
        rowData?.tradeDate ? dateFormatter(rowData.tradeDate, DEFAULT_DATE_FORMAT) : "--",
      exportConfig: { render: (rowData) => reportDateRenderer(rowData.tradeDate) },
    },
    // { id: 'entity', title: t('Security Transactions.Headers.Entity'), field: 'entity' },
    { id: "wsn", title: t("Security Transactions.Headers.WSN"), field: "wsn" },
    { id: "wsn", title: t("Security Transactions.Headers.ISIN"), field: "isin" },
    {
      id: "securityShortName",
      title: t("Securities Holdings.Headers.Security"),
      field: "securityShortName",
    },
    {
      id: "fromSecurityAccount",
      title: t("Security Transactions.Headers.To Safe Acct"),
      field: "fromSecurityAccount",
      exportConfig: { width: 8 },
    },
    {
      id: "investorName",
      title: t("Security Transactions.Headers.Investor Name"),
      field: "investorName",
    },
    {
      id: "settlementType",
      title: t("Security Transactions.Headers.Settlement Type"),
      field: "settlementType",
      exportConfig: { width: 8 },
    },
    {
      id: "currency",
      title: t("Security Transactions.Headers.Currency"),
      field: "currency",
      exportConfig: { width: 8 },
    },
    {
      id: "netSettleAmount",
      title: t("Security Transactions.Headers.Net Settle Amt"),
      field: "netSettleAmount",
      type: "numeric",
      exportConfig: {
        align: "right",
      },
    },
    // { id: 'instDescription', title: t('Security Transactions.Headers.Inst Description'), field: 'instDescription' },
    {
      id: "price",
      title: t("Security Transactions.Headers.Price"),
      field: "price",
      type: "numeric",
      exportConfig: {
        align: "right",
        width: 5,
      },
    },
    {
      id: "settleDate",
      title: t("Security Transactions.Headers.Settle Date"),
      field: "settleDate",
      // render: (rowData) => (rowData?.settleDate ? dateRenderer(rowData?.settleDate) : null),
      render: (rowData) =>
        rowData?.settleDate ? dateFormatter(rowData.settleDate, DEFAULT_DATE_TIME_FORMAT) : "--",
      exportConfig: { render: (rowData) => reportDateRenderer(rowData.settleDate) },
    },
  ];
  const generatedTableData = transactions?.map((transaction) => {
    return generateSecuritiesTransactionsTableRowData(transaction);
  });

  return (
    <Fragment>
      <PageTitle title={t("Security Transactions.Security Transactions")} />
      {/* <RouteLeavingGuard
        when={transactions?.length > 0}
        title={t("Leave Guard.Title")}
        message={t("Leave Guard.Message")}
        navigate={(path) => navigate(path)}
        shouldBlockNavigation={() => true}
      /> */}
      <FilterProvider tableKey="security_transactions_report">
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
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter
                  name="entity"
                  label="Entity"
                  options={entityOptionsList}
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
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DateRangePicker
                  name="settlementDateRange"
                  label={"Settlement Date"}
                  defaultFilter="none"
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

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="security" label="Security" options={securityOptionsList} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DropdownFilter name="currency" label="Currency" options={currencyOptionsList} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}></Grid>

              <Grid item xs={12} md={6} lg={3}>
                <ExportButtons tableRef={tableRef} name="Security Transactions Report" />
              </Grid>
            </Grid>
          </TableFiltersWrapper>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FilterConsumer>
                {({ filterColumns, filters }) => {
                  const filteredData = generatedTableData
                    .filter((row, i) => {
                      // Settlement Date range Filter
                      if (
                        filters?.settlementDateRange?.value?.startDate &&
                        filters?.settlementDateRange?.value?.endDate
                      ) {
                        const { startDate, endDate } = filters?.settlementDateRange?.value;
                        const isInRange =
                          moment(row.settleDate).isSameOrAfter(startDate) &&
                          moment(row.settleDate).isSameOrBefore(endDate);
                        return row.settleDate ? isInRange : null;
                      }
                      return true;
                    })
                    .filter((row) => {
                      if (filters?.currency) {
                        return row.currency === filters?.currency?.value?.label;
                      }
                      return true;
                    })
                    .filter((row) => {
                      if (filters?.security) {
                        return row.securityShortName === filters?.security?.value?.label;
                      }
                      return true;
                    })
                    .filter((row) => {
                      // Position Type Filter
                      if (
                        filters?.entity?.value?.value === "all" &&
                        !!filters?.safekeepingAccount?.value?.entityId
                      ) {
                        return filters?.safekeepingAccount?.value?.name === row.fromSecurityAccount;
                      }
                      return true;
                    });

                  return (
                    <div>
                      <Grid item xs={12} container>
                        <Typography className={style.accountInfo__label}>
                          {t("Security Transactions.Account")} :{" "}
                        </Typography>
                        <Typography className={style.accountInfo__value}>{`${
                          filters.safekeepingAccount
                            ? v.capitalize(filters.safekeepingAccount.value.label || "N.A")
                            : t("Security Transactions.NA")
                        }`}</Typography>
                      </Grid>
                      <MaterialTable
                        size="small"
                        tableRef={tableRef}
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
                    </div>
                  );
                }}
              </FilterConsumer>
            </Grid>
          </Grid>
        </div>
      </FilterProvider>
      <ReportingDisclaimer />
    </Fragment>
  );
};

export default SecuritiesTransactionsReportPage;
