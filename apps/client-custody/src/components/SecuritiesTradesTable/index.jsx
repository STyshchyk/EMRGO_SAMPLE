import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

import { currencyRenderer } from "@emrgo-frontend/shared-ui";
import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../constants/datetime";
import featureFlags from "../../constants/featureFlags";
import { dateRenderer, reportDateRenderer } from "../../constants/renderers";
import {
  securityTradeSettlementStatusEnum,
  settlementInstructionStatusEnum,
} from "../../constants/wethaqAPI/securitiesServices";
import { useFeatureToggle } from "../../context/feature-toggle-context";
import { FilterConsumer, FilterProvider } from "../../context/filter-context";
import { floatRenderer } from "../../helpers/renderers";
import useMaterialTableLocalization from "../../hooks/useMTableLocalization";
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateWithinRange } from "../../utils/dates";
import { dateFormatter } from "../../utils/formatter";
import DateRangePicker from "../FilterComponents/DateRangePicker";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../FilterComponents/ExportButtons";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";

// TODO: REFACTOR THIS COMPONENT: ENCAPSULATE TABLE FILTERING LOGIC - SEE GLENN'S FX CODES FOR INSPIRATION
const FALLBACK_VALUE = "--";

const EMPTY_COLUMN = {
  id: "",
  title: "",
  field: "",
  width: 25,
};

