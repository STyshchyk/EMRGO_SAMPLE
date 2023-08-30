import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import MaterialTable from "@material-table/core";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import v from "voca";
import { CsvBuilder } from "filefy";
import { Formik } from "formik";
import moment from "moment";

import DateRangePicker from "../../../components/FilterComponents/DateRangePicker";
import DropdownFilter from "../../../components/FilterComponents/DropdownFilterUpdated";
import TableFiltersWrapper from "../../../components/FilterComponents/TableFiltersWrapper";
import PageTitle from "../../../components/PageTitle";
import ExportTableContent from "../../../components/PDFExporter/ExportTableContent";
import ReportingTablePDFExporter from "../../../components/ReportingTablePDFExporter";
// import RouteLeavingGuard from "../../../components/RouteLeavingGuard";
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../../constants/datetime";
import { currencyRenderer, dateRenderer, reportDateRenderer } from "../../../constants/renderers";
import { FilterConsumer, FilterProvider } from "../../../context/filter-context";
import useMaterialTableLocalization from "../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as reportsActionCreators from "../../../redux/actionCreators/reports";
import * as authSelectors from "../../../redux/selectors/auth";
import * as reportsSelectors from "../../../redux/selectors/reports";
import tableStyles from "../../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../../utils/formatter";
import formatAddress from "../../../utils/reports";
import ReportingDisclaimer from "../ReportingDisclaimer";
import style from "./style.module.scss";

const ALL_ENTITIES_OPTION = {
  label: "All",
  value: "all",
};
const FALLBACK_VALUE = "--";

const animatedComponents = makeAnimated();

