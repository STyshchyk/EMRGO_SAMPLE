import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import moment from "moment";
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
// import TableFiltersWrapper from '../TableFiltersWrapper';
import tableStyles from "../../styles/cssInJs/materialTable";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import DateRangePicker from "../FilterComponents/DateRangePicker";
import DropdownFilter from "../FilterComponents/DropdownFilterUpdated";
import ExportButtons from "../FilterComponents/ExportButtons";
import TableFiltersWrapper from "../FilterComponents/TableFiltersWrapper";
import ExportTableContent from "../PDFExporter/ExportTableContent";
import ReportingTablePDFExporter from "../ReportingTablePDFExporter";

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
      <Menu
        data-testid="security-trades-table-menu-list"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
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
      </Menu>
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
  price: i.price,
  quantity: convertNumberToIntlFormat(i.quantity),
  readyToSettle: i.readyToSettle,
  referenceId: i.referenceId ?? FALLBACK_VALUE,
  security: i.externalSecurity?.name,
  securityTradeSettlementStatus: i.securityTradeSettlementStatus ?? FALLBACK_VALUE,
  securityTradeType: i.securityTradeType,
  settlementAmount: floatRenderer(i.settlementAmount) ?? FALLBACK_VALUE,
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
  principalAmount: floatRenderer(i.principalAmount),
  accruedInterest: floatRenderer(i.accruedInterest),
  internalTradeRef: i?.internalTradeRef ? i?.internalTradeRef : FALLBACK_VALUE, // api returns ""
  entityGroup: i?.entityGroup,
  userId: i?.userId,
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
      field: "paymentConfirmationFileId", // !Dev note: If paymentEvidenceUploaded value is not null then it's assumed that file has been uploaded (Duh!)
      render: (rowData) => (rowData.paymentConfirmationFileId ? "Yes" : "No"),
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
      type: "numeric",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "principalAmount",
      title: t("Headers.Principal Amount"),
      field: "principalAmount",
      type: "numeric",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "accruedInterest",
      title: t("Headers.Accrued Interest"),
      field: "accruedInterest",
      type: "numeric",
      hidden: !isIntlSecTradeSettlementWorkflowEnabled,
      width: 150,
    },
    {
      id: "settlementAmount",
      title: t("Headers.Settle Amount"),
      field: "settlementAmount",
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
      id: "paymentEvidenceUploaded",
      title: t("Headers.Evidence Uploaded"),
      field: "paymentConfirmationFileId",
      render: (rowData) => (rowData.paymentConfirmationFileId ? "Yes" : "No"),
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

  const dummyData = [{
    cashSSI: "--",
    counterparty: "INVESTOR A",
    counterpartyId: "c5df1b16-3267-4a5d-9083-02e8fce4a3fc",
    counterpartyObject: {
      id: "c5df1b16-3267-4a5d-9083-02e8fce4a3fc",
      entityId: "00000000-0000-0000-0000-000000000000",
      counterpartyId: "aINV",
      shortName: "aINV",
      longName: "INVESTOR A",
      status: null,
      createdAt: "2022-10-07T12:58:27.737983Z",
      updatedAt: "2022-10-07T12:58:27.737983Z"
    },
    counterpartySSI: "INVESTOR A+B",
    counterpartySSIObject: {
      id: "adbe238f-1012-4f6e-b6ef-cc88e2e1ad3f",
      entityId: "a981e6c5-b4bb-412d-b5ac-084af158553c",
      counterpartyId: "c5df1b16-3267-4a5d-9083-02e8fce4a3fc",
      ssiLabel: "INVESTOR A+B",
      settlementLocationId: "6ace9499-dbcb-4c34-a535-f7177404790c",
      deliveryAgentIdentifierTypeId: "91f9a412-16ee-4173-a25d-035b30470953",
      deliveryAgentIdentifier: "00000000",
      sellerIdentifierTypeId: "b0ee1c39-7e85-403b-abcb-c4a18378f825",
      sellerIdentifier: "00000000",
      safekeepingAccount: "00000000",
      status: "Active",
      createdAt: "2022-10-07T12:59:10.224994Z",
      updatedAt: "2022-10-07T12:59:10.224994Z",
      entity: {
        id: "a981e6c5-b4bb-412d-b5ac-084af158553c",
        corporateEntityName: "INVESTOR B",
        legalIdentifier: null,
        tncStatus: null,
        isActive: false,
        createdAt: "0001-01-01T00:00:00Z",
        updatedAt: "0001-01-01T00:00:00Z",
        kycId: null,
        isParentEntity: false,
        userAddedBy: null,
        entityParentId: null,
        wethaqIdKernel: 0,
        wethaqEntityId: null
      },
      settlementLocation: {
        id: "6ace9499-dbcb-4c34-a535-f7177404790c",
        name: "Euroclear",
        type: null,
        value: null,
        active: null,
        createdAt: null,
        updatedAt: null,
        order: null,
        key: null,
        label: null,
        nameAr: null,
        region: null
      },
      deliveryAgentIdentifierType: {
        id: "91f9a412-16ee-4173-a25d-035b30470953",
        name: "EB Participant ID",
        type: null,
        value: null,
        active: null,
        createdAt: null,
        updatedAt: null,
        order: null,
        key: null,
        label: null,
        nameAr: null,
        region: null
      },
      sellerIdentifierType: {
        id: "b0ee1c39-7e85-403b-abcb-c4a18378f825",
        name: "BIC",
        type: null,
        value: null,
        active: null,
        createdAt: null,
        updatedAt: null,
        order: null,
        key: null,
        label: null,
        nameAr: null,
        region: null
      }
    },
    createdAt: "2022-10-07T12:59:49.916375Z",
    currency: "USD",
    entityGroupId: "10906375-e31e-47c6-9d67-394e671be18c",
    entityId: "a981e6c5-b4bb-412d-b5ac-084af158553c",
    entryDate: "2022-10-07T12:59:49.916375Z",
    lastAmended: "2022-11-03T11:58:20.948Z",
    externalSecuritiesId: "3a0ae82c-4ee1-480d-9611-7bb8a5c118f3",
    externalSecurity: {
      id: "3a0ae82c-4ee1-480d-9611-7bb8a5c118f3",
      name: "AGR",
      shortName: "AGR 11.1 2026",
      longName: "AgriBank 11.1 2026",
      issuanceName: "AgriBank",
      wsn: null,
      isin: "US3333333333",
      ticker: "AGR",
      profitRate: "11.1000000000",
      frequency: "640ca7a3-445e-4e92-921a-2e90a6cd6491",
      countryId: "837d86f9-a03d-41da-a39b-582c7d2db178",
      maturityDate: "2026-07-06T16:01:00.000Z",
      issueDate: "2021-07-07T16:01:00.000Z",
      currency: "76dffa69-a8d9-41e6-aa43-c940d57083a5",
      issuanceAmount: "100000000",
      denomination: "17f01d38-d51b-436e-9ab6-9e99ee7c550c",
      status: "Active",
      createdAt: null,
      updatedAt: null,
      isPrimaryIssuance: false,
      issuePrice: null,
      tradeDate: null,
      csd: null,
      underlyingAssets: null,
      maturityAmount: null,
      profitRateTerms: null,
      dayCountConvention: null,
      sellingRestrictions: null,
      formOfOffering: null,
      useOfProceeds: null,
      shariahCompliance: null,
      ranking: null,
      listing: null,
      governingLaw: null,
      jurisdiction: null,
      pricingMethod: null,
      guarantor: null,
      exchangeCode: null,
      arrangerPublished: null,
      sukukType: null,
      distributionMethod: null,
      sukukId: null,
      settlementDate: null,
      assetType: null,
      denominationName: {
        id: "17f01d38-d51b-436e-9ab6-9e99ee7c550c",
        name: "1K",
        type: null,
        value: 1000,
        active: null,
        createdAt: null,
        updatedAt: null,
        order: null,
        key: null,
        label: null,
        nameAr: null,
        region: null
      },
      currencyName: {
        id: "76dffa69-a8d9-41e6-aa43-c940d57083a5",
        name: "USD",
        type: "currency",
        value: null,
        active: true,
        createdAt: "2022-08-11T14:30:01.865587Z",
        updatedAt: "2022-08-11T14:30:01.865587Z",
        order: 5,
        key: null,
        label: "US Dollar",
        nameAr: "USD",
        region: "AE"
      },
      frequencyName: {
        id: "640ca7a3-445e-4e92-921a-2e90a6cd6491",
        name: "Semi-Annually",
        type: null,
        value: 180,
        active: null,
        createdAt: null,
        updatedAt: null,
        order: null,
        key: null,
        label: null,
        nameAr: null,
        region: null
      },
      dayCountConventionName: null,
      country: {
        id: "837d86f9-a03d-41da-a39b-582c7d2db178",
        name: "United Arab Emirates",
        type: null,
        value: null,
        active: null,
        createdAt: null,
        updatedAt: null,
        order: null,
        key: null,
        label: null,
        nameAr: null,
        region: null
      }
    },
    id: "f78625aa-5a85-4028-8bff-acd24f445d51",
    investor: "INVESTOR B",
    investorCashAccountBalance: "11,000",
    investorCashAccountNo: 1000007,
    investorSecuritiesAccountBalance: "20,000",
    investorSecuritiesAccountNo: "S0000007",
    isin: "US3333333333",
    isPrimaryIssuance: false,
    issueDate: "2021-07-07T16:01:00.000Z",
    issuerCashAccountBalance: "20,000",
    issuerCashAccountNo: "S0000007",
    issuerSecuritiesAccountBalance: null,
    issuerSecuritiesAccountNo: null,
    nextCouponDate: "",
    numCerts: "0",
    paymentConfirmationFileId: null,
    price: 95.5,
    quantity: "20,000",
    readyToSettle: false,
    referenceId: "0000000081",
    security: "AGR",
    securityTradeSettlementStatus: "--",
    securityTradeType: "Settlement Inst.",
    settlementAmount: "20,000.00",
    settlementDate: "2022-10-07T12:59:18.627Z",
    settlementInstructionStatus: "Settled",
    settlementType: "RVP",
    settlementTypeId: "44b99834-a236-4e7f-8613-1ac2bbcbcded",
    sukukId: null,
    tradeDate: "2022-10-07T12:59:18.626Z",
    tradeId: null,
    tradeSettlementOrSettlementInstructionStatus: "Settled",
    type: "external",
    wsn: "--",
    principalAmount: "0.00",
    accruedInterest: "0.00",
    internalTradeRef: "--",
    entityGroup: {
      id: "10906375-e31e-47c6-9d67-394e671be18c",
      entityId: "a981e6c5-b4bb-412d-b5ac-084af158553c",
      name: "",
      entityType: null,
      isActive: null,
      createdAt: "2022-08-11T14:30:06.794461Z",
      updatedAt: "2022-08-11T14:30:06.794461Z",
      entityTypeCode: null,
      entity: {
        id: "a981e6c5-b4bb-412d-b5ac-084af158553c",
        corporateEntityName: "INVESTOR B",
        legalIdentifier: null,
        tncStatus: null,
        isActive: false,
        createdAt: "0001-01-01T00:00:00Z",
        updatedAt: "0001-01-01T00:00:00Z",
        kycId: null,
        isParentEntity: false,
        userAddedBy: null,
        entityParentId: null,
        wethaqIdKernel: 0,
        wethaqEntityId: null
      },
      wethaqAccount: {
        id: "29ee9b3d-1811-405c-9080-cfeca7007fda",
        accountBalance: 11000,
        createdAt: null,
        updatedAt: null,
        entityGroupId: "10906375-e31e-47c6-9d67-394e671be18c",
        currencyId: "76dffa69-a8d9-41e6-aa43-c940d57083a5",
        isVirtualIBAN: true,
        iban: "LU57007XJ9553Z461967",
        accountNo: 1000007,
        type: "INVESTOR",
        isActive: true,
        isArchived: false,
        lastStatementFetchDate: null,
        externalAccountNumber: null,
        openingBalance: 0,
        closingBalance: 0
      }
    },
    userId: "f5891ad7-0f58-4ee5-bb2a-fb8ae9e7d71b"
  }]
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
                        name="entity"
                        label="Entity"
                        options={entityNameOptionsList}
                      />
                    </Grid>
                  </Fragment>
                )}
                <Grid item xs={12} md={6} lg={3}>
                  <DropdownFilter
                    name="status"
                    label="Status"
                    options={settlementStatusOptionsList}
                    isMulti
                  />
                </Grid>

                {showAllFilters && <Grid item xs={12} md={6} lg={3}></Grid>}

                <Grid item xs={12} md={6} lg={3}>
                  <ExportButtons tableRef={tableRef} name="Securities Registration Report" />
                </Grid>
              </Grid>
            </TableFiltersWrapper>
          </div>
          <FilterConsumer>
            {({ filters, filterColumns }) => {
            const preFilteredData = filters.hasOwnProperty('search') ? tableRef?.current?.dataManager?.getRenderState()?.data : data;
            const filteredData = preFilteredData
                .filter((row) => {
                  if (
                    filters?.entryDateRange?.value?.startDate &&
                    filters?.entryDateRange?.value?.endDate
                  ) {
                    const { startDate, endDate } = filters?.entryDateRange.value;
                    return moment(row.entryDate).isBetween(startDate, endDate);
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
                    return moment(row.tradeDate).isBetween(startDate, endDate);
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
                    return moment(row.settlementDate).isBetween(startDate, endDate);
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
                      // console.log(statusValues);
                      // console.log(statusValues.includes(row.tradeSettlementOrSettlementInstructionStatus), row.tradeSettlementOrSettlementInstructionStatus);

                      return multiStatusKeys.includes(
                        row.tradeSettlementOrSettlementInstructionStatus
                      );
                    });

                    // console.log(result);

                    return result.includes(true);
                  }
                  return true;
                });

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
                        icon: () => <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" />,
                        onClick: (event, rowData) => {
                          setAnchorEl(event.currentTarget);
                          setCurrentlySelectedRowData(rowData);
                        },
                      },
                    ]}
                    options={{
                      ...tableStyles,
                      fixedColumns: {
                        left: 1,
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

                  {/* <ReportingTablePDFExporter ref={ref} title="Custody and Settlement" pageSize="A2">
                    <ExportTableContent
                      columns={tableColumns}
                      tableOptions={{
                        sliceRowCount: 8,
                        tableOffset: 4,
                      }}
                      data={data}
                      title={`Custody and Settlement Report`}
                    />
                  </ReportingTablePDFExporter> */}
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
