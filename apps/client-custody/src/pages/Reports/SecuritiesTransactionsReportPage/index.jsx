import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import MaterialTable from "@material-table/core";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Formik } from "formik";
import moment from "moment";
import v from "voca";

import DateRangePicker from "../../../components/FilterComponents/DateRangePicker";
import DropdownFilterSelection from "../../../components/FilterComponents/DropdownFilter";
import DropdownFilter from "../../../components/FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../../../components/FilterComponents/ExportButtons";
import FilterButton from "../../../components/FilterComponents/FilterButton";
import TableFiltersWrapper from "../../../components/FilterComponents/TableFiltersWrapper";
import PageTitle from "../../../components/PageTitle";
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../../constants/datetime";
import { FilterConsumer, FilterProvider } from "../../../context/filter-context";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
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

const SecuritiesTransactionsReportPage = () => {
  const dispatch = useDispatch();
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports", "blotter"]);

  const [currentlySelectedSecurityAccount, setCurrentlySelectedSecurityAccount] = useState(null);

  const currentSafeAccounts = useSelector(reportsSelectors.selectSafeAccountsData);
  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupId = useSelector(authSelectors.selectCurrentEntityGroupId);
  const transactions = useSelector(reportsSelectors.selectSecuritiesTransactions);
  const accounts = useSelector(reportsSelectors.selectSecuritiesAccounts);

  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const rows = transactions || [];
  let filteredRows = [];

  const getEntityAndAccounts = (accs) => {
    const entityOpts = [];
    const cashAccountOpts = [];
    const securityAccountOpts = [];
    const pushedEntity = [];
    const pushedCashAccount = [];
    accs?.forEach((acc) => {
      if (pushedEntity.indexOf(acc.group.entity.id) === -1) {
        entityOpts.push({
          id: acc.group.entity.id,
          label: acc.group.entity.corporateEntityName,
          value: acc.group.entity.id,
        });

        securityAccountOpts.push({
          id: acc.group.entity.securityAccount.id,
          label: acc.group.entity.securityAccount.accountNumber,
          value: acc.group.entity.securityAccount.id,
          original: acc,
        });

        pushedEntity.push(acc.group.entity.id);
      }
      if (pushedCashAccount.indexOf(acc.accountNo) === -1) {
        cashAccountOpts.push({
          id: acc.accountNo,
          label: acc.accountNo,
          value: acc.accountNo,
          original: acc,
        });
        pushedCashAccount.push(acc.accountNo);
      }
    });
    return { entityOpts, cashAccountOpts, securityAccountOpts };
  };
  const { entityOpts, securityAccountOpts } = getEntityAndAccounts(accounts);

  useEffect(() => {
    const fetchAccounts = (payload) =>
      dispatch(reportsActionCreators.doFetchSecuritiesAccounts(payload));
    const fetchSafeAcounts = (payload) =>
      dispatch(reportsActionCreators.doFetchSafeAccounts(payload));

    fetchAccounts();
    fetchSafeAcounts({ entityId: currentEntityGroupId });
    return () => {
      dispatch(reportsActionCreators.doResetSecuritiesTransactions());
    };
  }, [dispatch]);

  const filteredEntity = entityOpts.map((entity) => ({
    data: entity,
    value: entity.id,
    label: entity.label,
  }));

  if (Array.isArray(filteredEntity) && filteredEntity.length > 1) {
    filteredEntity.unshift(ALL_ENTITIES_OPTION);
  }
  const filteredSecurityAccounts = currentSafeAccounts.map((account) => ({
    data: account,
    value: account.id,
    label: `${account.securitiesAccount.accountNumber} | ${account.name}`,
    original: account,
  }));

  const generateSecuritiesTransactionsTableRowData = (i) => {
    return {
      tradeDate: i?.settlementInsTradeDate,
      currency: i.externalSecurity?.currencyName?.name,
      // entity: i.externalSecurity.name ?? FALLBACK_VALUE,
      wsn: i.wsn ?? FALLBACK_VALUE,
      // isin: getAttribute(i?.externalSecurity?.attributes, "isin") ?? FALLBACK_VALUE, //* use this once ebme-1585 BE changes are done
      isin: i?.externalSecurity?.isin ?? FALLBACK_VALUE,
      securityShortName: i.sukuk?.securityShortName || i.externalSecurity?.shortName,
      issuerName: i.issuerName ?? FALLBACK_VALUE,
      settlementType: i?.settlementType?.name ?? FALLBACK_VALUE,
      settlementStatus: i?.settlementStatus ?? FALLBACK_VALUE,
      fromSecurityAccount: i.fromSecurityAccount,
      investorName: i.investorName,
      toSecurityAccount: i.toSecurityAccount,
      netSettleAmount: convertNumberToIntlFormat(i.netSettleAmount, intlFormatOpts),
      price: i.price ? convertNumberToIntlFormat(i.price, intlFormatOpts) : FALLBACK_VALUE, // !Dev notes: externalSecurity object doesn't have this field
      settleDate: i?.settlementInsSettlementDate, // !Dev notes: By design?,
      actualSettleDate: i?.settlementInsActualSettlementDate,
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

  const columns = [
    {
      id: "tradeDate",
      title: t("Security Transactions.Headers.Trade Date"),
      field: "tradeDate",
      render: (rowData) =>
        rowData?.tradeDate ? dateFormatter(rowData.tradeDate, DEFAULT_DATE_FORMAT) : "--",
      exportConfig: {
        render: (rowData) => dateFormatter(rowData.tradeDate, DEFAULT_DATE_FORMAT),
      },
    },
    { id: "wsn", title: t("Security Transactions.Headers.WSN"), field: "wsn", defaultHidden: true },
    {
      id: "isin",
      title: t("Security Transactions.Headers.ISIN"),
      field: "isin",
    },
    {
      id: "security",
      title: t("Securities Holdings.Headers.Security"),
      field: "securityShortName",
    },
    {
      id: "settlementStatus",
      title: t("Security Transactions.Headers.Settlement Status"),
      field: "settlementStatus",
    },
    {
      id: "settlementType",
      title: t("Security Transactions.Headers.Settlement Type"),
      field: "settlementType",
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
    {
      id: "price",
      title: t("Security Transactions.Headers.Price"),
      field: "price",
      type: "numeric",
      exportConfig: {
        align: "right",
      },
    },
    {
      id: "actualSettleDate",
      title: t("Security Transactions.Headers.Actual Settle Date"),
      field: "actualSettleDate",
      render: (rowData) =>
        rowData?.actualSettleDate
          ? dateFormatter(rowData.actualSettleDate, DEFAULT_DATE_TIME_FORMAT)
          : "--",
      exportConfig: { render: (rowData) => reportDateRenderer(rowData.actualSettleDate) },
    },
    {
      id: "settleDate",
      title: t("Security Transactions.Headers.Settle Date"),
      field: "settleDate",
      render: (rowData) =>
        rowData?.settleDate ? dateFormatter(rowData.settleDate, DEFAULT_DATE_TIME_FORMAT) : "--",
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.settleDate, DEFAULT_DATE_TIME_FORMAT),
      },
    },
  ];

  useEffect(() => {
    if (filteredSecurityAccounts.length === 1) {
      setCurrentlySelectedSecurityAccount(() => filteredSecurityAccounts[0]);
    }
  }, [accounts]);

  return (
    <Fragment>
      <PageTitle title={t("Security Transactions.Security Transactions")} />
      <FilterProvider tableKey="security_transactions_report">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <Formik
            initialValues={{
              startDate: null,
              endDate: null,
              entity: null,
              securityAccount: null,
              security: null,
              currency: null,
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                setSubmitting(false);
              }, 500);
              // updateSingleBlotter(blotterId, values);
            }}
          >
            {({ submitForm, values, setFieldValue }) => {
              const filteredCurrencies = rows.map((item) => {
                // const { sukuk } = item;
                const securityObject = getSecurityFieldObject(item);

                return {
                  value: securityObject.currencyName.name,
                  label: securityObject.currencyName.name,
                };
              });

              const uniqueCurrencies = [
                ...new Map(filteredCurrencies.map((item) => [item.label, item])).values(),
              ];

              const filteredSecurities = rows.map((item) => {
                // const { sukuk } = security;
                const securityObject = getSecurityFieldObject(item);

                return {
                  value: securityObject,
                  label: securityObject.shortName || securityObject.name,
                };
              });

              const uniqueSecurities = [
                ...new Map(filteredSecurities.map((item) => [item.label, item])).values(),
              ];

              const uniqueISINs = uniqueSecurities
                ?.map((obj) => ({
                  label: obj.value.isin,
                  value: obj.value.isin,
                }))
                .filter((v) => !!v.label);
              console.log(uniqueISINs);

              filteredRows = rows
                .filter((item) => {
                  const securityObject = getSecurityFieldObject(item);

                  return values?.currency
                    ? securityObject.currencyName.name === values?.currency?.value
                    : true;
                })
                .filter((item) => {
                  const securityObject = getSecurityFieldObject(item);

                  return values.security ? securityObject.id === values?.security?.value.id : true;
                });

              // filteredRows = rows.filter(() => {
              //   // const returnValue = row.date;
              //   const returnValue = true;

              //   // if (row.transactionType === 'Closing Balance' || row.transactionType === 'Opening Balance') {
              //   //   returnValue = true;
              //   // }
              //   return returnValue;
              // });

              const handleFilter = (filters) => {
                const { securityAccount: selectedSecurityAccount } = filters;

                let qs = "";
                if (values.startDate) {
                  qs += `fromDate=${values.startDate.toISOString()}&`;
                } else {
                  qs += `fromDate=${moment([1970, 1, 1]).toISOString()}&`;
                }
                if (values.endDate) {
                  qs += `toDate=${values.endDate.toISOString()}&`;
                } else {
                  qs += `toDate=${moment().endOf("day").toISOString()}&`;
                }
                if (values.securityAccount) {
                  qs += `portfolio_id=${selectedSecurityAccount?.value?.original.securitiesAccount.portfolioId}&`;
                }

                dispatch(reportsActionCreators.doFetchSecuritiesTransactions({ qs }));
              };

              const generatedTableData = rows.map((i) =>
                generateSecuritiesTransactionsTableRowData(i)
              );
              return (
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
                          options={filteredEntity}
                          defaultValue={
                            filteredEntity.length === 1 ? filteredEntity[0] : values.entity
                          }
                          customOnChange={(selectedEntity, { action }) => {
                            setFieldValue("entity", selectedEntity);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={3} container>
                        <DropdownFilterSelection
                          name="securityAccount"
                          label="Safekeeping Account"
                          options={filteredSecurityAccounts}
                          currentlySelectedOption={currentlySelectedSecurityAccount}
                          setCurrentlySelectedOption={setCurrentlySelectedSecurityAccount}
                          customOnChange={(selectedAccount, { action }) => {
                            setFieldValue("securityAccount", selectedAccount);
                          }}
                          hasDefaultValue={filteredSecurityAccounts.length === 1}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={3} container></Grid>

                      <Grid item xs={12} md={6} lg={3}>
                        <FilterButton
                          label="Apply"
                          onClick={(filters) => {
                            handleFilter(filters);
                          }}
                          disabled={(filters) => !filters.entity || !filters.securityAccount}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12} md={6} lg={3} container>
                        <DropdownFilter
                          name="security"
                          label="Security"
                          options={uniqueSecurities}
                          customOnChange={(newValue, { action }) => {
                            setFieldValue("security", newValue);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={3} container>
                        <DropdownFilter
                          name="currency"
                          label="Currency"
                          options={uniqueCurrencies}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={3} container>
                        <DropdownFilter name="isin" label="ISIN" options={uniqueISINs} />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6} container>
                        <DateRangePicker
                          name="settlementDateRange"
                          label={"Settlement Date"}
                          defaultFilter="none"
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={4} container></Grid>

                      <Grid item xs={12} md={6} lg={2}>
                        <ExportButtons tableRef={tableRef} name="Security Transactions Report" />
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} container>
                        <Typography className={style.accountInfo__label}>
                          {`Safekeeping Account`} :{" "}
                        </Typography>
                        <Typography className={style.accountInfo__value}>{`${
                          currentlySelectedSecurityAccount
                            ? currentlySelectedSecurityAccount?.original?.securitiesAccount
                                .accountNumber
                            : t("Security Transactions.NA")
                        } | ${
                          currentlySelectedSecurityAccount
                            ? v.capitalize(currentlySelectedSecurityAccount.original?.name || "N.A")
                            : t("Security Transactions.NA")
                        }`}</Typography>
                      </Grid>
                    </Grid>
                  </TableFiltersWrapper>
                  <Grid container spacing={2}>
                    {/* <Grid item xs={12} container>
                      <Typography className={style.accountInfo__label}>
                        {t("Security Transactions.Address")} :{" "}
                      </Typography>
                      <Typography className={style.accountInfo__value}>{`${
                        values.securityAccount?.data?.original?.group?.addresses
                          ? formatAddress(values.securityAccount?.data?.original?.group?.addresses)
                          : t("Cash Statement.NA")
                      }`}</Typography>
                    </Grid> */}

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <FilterConsumer>
                        {({ filterColumns, filters }) => {
                          const filteredData = generatedTableData
                            ?.filter((row, i) => {
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
                            ?.filter((row) => {
                              if (filters?.currency) {
                                return row.currency === filters?.currency?.value?.label;
                              }
                              return true;
                            })
                            ?.filter((row) => {
                              if (filters?.security) {
                                return row.securityShortName === filters?.security?.value?.label;
                              }
                              return true;
                            })
                            ?.filter((row) => {
                              if (filters?.isin) {
                                return row.isin === filters?.isin?.value?.label;
                              }
                              return true;
                            });

                          return (
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
                          );
                        }}
                      </FilterConsumer>
                    </Grid>
                  </Grid>
                </div>
              );
            }}
          </Formik>
        </div>
      </FilterProvider>
      <ReportingDisclaimer />
    </Fragment>
  );
};

export default SecuritiesTransactionsReportPage;