const SecuritiesTransactionsReportPage = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const tableRef = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["reports"]);
  const childRef = useRef();

  const [isAllEntitiesOptionSelected, setIsAllEntitiesOptionSelected] = useState(false);

  // selectors
  const userFullName = useSelector(authSelectors.selectUserFullName);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);
  const currentCorporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const transactions = useSelector(reportsSelectors.selectSecuritiesTransactions);
  const accounts = useSelector(reportsSelectors.selectSecuritiesAccounts);

  const currentEntityGroupID = currentEntityGroup?.id;

  // const entities = useSelector(authSelectors.selectOwnEntityNames);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const rows = transactions || [];
  let filteredRows = [];
  let exportFilters = [];

  const getRowsForCSV = () => {
    const boxes = [];
    filteredRows.forEach((row) => {
      boxes.push([
        row.tradeDate ? reportDateRenderer(row.tradeDate) : "",
        row.wsn || "",
        row.issuerName || "",
        row.fromSecurityAccount || "",
        row?.settlementType?.name || "",
        row.investorName || "",
        row.toSecurityAccount || "",
        currencyRenderer(row.netSettleAmount) || "",
        row.instDescription || "",
        currencyRenderer(row.price) || "",
        row?.sukuk?.issueDate
          ? dateRenderer(row.sukuk?.issueDate)
          : dateRenderer(row?.externalSecurity?.issueDate),
      ]);
    });
    return boxes;
  };

  const getEntityAndAccounts = (accs) => {
    const entityOpts = [];
    const cashAccountOpts = [];
    const securityAccountOpts = [];
    const pushedEntity = [];
    const pushedCashAccount = [];
    accs?.forEach((acc) => {
      if (pushedEntity.indexOf(acc.group.id) === -1) {
        entityOpts.push({
          id: acc.group.id,
          label: acc.group.entity.corporateEntityName,
          value: acc.group.id,
        });

        securityAccountOpts.push({
          id: acc.group.entity.securityAccount.id,
          label: acc.group.entity.securityAccount.accountNumber,
          value: acc.group.entity.securityAccount.id,
          original: acc,
        });

        pushedEntity.push(acc.group.id);
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
    fetchAccounts();

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

  const filteredSecurityAccounts = securityAccountOpts.map((account) => ({
    data: account,
    value: account.id,
    label: account.label,
    original: account.original,
  }));

  // const bankAccountTypes = dropdownValues ? dropdownValues.bankAccountTypes : [];

  const generateSecuritiesTransactionsTableRowData = (i) => {
    const intlFormatOpts = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

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

  const headCells = [
    {
      id: "tradeDate",
      title: t("Security Transactions.Headers.Trade Date"),
      field: "tradeDate",
      // render: (rowData) => reportDateRenderer(rowData?.tradeDate),
      render: (rowData) =>
        rowData?.tradeDate ? dateFormatter(rowData.tradeDate, DEFAULT_DATE_FORMAT) : "--",
      exportConfig: { render: (rowData) => reportDateRenderer(rowData.tradeDate) },
    },
    { id: "wsn", title: t("Security Transactions.Headers.WSN"), field: "wsn" },
    {
      id: "security",
      title: t("Securities Holdings.Headers.Security"),
      field: "sukuk.securityShortName",
    },
    {
      id: "settlementType",
      title: t("Security Transactions.Headers.Settlement Type"),
      field: "settlementType",
      exportConfig: { render: (rowData) => rowData?.settlementType?.name },
    },
    {
      id: "issuerName",
      title: t("Security Transactions.Headers.Issuer Name"),
      field: "issuerName",
    },
    {
      id: "fromSecurityAccount",
      title: t("Security Transactions.Headers.From Sec Acct"),
      field: "fromSecurityAccount",
      exportConfig: { width: 8 },
    },
    {
      id: "investorName",
      title: t("Security Transactions.Headers.Investor Name"),
      field: "investorName",
    },
    {
      id: "toSecurityAccount",
      title: t("Security Transactions.Headers.To Sec Acct"),
      field: "toSecurityAccount",
      exportConfig: { width: 8 },
    },
    {
      id: "netSettleAmount",
      title: t("Security Transactions.Headers.Net Settle Amt"),
      field: "netSettleAmount",
      type: "numeric",
      exportConfig: { align: "right" },
    },
    // { id: 'instDescription', title: t('Security Transactions.Headers.Inst Description'), field: 'instDescription' },
    {
      id: "price",
      title: t("Security Transactions.Headers.Price"),
      field: "price",
      type: "numeric",
      render: (rowData) => currencyRenderer(rowData.price),
      exportConfig: {
        render: (rowData) => currencyRenderer(rowData.price),
        align: "right",
        width: 5,
      },
    },
    {
      id: "settleDate",
      title: t("Security Transactions.Headers.Settle Date"),
      field: "settleDate",
      // render: (rowData) => console.log(rowData, 'ROW'),
      // render: (rowData) => dateFormatter(rowData.settleDate, DEFAULT_DATE_TIME_FORMAT),
      render: (rowData) =>
        rowData?.settlementInsSettlementDate ? dateFormatter(rowData.settlementInsSettlementDate, DEFAULT_DATE_TIME_FORMAT) : "--",
      exportConfig: { render: (rowData) => dateRenderer(rowData?.settlementInsSettlementDate) },
    },
  ];

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
      id: "security",
      title: t("Securities Holdings.Headers.Security"),
      field: "securityShortName",
    },
    {
      id: "issuerName",
      title: t("Security Transactions.Headers.Issuer Name"),
      field: "issuerName",
    },
    {
      id: "fromSecurityAccount",
      title: t("Security Transactions.Headers.From Sec Acct"),
      field: "fromSecurityAccount",
      exportConfig: { width: 8 },
    },
    {
      id: "investorName",
      title: t("Security Transactions.Headers.Investor Name"),
      field: "investorName",
    },
    {
      id: "toSecurityAccount",
      title: t("Security Transactions.Headers.To Sec Acct"),
      field: "toSecurityAccount",
      exportConfig: { width: 8 },
    },
    {
      id: "settlementType",
      title: t("Security Transactions.Headers.Settlement Type"),
      field: "settlementType",
      exportConfig: { width: 8 },
    },
    {
      id: "netSettleAmount",
      title: t("Security Transactions.Headers.Net Settle Amt"),
      field: "netSettleAmount",
      type: "numeric",
    },
    // { id: 'instDescription', title: t('Security Transactions.Headers.Inst Description'), field: 'instDescription' },
    {
      id: "price",
      title: t("Security Transactions.Headers.Price"),
      field: "price",
      type: "numeric",
    },
    {
      id: "settleDate",
      title: t("Security Transactions.Headers.Settle Date"),
      field: "settleDate",
      // render: (rowData) => (rowData?.settleDate ? dateRenderer(rowData?.settleDate) : null),
      render: (rowData) =>
        rowData?.settleDate ? dateFormatter(rowData.settleDate, DEFAULT_DATE_TIME_FORMAT) : "--",
      exportConfig: { render: (rowData) => reportDateRenderer(rowData.tradeDate) },
    },
  ];

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
                  label: securityObject.securityShortName || securityObject.name,
                };
              });

              const uniqueSecurities = [
                ...new Map(filteredSecurities.map((item) => [item.label, item])).values(),
              ];

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

              exportFilters = [
                {
                  label: "Export Date",
                  value: reportDateRenderer(),
                },
                {
                  label: "Generated By",
                  value: `${userFullName} - ${v.capitalize(
                    currentEntityType || "N.A"
                  )}, ${currentCorporateEntityName}`,
                },
                {
                  label: "Entity",
                  value: values?.entity?.label,
                },
                {
                  label: "Security Account",
                  value: values?.securityAccount?.label,
                },
                {
                  label: "Security",
                  value: values?.security?.label ?? null,
                },
                {
                  label: "Account Name",
                  value: ` ${
                    values?.securityAccount?.label ? `${values?.securityAccount?.label} |` : "N.A"
                  }  ${v.capitalize(values?.securityAccount?.data.original.type || "N.A") ?? null}`,
                },
                {
                  label: "Currency",
                  value: values?.currency?.label ?? null,
                },
                {
                  label: "Start Date",
                  value: values?.startDate?.format("DD/MM/YYYY") ?? null,
                },
                {
                  label: "End Date",
                  value: values?.endDate?.format("DD/MM/YYYY") ?? null,
                },
                {
                  label: "Address",
                  value: values?.securityAccount?.data?.original
                    ? null
                    : null,
                },
              ];

              const filteredExportFilters = (fields) => fields.filter((v) => !!v.value);

              const clearFilter = (key) => {
                switch (key) {
                  case "range":
                    setFieldValue("startDate", null, false);
                    setFieldValue("endDate", null, false);
                    dispatch(reportsActionCreators.doResetCashTransactions());
                    break;
                  case "entity":
                  case "securityAccount":
                    setIsAllEntitiesOptionSelected(false);
                    setFieldValue("entity", null, false);
                    setFieldValue("securityAccount", null, false);
                    setFieldValue("security", null, false);
                    setFieldValue("currency", null, false);
                    dispatch(reportsActionCreators.doResetCashTransactions());

                    break;
                  case "security":
                    setFieldValue("security", null, false);
                    break;
                  case "currency":
                    setFieldValue("currency", null, false);
                    break;
                  default:
                  // code block
                }
              };

              const exportCSV = () => {
                const tradeColumnName = t("Security Transactions.Headers.Trade Date");
                const wsnColumnName = t("Security Transactions.Headers.WSN");
                const issuerNameColumnName = t("Security Transactions.Headers.Issuer Name");
                const settlementTypeColumnName = t("Security Transactions.Headers.Settlement Type");
                const fromSecAcctColumnName = t("Security Transactions.Headers.From Sec Acct");
                const investorNameColumnName = t("Security Transactions.Headers.Investor Name");
                const toSecAccountColumnName = t("Security Transactions.Headers.To Sec Acct");
                const netSettleAmtColumnName = t("Security Transactions.Headers.Net Settle Amt");
                const InstDescriptionColumnName = t(
                  "Security Transactions.Headers.Inst Description"
                );
                const priceDateColumnName = t("Security Transactions.Headers.Price");
                const settleDateColumnName = t("Security Transactions.Headers.Settle Date");

                const csv = new CsvBuilder("security_transactions.csv");

                csv.addRow(["Filters"]);

                exportFilters.map((filter) => {
                  csv.addRow([filter.label, filter.value]);
                  return false;
                });

                csv.addRow([""]).addRow([""]);

                csv
                  .addRow([
                    tradeColumnName,
                    wsnColumnName,
                    issuerNameColumnName,
                    settlementTypeColumnName,
                    fromSecAcctColumnName,
                    investorNameColumnName,
                    toSecAccountColumnName,
                    netSettleAmtColumnName,
                    InstDescriptionColumnName,
                    priceDateColumnName,
                    settleDateColumnName,
                  ])
                  .addRows(getRowsForCSV());

                csv.exportFile();
              };

              const exportPDF = () => {
                childRef.current.exportFile();
              };

              const handleFilter = () => {
                let qs = "";
                if (values.startDate) {
                  qs += `fromDate=${values.startDate.toISOString()}&`;
                } else {
                  qs += `fromDate=${moment([1970, 1, 1]).toISOString()}&`;
                }
                if (values.endDate) {
                  qs += `toDate=${values.endDate.toISOString()}&`;
                } else {
                  qs += `toDate=${moment().toISOString()}&`;
                }
                if (values.entity) {
                  // qs += `entityId=${values.entity.data.id}&`;
                }
                if (values.securityAccount) {
                  qs += `accountId=${values.securityAccount.data.id}`;
                }
                dispatch(reportsActionCreators.doFetchSecuritiesTransactions({ qs }));
              };

              const handleClear = () => {
                clearFilter("range");
                clearFilter("entity");
                clearFilter("currency");
                dispatch(reportsActionCreators.doResetSecuritiesTransactions());
              };

              const entityChange = (selectedEntity) => {
                setFieldValue("entity", selectedEntity);
                setFieldValue("security", null);

                const tempSecurityAccountList = securityAccountOpts
                  .filter((securityAccount) =>
                    selectedEntity
                      ? securityAccount.original.group.id === selectedEntity.data.id
                      : true
                  )
                  .map((entity) => ({ data: entity, value: entity.id, label: entity.label }));

                if (selectedEntity) {
                  setFieldValue("securityAccount", tempSecurityAccountList[0]);
                }
                dispatch(reportsActionCreators.doResetCashTransactions());
                submitForm();
              };

              const securityAccountChange = (selectedAccount) => {
                setFieldValue("securityAccount", selectedAccount);
                const tempEntitiesList = entityOpts
                  .filter((entity) =>
                    selectedAccount ? entity.id === selectedAccount.data.original.group.id : true
                  )
                  .map((entity) => ({ data: entity, value: entity.id, label: entity.label }));

                if (selectedAccount) {
                  setFieldValue("entity", tempEntitiesList[0]);
                }
                dispatch(reportsActionCreators.doResetCashTransactions());
                submitForm();
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
                        <Grid container justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="body1" className="bold">
                            {t("Security Transactions.Filters.Entity")}
                          </Typography>
                          <ButtonBase onClick={() => clearFilter("entity")}>
                            <Typography variant="caption">{t("Security Transactions.Filters.Clear")}</Typography>
                          </ButtonBase>
                        </Grid>
                        <Box my={1} className="w-full" sx={{width: "100%"}}>
                          <FormControl className={style.input__form_control}>
                            <Select
                              closeMenuOnSelect
                              isSearchable
                              placeholder={`${t("Security Transactions.Filters.Entity")}...`}
                              components={{
                                ...animatedComponents,
                              }}
                              styles={{
                                menu: (styles) => ({
                                  ...styles,
                                  zIndex: 100,
                                }),
                                control: (styles) => ({
                                  ...styles,
                                  border: "none",
                                  borderRadius: "6px",
                                  backgroundColor: "rgba(0, 0, 0, 0.09)",
                                  height: "3rem",
                                }),
                              }}
                              value={values.entity}
                              options={filteredEntity}
                              onChange={(selectedEntity) => {
                                if (selectedEntity.value !== ALL_ENTITIES_OPTION.value) {
                                  setIsAllEntitiesOptionSelected(false);
                                  entityChange(selectedEntity);
                                  return;
                                }

                                setIsAllEntitiesOptionSelected(true);
                                setFieldValue("entity", ALL_ENTITIES_OPTION);
                                setFieldValue("securityAccount", null, false);
                              }}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6} lg={3} container>
                        <Grid container justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="body1" className="bold">
                            {t("Security Transactions.Filters.Securities Account")}
                          </Typography>
                          <ButtonBase onClick={() => clearFilter("securityAccount")}>
                            <Typography variant="caption">{t("Security Transactions.Filters.Clear")}</Typography>
                          </ButtonBase>
                        </Grid>
                        <Box my={1} className="w-full" sx={{width: "100%"}}>
                          <FormControl className={style.input__form_control}>
                            <Select
                              closeMenuOnSelect
                              isSearchable
                              placeholder={`${t(
                                "Security Transactions.Filters.Securities Account"
                              )}...`}
                              components={{
                                ...animatedComponents,
                              }}
                              styles={{
                                menu: (styles) => ({
                                  ...styles,
                                  zIndex: 100,
                                }),
                                control: (styles) => ({
                                  ...styles,
                                  border: "none",
                                  borderRadius: "6px",
                                  backgroundColor: "rgba(0, 0, 0, 0.09)",
                                  height: "3rem",
                                }),
                              }}
                              value={values.securityAccount}
                              options={filteredSecurityAccounts}
                              onChange={(selectedAccount, triggeredAction) => {
                                securityAccountChange(selectedAccount);
                              }}
                              isDisabled={isAllEntitiesOptionSelected}
                            />
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6} lg={3} container >
                        <DropdownFilter name="security" label="Security" options={uniqueSecurities} customOnChange={(newValue, { action })=>{
                          setFieldValue("security", newValue)
                        }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={3} container justifyContent="flex-end">
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={12}
                          container
                          alignContent="center"
                          justifyContent="flex-end"
                        >
                          <Grid container justifyContent="space-between" alignItems="flex-start">
                            <Typography variant="body1" className="white-text">
                              .
                            </Typography>
                          </Grid>
                          <Box my={1} className="w-full" sx={{width: "100%"}}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6} lg={6}>
                                <Button
                                  fullWidth
                                  disabled={
                                    values.securityAccount === null && !isAllEntitiesOptionSelected
                                  }
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleFilter()}
                                  size="large"
                                >
                                  {t("Security Transactions.Filters.Apply")}
                                </Button>
                              </Grid>
                              <Grid item xs={12} md={6} lg={6}>
                                <Button
                                  fullWidth
                                  disabled={filteredRows.length === 0}
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleClear()}
                                  size="large"
                                >
                                  {t("Security Transactions.Filters.Clear")}
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12} md={6} lg={3} container>
                        <DropdownFilter
                          name="currency"
                          label="Currency"
                          options={uniqueCurrencies}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6} container>
                        <DateRangePicker
                          name="settlementDateRange"
                          label={"Settlement Date"}
                          defaultFilter="none"
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={3} container justifyContent="flex-end">
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={12}
                          container
                          alignContent="center"
                          justifyContent="flex-end"
                        >
                          <Grid container justifyContent="space-between" alignItems="flex-start">
                            <Typography variant="body1" className="white-text">
                              .
                            </Typography>
                          </Grid>

                          <Box my={1} className="w-full" sx={{width: "100%"}}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6} lg={6}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  color="primary"
                                  startIcon={<CloudDownloadIcon />}
                                  onClick={exportCSV}
                                  size="large"
                                >
                                  {t("Security Transactions.Filters.CSV")}
                                </Button>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  color="primary"
                                  startIcon={<CloudDownloadIcon />}
                                  onClick={exportPDF}
                                  size="large"
                                >
                                  {t("Security Transactions.Filters.PDF")}
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableFiltersWrapper>
                  <Grid container spacing={2}>
                    <Grid item xs={12} container>
                      <Typography className={style.accountInfo__label}>
                        {t("Security Transactions.Account")} :{" "}
                      </Typography>
                      <Typography className={style.accountInfo__value}>{`${
                        values.securityAccount
                          ? values.securityAccount.data.original.accountNumber
                          : t("Security Transactions.NA")
                      } | ${
                        values.securityAccount
                          ? v.capitalize(values.securityAccount.data.original.type || "N.A")
                          : t("Security Transactions.NA")
                      }`}</Typography>
                    </Grid>

                    <Grid item xs={12} container>
                      <Typography className={style.accountInfo__label}>
                        {t("Security Transactions.Address")} :{" "}
                      </Typography>
                      <Typography className={style.accountInfo__value}>{`${
                        values.securityAccount?.data?.original?.group?.addresses
                          ? null
                          : t("Cash Statement.NA")
                      }`}</Typography>
                    </Grid>

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
                                return row.settleDate
                                  ? moment(row.settleDate).isBetween(startDate, endDate)
                                  : null;
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

                    <ReportingTablePDFExporter
                      ref={childRef}
                      title={t("Security Transactions.Security Transactions")}
                    >
                      <ExportTableContent
                        columns={headCells}
                        tableOptions={{
                          sliceRowCount: 5,
                          tableOffset: 2,
                        }}
                        data={filteredRows}
                        filters={filteredExportFilters(exportFilters)}
                        title={`${t("Security Transactions.Security Transactions")} Report`}
                      />
                    </ReportingTablePDFExporter>
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