const TableActionMenu = ({ handleCloseMenu, actions, anchorEl }) => (
  <Fragment>
    {Boolean(anchorEl) && (
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
        placement="right"
        sx={{ zIndex: 99 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <MenuList id="split-button-menu">
                  {actions
                    .filter((action) => !action.hidden)
                    .map((action) => (
                      <MenuItem
                        key={action.id}
                        disabled={action.disabled}
                        onClick={() => {
                          action.onClick();
                        }}
                      >
                        <Typography variant="inherit">{action.label}</Typography>
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    )}
  </Fragment>
);

TableActionMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      label: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

const generateSecurityTradesTableRowData = (i) => ({
  cashSSI: FALLBACK_VALUE,
  counterparty: i.counterParty?.longName ?? FALLBACK_VALUE,
  counterpartyId: i.counterParty?.id,
  counterpartyObject: i.counterParty,
  counterpartySSI: i.counterPartySSI?.ssiLabel ?? FALLBACK_VALUE,
  counterpartySSIObject: i.counterPartySSI,
  createdAt: i.createdAt,
  currency: i.externalSecurity?.currencyName?.name,
  entityGroupId: i.entityGroupId,
  entityId: i.entityGroup?.entityId,
  // changes for airtable id 588
  entryDate: i.createdAt,
  lastAmended: i.entryDate, // api doesn't return updatedAt
  // entryDate: i.entryDate, // !Dev notes: this field is mapped to updatedAt field from Payments API response object
  externalSecuritiesId: i.externalSecurity?.id,
  externalSecurity: i.externalSecurity,
  id: i.id,
  investor: i.entityGroup?.entity?.corporateEntityName,
  investorCashAccountBalance: convertNumberToIntlFormat(i.investorCashAccountBalance),
  investorCashAccountNo: i.investorCashAccount,
  investorSecuritiesAccountBalance: convertNumberToIntlFormat(i.investorSecuritiesAccountBalance),
  investorSecuritiesAccountNo: i.investorSecuritiesAccount,
  isin: i.externalSecurity?.isin,
  isPrimaryIssuance: i.externalSecurity?.isPrimaryIssuance,
  issueDate: i.externalSecurity?.issueDate,
  issuer: i.issuer?.entity?.corporateEntityName,
  issuerCashAccountBalance: i.issuerCashAccount
    ? convertNumberToIntlFormat(i.issuerCashAccountBalance)
    : FALLBACK_VALUE,
  issuerCashAccountNo: i.issuerCashAccount,
  issuerSecuritiesAccountBalance: parseFloat(i.issuerSecuritiesAccountBalance),
  issuerSecuritiesAccountNo: parseFloat(i.issuerSecuritiesAccount, 10),
  nextCouponDate: dateFormatter(i.nextCouponDate, DEFAULT_DATE_FORMAT),
  numCerts: convertNumberToIntlFormat(i.numOfCertificates),
  paymentConfirmationFileId: i.paymentConfirmationFileId,
  paymentEvidenceUploaded: i.paymentConfirmationFileId ? "Yes" : "No",
  price: i.price,
  quantity: i.quantity,
  readyToSettle: i.readyToSettle,
  referenceId: i.referenceId ?? FALLBACK_VALUE,
  security: i.externalSecurity?.name,
  securityTradeSettlementStatus: i.securityTradeSettlementStatus ?? FALLBACK_VALUE,
  securityTradeType: i.securityTradeType,
  settlementAmount: i.settlementAmount,
  settlementDate: i.settlementDate,
  settlementInstructionStatus: i.settlementInstructionStatus ?? FALLBACK_VALUE,
  settlementType: i.settlementType?.name ?? FALLBACK_VALUE,
  settlementTypeId: i.settlementTypeId,
  sukukId: i.sukukId,
  tradeDate: i.tradeDate,
  tradeId: i.tradeId,
  tradeSettlementOrSettlementInstructionStatus: i.tradeSettlementOrSettlementInstructionStatus,
  type: i.type,
  wsn: i.externalSecurity?.wsn ?? FALLBACK_VALUE,
  // new fields
  principalAmount: i.principalAmount,
  accruedInterest: i.accruedInterest,
  internalTradeRef: i?.internalTradeRef ? i?.internalTradeRef : FALLBACK_VALUE, // api returns ""
  entityGroup: i?.entityGroup,
  userId: i?.userId,
  portfolioAccountNumber: i.portfolio?.accountNumber ?? "3000008",
  portfolioName: i.portfolio?.name ?? FALLBACK_VALUE,
});

const SecurityTradesTable = ({
  anchorEl,
  handleCloseMenu,
  data,
  actions,
  setCurrentlySelectedRowData,
  showAllFilters,
  setAnchorEl,
  entityUserType,
  isLoading,
}) => {
  const { t } = useTranslation(["custody_and_settlement"]);
  const tableRef = useRef();
  const ref = useRef();
  const mtableLocalization = useMaterialTableLocalization();
  const { checkFeatureFlag } = useFeatureToggle();

  const isIntlSecTradeSettlementWorkflowEnabled = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );

  // !!!TODO FIND A PROPER WAY OF ENSURING USER-DEFINED TABLE UI PREFERENCE CHANGES GET PERSISTED ACROSS RENDERS OF SecurityTradesTable component

  const tableColumns = [
    {
      id: "",
      title: "",
      field: "",
      width: 25,
    },
    {
      id: "reference",
      title: t("Headers.Reference"),
      field: "referenceId",
      defaultSort: "asc",
      exportConfig: { width: 4 },
      width: 150,
    },
    {
      id: "wsn",
      title: "WSN",
      field: "wsn",
      width: 150,
    },
    {
      id: "isin",
      title: "ISIN",
      field: "isin",
      customFilterAndSearch: (term, rowData) => term === rowData?.isin,
      width: 150,
    },
    {
      id: "internalTradeRef",
      title: t("Headers.Internal Trade Ref"),
      field: "internalTradeRef",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "security",
      title: t("Headers.Security"),
      field: "security",
      exportConfig: { width: 5 },
      width: 150,
    },
    {
      id: "securityTradeType",
      title: t("Headers.Trade Type"),
      field: "securityTradeType",
      width: 150,
    },
    {
      id: "entryDate",
      title: t("Headers.Entry Date"),
      field: "entryDate",
      render: (rowData) => dateFormatter(rowData?.entryDate, DEFAULT_DATE_TIME_FORMAT),
      exportConfig: {
        render: (rowData) => dateFormatter(rowData?.entryDate, DEFAULT_DATE_TIME_FORMAT),
      },
      width: 150,
    },
    {
      id: "tradeDate",
      title: t("Headers.Trade Date"),
      field: "tradeDate",
      render: (rowData) => dateFormatter(rowData?.tradeDate, DEFAULT_DATE_FORMAT),
      exportConfig: { render: (rowData) => dateRenderer(rowData.tradeDate) },
      width: 150,
    },
    {
      id: "settlementDate",
      title: t("Headers.Settlement Date"),
      field: "settlementDate",
      render: (rowData) => dateFormatter(rowData?.settlementDate, DEFAULT_DATE_FORMAT),
      exportConfig: { render: (rowData) => dateRenderer(rowData.settlementDate) },
      width: 150,
    },
    {
      id: "valueDate",
      title: t("Headers.Value Date"),
      field: "issueDate",
      render: (rowData) => dateFormatter(rowData?.issueDate, DEFAULT_DATE_FORMAT),
      exportConfig: { render: (rowData) => dateRenderer(rowData.issueDate) },
      width: 150,
    },
    {
      id: "lastAmended",
      title: t("Headers.Last Amended"),
      field: "lastAmended",
      render: (rowData) => dateFormatter(rowData?.lastAmended, DEFAULT_DATE_TIME_FORMAT),
      exportConfig: { render: (rowData) => reportDateRenderer(rowData.lastAmended) },
      width: 150,
    },
    {
      id: "settlementStatus",
      title: t("Headers.Settlement Status"),
      field: "tradeSettlementOrSettlementInstructionStatus",
      width: 250,
    },
    {
      id: "currency",
      title: "CCY",
      field: "currency",
      width: 150,
    },
    {
      id: "investorCashAccountNo",
      title: t("Headers.Inv Cash Acc No"),
      field: "investorCashAccountNo",
      hidden: ["ISSUER"].includes(entityUserType),
      width: 150,
    },
    {
      id: "investorCashAccountBalance",
      title: t("Headers.Inv Cash Acc Bal"),
      field: "investorCashAccountBalance",
      type: "numeric",
      hidden: ["ISSUER"].includes(entityUserType),
      exportConfig: { width: 5 },
      width: 150,
    },
    {
      id: "investorSecuritiesAccountNo",
      title: t("Headers.Inv Sec Acc No"),
      field: "investorSecuritiesAccountNo",
      hidden: ["ISSUER"].includes(entityUserType),
      width: 150,
    },
    {
      id: "investorSecuritiesAccountBalance",
      title: t("Headers.Inv Sec Acc Bal"),
      field: "investorSecuritiesAccountBalance",
      type: "numeric",
      hidden: ["ISSUER"].includes(entityUserType),
      exportConfig: { width: 5 },
      width: 150,
    },
    {
      id: "issuerCashAccountNo",
      title: t("Headers.Iss Cash Acc No"),
      field: "issuerCashAccountNo",
      hidden: ["INVESTOR"].includes(entityUserType),
      render: (rowData) => rowData?.issuerCashAccountNo ?? FALLBACK_VALUE,
      width: 150,
    },
    {
      id: "issuerCashAccountBalance",
      title: t("Headers.Iss Cash Acc Bal"),
      field: "issuerCashAccountBalance",
      type: "numeric",
      hidden: ["INVESTOR"].includes(entityUserType),
      render: (rowData) => rowData?.issuerCashAccountBalance ?? FALLBACK_VALUE,
      exportConfig: { width: 5 },
      width: 150,
    },
    {
      id: "issuerSecuritiesAccountNo",
      title: t("Headers.Iss Sec Acc No"),
      field: "issuerSecuritiesAccountNo",
      hidden: ["INVESTOR"].includes(entityUserType),
      render: (rowData) =>
        (rowData?.issuerSecuritiesAccountNo &&
          convertNumberToIntlFormat(rowData?.issuerSecuritiesAccountNo)) ||
        FALLBACK_VALUE,
      // test.c && new Intl.NumberFormat('en').format(test.c) || '--'
      width: 150,
    },
    {
      id: "issuerSecuritiesAccountBalance",
      title: t("Headers.Iss Sec Acc Bal"),
      field: "issuerSecuritiesAccountBalance",
      type: "numeric",
      hidden: ["INVESTOR"].includes(entityUserType),
      render: (rowData) =>
        (rowData?.issuerSecuritiesAccountBalance &&
          convertNumberToIntlFormat(rowData?.issuerSecuritiesAccountBalance)) ||
        FALLBACK_VALUE,
      width: 150,
    },
    {
      id: "quantity",
      title: t("Headers.Qty"),
      render: (rowData) => convertNumberToIntlFormat(rowData.quantity),
      exportConfig: { render: (rowData) => currencyRenderer(rowData.quantity) },
      field: "quantity",
      type: "numeric",
      width: 150,
    },
    {
      id: "numCerts",
      title: t("Headers.Num Certs"),
      field: "numCerts",
      type: "numeric",
      width: 150,
    },
    {
      id: "issuer",
      title: t("Headers.Issuer"),
      field: "issuer",
      hidden: ["ISSUER"].includes(entityUserType),
      render: (rowData) => rowData?.issuer ?? FALLBACK_VALUE,
      width: 150,
    },
    {
      id: "investor",
      title: t("Headers.Investor"),
      field: "investor",
      hidden: ["INVESTOR"].includes(entityUserType),
      render: (rowData) => rowData?.investor ?? FALLBACK_VALUE,
      width: 150,
    },
    {
      id: "cashSSI",
      title: t("Headers.Cash SSI"),
      field: "cashSSI",
      width: 150,
    },
    {
      id: "paymentEvidenceUploaded",
      title: t("Headers.Evidence Uploaded"),
      field: "paymentEvidenceUploaded", // !Dev note: If paymentEvidenceUploaded value is not null then it's assumed that file has been uploaded (Duh!)
      width: 150,
    },
    {
      id: "settlementType",
      title: t("Headers.Settle Type"),
      field: "settlementType",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "price",
      title: t("Headers.Price"),
      field: "price",
      render: (rowData) => rowData?.price && floatRenderer(rowData?.price, 0, 5),
      exportConfig: { render: (rowData) => currencyRenderer(rowData.price) },
      type: "numeric",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "principalAmount",
      title: t("Headers.Principal Amount"),
      field: "principalAmount",
      render: (rowData) => floatRenderer(rowData.principalAmount),
      exportConfig: { render: (rowData) => currencyRenderer(rowData.principalAmount) },
      type: "numeric",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "accruedInterest",
      title: t("Headers.Accrued Interest"),
      field: "accruedInterest",
      render: (rowData) => floatRenderer(rowData.accruedInterest),
      exportConfig: { render: (rowData) => currencyRenderer(rowData.accruedInterest) },
      type: "numeric",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "settlementAmount",
      title: t("Headers.Settle Amount"),
      field: "settlementAmount",
      render: (rowData) => floatRenderer(rowData.settlementAmount) ?? FALLBACK_VALUE,
      exportConfig: {
        render: (rowData) => currencyRenderer(rowData.settlementAmount) ?? FALLBACK_VALUE,
      },
      type: "numeric",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "counterparty",
      title: t("Headers.Cpty"),
      field: "counterparty",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "counterpartySSI",
      title: t("Headers.Cpty SSI"),
      field: "counterpartySSI",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "portfolioAccountNumber",
      title: "Account Number",
      field: "portfolioAccountNumber",
      width: 150,
    },
    {
      id: "portfolioName",
      title: "Portfolio Name",
      field: "portfolioName",
      width: 150,
    },
    {
      id: "paymentEvidenceUploaded",
      title: t("Headers.Evidence Uploaded"),
      field: "paymentEvidenceUploaded",
      width: 150,
    },
  ];

  const listOfExternalSecurityNames = [
    ...new Set(data.map(({ externalSecurity }) => externalSecurity?.name)),
  ].sort();
  const listOfISINValues = [
    ...new Set(data.map(({ externalSecurity }) => externalSecurity?.isin)),
  ].sort();

  const externalSecurityOptionsList = listOfExternalSecurityNames.map((item) => ({
    label: item,
    value: item,
  }));

  const isinOptionsList = listOfISINValues.map((item) => ({
    label: item,
    value: item,
  }));

  const settlementStatusOptionsList = [
    {
      label: t(securityTradeSettlementStatusEnum.primaryIssuance.PENDING_SETTLEMENT),
      value: securityTradeSettlementStatusEnum.primaryIssuance.PENDING_SETTLEMENT,
    },
    {
      label: t(securityTradeSettlementStatusEnum.primaryIssuance.INITIATE_SETTLEMENT),
      value: securityTradeSettlementStatusEnum.primaryIssuance.INITIATE_SETTLEMENT,
    },
    {
      label: t(securityTradeSettlementStatusEnum.primaryIssuance.APPROVED),
      value: securityTradeSettlementStatusEnum.primaryIssuance.APPROVED,
    },
    {
      label: t(securityTradeSettlementStatusEnum.primaryIssuance.SETTLED),
      value: securityTradeSettlementStatusEnum.primaryIssuance.SETTLED,
    },
    {
      label: t(securityTradeSettlementStatusEnum.primaryIssuance.FAILED),
      value: securityTradeSettlementStatusEnum.primaryIssuance.FAILED,
    },
    {
      label: t(settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED),
      value: settlementInstructionStatusEnum.ACKNOWLEDGED_ACCEPTED,
    },
    {
      label: t(settlementInstructionStatusEnum.UNMATCHED),
      value: settlementInstructionStatusEnum.UNMATCHED,
    },
    {
      label: t(settlementInstructionStatusEnum.MATCHED),
      value: settlementInstructionStatusEnum.MATCHED,
    },
    {
      label: t(settlementInstructionStatusEnum.CANCELLED),
      value: settlementInstructionStatusEnum.CANCELLED,
    },
    {
      label: t(settlementInstructionStatusEnum.CANCELLED_REQUESTED),
      value: settlementInstructionStatusEnum.CANCELLED_REQUESTED,
    },
    {
      label: t(settlementInstructionStatusEnum.REJECTED),
      value: settlementInstructionStatusEnum.REJECTED,
    },
    {
      label: settlementInstructionStatusEnum.APPROVAL_REQUIRED,
      value: settlementInstructionStatusEnum.APPROVAL_REQUIRED,
    },
  ];

  // !FIX THIS MESS
  const listOfIssuerCorporateNames = [...new Set(data.map(({ issuer }) => issuer))];
  const listOfInvestorCorporateNames = [...new Set(data.map(({ investor }) => investor))];

  const listOfEntityNames = [...listOfIssuerCorporateNames, ...listOfInvestorCorporateNames].sort();

  const entityNameOptionsList = listOfEntityNames.map((item) => ({
    label: item,
    value: item,
  }));
  console.log("listOfEntityNames", listOfIssuerCorporateNames, listOfInvestorCorporateNames);
  return (
    <Fragment>
      <div
        style={{
          marginBottom: "1rem",
        }}
      >
        <FilterProvider tableKey="custody_and_settlement">
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <TableFiltersWrapper
              tableRef={tableRef}
              data={data}
              columns={tableColumns.slice(1, -1)}
              open={true}
              hideExportButtons
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={6}>
                  <DateRangePicker
                    name="entryDateRange"
                    label={t("Filters.Entry Date")}
                    defaultFilter="none"
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <DateRangePicker
                    name="tradeDateRange"
                    label={t("Filters.Trade Date")}
                    defaultFilter="none"
                  />
                </Grid>

                <Grid item xs={12} md={12} lg={6}>
                  <DateRangePicker
                    name="settlementDateRange"
                    label={t("Filters.Settlement Date")}
                    defaultFilter="none"
                  />
                </Grid>
                {showAllFilters && (
                  <Fragment>
                    <Grid item xs={12} md={6} lg={3}>
                      <DropdownFilter name="isin" label="ISIN" options={isinOptionsList} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                      <DropdownFilter
                        name="security"
                        label="Security"
                        options={externalSecurityOptionsList}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                      <DropdownFilter
                        name="status"
                        label="Status"
                        options={settlementStatusOptionsList}
                        isMulti
                      />
                    </Grid>
                  </Fragment>
                )}
                <Grid item xs={12} md={6} lg={3}></Grid>

                {showAllFilters && <Grid item xs={12} md={6} lg={3}></Grid>}

                <Grid item xs={12} md={6} lg={3}>
                  <ExportButtons tableRef={tableRef} name="Securities Registration Report" />
                </Grid>
              </Grid>
            </TableFiltersWrapper>
          </div>
          <FilterConsumer>
            {({ filters, filterColumns }) => {
              const preFilteredData = filters.hasOwnProperty("search") ? data : data;
              const filteredData = data
                .filter((row) => {
                  if (
                    filters?.entryDateRange?.value?.startDate &&
                    filters?.entryDateRange?.value?.endDate
                  ) {
                    const { startDate, endDate } = filters?.entryDateRange.value;
                    const isInRange = dateWithinRange(row?.entryDate, startDate, endDate);
                    return row.entryDate ? isInRange : null;
                  }
                  return true;
                })
                .filter((row) => {
                  // Trade Date range Filter
                  if (
                    filters?.tradeDateRange?.value?.startDate &&
                    filters?.tradeDateRange?.value?.endDate
                  ) {
                    const { startDate, endDate } = filters?.tradeDateRange.value;
                    const isInRange = dateWithinRange(row?.tradeDate, startDate, endDate);
                    return row.tradeDate ? isInRange : null;
                  }
                  return true;
                })
                .filter((row) => {
                  // Settlement Date range Filter
                  if (
                    filters?.settlementDateRange?.value?.startDate &&
                    filters?.settlementDateRange?.value?.endDate
                  ) {
                    const { startDate, endDate } = filters?.settlementDateRange.value;
                    const isInRange = dateWithinRange(row?.settlementDate, startDate, endDate);
                    return row.settlementDate ? isInRange : null;
                  }
                  return true;
                })
                .filter((row) => {
                  // ISIN Filter
                  if (filters?.isin) {
                    return row.isin === filters?.isin?.value?.value;
                  }
                  return true;
                })
                .filter((row) => {
                  // Security Filter
                  if (filters?.security) {
                    const res = row.security === filters?.security?.value?.value;
                    return res;
                  }
                  return true;
                })
                .filter((row) => {
                  // Entity Filter
                  if (filters?.entity) {
                    return (
                      row.investor === filters?.entity?.value?.value ||
                      row.issuer === filters?.entity?.value?.value
                    );
                  }
                  return true;
                })
                .filter((row) => {
                  // Status Filter
                  if (filters?.status) {
                    const multiStatusKeys = [];
                    const result = filters?.status?.value.map((v) => {
                      multiStatusKeys.push(v.value);
                      return multiStatusKeys.includes(
                        row.tradeSettlementOrSettlementInstructionStatus
                      );
                    });

                    // console.log(result);

                    return result.includes(true);
                  }
                  return true;
                });
              console.log(filterColumns.shownColumns);
              return (
                <div data-testid="security-trades-table">
                  <MaterialTable
                    tableRef={tableRef}
                    size="small"
                    title=""
                    style={{
                      boxShadow: "none",
                    }}
                    columns={[EMPTY_COLUMN, ...filterColumns.shownColumns]}
                    data={filteredData}
                    actions={[
                      {
                        icon: () => (
                          <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />
                        ),
                        onClick: (event, rowData) => {
                          setAnchorEl(event.currentTarget);
                          setCurrentlySelectedRowData(rowData);
                        },
                      },
                    ]}
                    options={{
                      ...tableStyles,
                      fixedColumns: {
                        left: 0,
                      },
                      toolbar: false,
                      pageSize: 10,
                      search: false,
                      draggable: false,
                    }}
                    localization={mtableLocalization}
                    isLoading={isLoading}
                  />
                  <TableActionMenu
                    anchorEl={anchorEl}
                    actions={actions}
                    handleCloseMenu={handleCloseMenu}
                  />
                </div>
              );
            }}
          </FilterConsumer>
        </FilterProvider>
      </div>
    </Fragment>
  );
};

export default SecurityTradesTable;

SecurityTradesTable.defaultProps = {
  entityUserType: "",
};

export { generateSecurityTradesTableRowData };
