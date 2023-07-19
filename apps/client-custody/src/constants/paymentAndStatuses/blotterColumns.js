import partition from 'lodash.partition';
import find from 'lodash.find';
import remove from 'lodash.remove';
import concat from 'lodash.concat';
import { dateRenderer, floatRenderer, currencyRenderer, titleRenderer, readyToSettleRenderer } from './renderers';

import { columnConstants } from './columns';

const dateSizing = 120;
const currencySize = 100;
const uuidSize = 350;
const numberSize = 75;
const ibanSize = 250;
const longNameSize = 400;

export const issuanceColumns = [
  // {
  //   title: '',
  //   field: columnConstants.EMPTY,
  //   width: 1,
  // },
  {
    title: 'Maturity Date',
    field: columnConstants.MATURITY_DATE,
    type: 'date',
    render: (rowData) => dateRenderer(rowData.sukuk.maturityDate),
    width: dateSizing,
  },
  {
    title: 'Issue Date',
    field: columnConstants.ISSUE_DATE,
    type: 'date',
    render: (rowData) => dateRenderer(rowData.sukuk.issueDate),
    width: dateSizing,
  },
  {
    title: 'Denomination',
    field: columnConstants.DENOMINATION,
    render: (rowData) => currencyRenderer(rowData.sukuk.denominationName.value),
    width: currencySize,
  },
  { title: 'Profit Rate', field: columnConstants.PROFIT_RATE, width: 100 },
  { title: 'Frequency', field: columnConstants.FREQUENCY, width: 150 },
  {
    title: 'Original Price',
    field: columnConstants.ORIGINAL_PRICE,
    render: (rowData) => floatRenderer(rowData.sukuk.issuePrice),
    width: numberSize,
  },
  {
    title: 'Price',
    field: columnConstants.PRICE,
    render: (rowData) => floatRenderer(rowData.sukuk.issuePrice),
    width: numberSize,
  },
  {
    title: 'Original Profit Rate',
    field: columnConstants.ORIGINAL_PROFIT_RATE,
    render: (rowData) => floatRenderer(rowData.sukuk.profitRate),
    width: 150,
  },
  {
    title: 'Profit Rate',
    field: columnConstants.PROFIT_RATE,
    render: (rowData) => floatRenderer(rowData.sukuk.profitRate),
    width: numberSize,
  },
  {
    title: 'Original Issuance Amount',
    field: columnConstants.ORIGINAL_ISSUANCE_AMOUNT,
    render: (rowData) => currencyRenderer(rowData.sukuk.issuanceAmount),
    width: currencySize,
  },
  {
    title: 'Issuance Amount',
    field: columnConstants.ISSUANCE_AMOUNT,
    render: (rowData) => currencyRenderer(rowData.sukuk.issuanceAmount),
    width: currencySize,
  },
  { title: 'WSN', field: columnConstants.WSN, width: 150 },
  { title: 'ISIN', field: columnConstants.ISIN, width: 150 },
  { title: 'Ticker', field: columnConstants.TICKER },
  { title: 'Hybrid Sukuk Type', field: columnConstants.HYBRID_SUKUK_TYPE },
  { title: 'Security Short Name', field: columnConstants.SECURITY_SHORT_NAME },
  {
    title: 'Security Long Name',
    field: columnConstants.SECURITY_LONG_NAME,
    render: (rowData) => {
      const securityShortName = rowData.sukuk.securityShortName.split(' ');
      const coupon = securityShortName[1];
      return `${rowData.sukuk.name} ${coupon} ${dateRenderer(rowData.sukuk.maturityDate)}`;
    },
    width: longNameSize,
  },
  { title: 'Issuance Name', field: columnConstants.ISSUANCE_NAME, width: 250 },
  {
    title: 'Settlement Date',
    field: columnConstants.SETTLEMENT_DATE,
    type: 'date',
    render: (rowData) => dateRenderer(rowData.sukuk.issueDate),
    width: dateSizing,
  },
  { title: 'Settlement Status', field: columnConstants.SETTLEMENT_STATUS, width: 100 },
  { title: 'Settlement Type', field: columnConstants.SETTLEMENT_TYPE, width: 75 },
  {
    title: 'Security Status',
    field: columnConstants.SECURITY_STATUS,
    render: (rowData) => titleRenderer(rowData.sukuk.securityStatus),
    width: 175,
  },
  {
    title: 'Net Transfer Amt',
    field: columnConstants.NET_TRANSFER_AMT,
    render: (rowData) => currencyRenderer(rowData.netSettleAmount),
    width: 150,
  },
  { title: 'Num of Cert ( Nominal )', field: columnConstants.NUM_OF_CERT, width: 190 },
  {
    title: 'Ready to Settle',
    field: columnConstants.READY_TO_SETTLE,
    custom: columnConstants.READY_TO_SETTLE,
    render: (rowData) => readyToSettleRenderer(rowData.readyToSettle),
    width: 100,
  },
  { title: 'Country of Risk', field: columnConstants.COUNTRY_OF_RISK },
  {
    title: 'Value Date',
    field: columnConstants.VALUE_DATE,
    type: 'date',
    render: (rowData) => dateRenderer(rowData.valueDate),
    width: dateSizing,
  },
];

export const tradeColumns = [
  {
    title: 'Trade Date',
    field: columnConstants.TRADE_DATE,
    type: 'date',
    render: (rowData) => dateRenderer(rowData.sukuk.tradeDate),
    width: dateSizing,
  },
  { title: 'Currency', field: columnConstants.CURRENCY, width: 75 },
  {
    title: 'Trade ID',
    field: columnConstants.TRADE_ID,
    render: (rowData) => rowData.sukuk.trade[0]?.id,
    width: uuidSize,
  },
  {
    title: 'Trade Status',
    field: columnConstants.TRADE_STATUS,
    render: (rowData) => titleRenderer(rowData.sukuk.trade[0]?.status),
    width: 100,
  },
  {
    title: 'Trade Type',
    field: columnConstants.TRADE_TYPE,
    render: (rowData) => titleRenderer(rowData.sukuk.trade[0]?.type),
    width: 100,
  },
  {
    title: 'Direction',
    field: columnConstants.DIRECTION,
    render: (rowData) => titleRenderer(rowData.sukuk.trade[0]?.direction),
    width: 100,
  },
  { title: 'Event Type', field: columnConstants.EVENT_TYPE },
  { title: 'Record Date', field: columnConstants.RECORD_DATE, type: 'date' },
  { title: 'Pmt CCY', field: columnConstants.PAYMENT_CURRENCY },
  { title: 'Number of Days', field: columnConstants.NUMBER_OF_DAYS },
  { title: 'Coupon Period', field: columnConstants.COUPON_PERIOD },
  { title: 'Actual Pay Date', field: columnConstants.ACTUAL_PAY_DATE, type: 'date' },
  { title: 'Tax Amount', field: columnConstants.TAX_AMOUNT },
  { title: 'Other Charges', field: columnConstants.OTHER_CHARGES },
  { title: 'Net Amount', field: columnConstants.NET_AMOUNT },
  { title: 'Extra Rate', field: columnConstants.EXTRA_RATE },
  // { title: 'Final Amount after Conversion', field: 'finalAmountAfterConversion' },
  // { title: 'Address/PO Box', field: 'address' },
  { title: 'ICSD', field: columnConstants.ICSD },
  { title: 'Available Securities', field: columnConstants.AVAILABLE_SECURITIES },
  { title: 'Blocked Securities', field: columnConstants.BLOCKED_SECURITIES },
];

export const accountColumns = [
  { title: 'Investor Name', field: columnConstants.INVESTOR_NAME },
  { title: 'Investor ID', field: columnConstants.INVESTOR_ID, width: uuidSize },
  { title: 'Investor W IBAN', field: columnConstants.INVESTORY_W_IBAN, width: ibanSize },
  {
    title: 'Investor Cash Acct',
    field: columnConstants.INVESTOR_CASH_ACCT,
    width: 150,
  },
  {
    title: 'Investor Cash Acct Balance',
    field: columnConstants.INVESTOR_CASH_ACCT_BALANCE,
    render: (rowData) => currencyRenderer(rowData.investorEntity.wethaqAccount.accountBalance),
    width: 150,
  },
  { title: 'Investor Cash Acc Currency', field: columnConstants.INVESTOR_CASH_ACCT_CURRENCY, width: 150 },
  {
    title: 'Investor Cash Acct Status',
    field: columnConstants.INVESTOR_CASH_ACCT_STATUS,
    render: (rowData) => titleRenderer(rowData.investorEntity.wethaqAccount.status),
    width: 150,
  },
  {
    title: 'Investor Sec Acct',
    field: columnConstants.INVESTOR_SEC_ACCT,
    width: 150,
  },
  {
    title: 'Investor Sec Acct Balance',
    field: columnConstants.INVESTOR_SEC_ACCT_BALANCE,
    render: (rowData) => currencyRenderer(rowData.investorSecuritiesAccountBalance),
    width: 150,
  },
  {
    title: 'From Sec Acct',
    field: columnConstants.FROM_SEC_ACCT,
    width: 150,
  },
  {
    title: 'To Sec Acct',
    field: columnConstants.TO_SEC_ACCT,
    width: 150,
  },
  {
    title: 'Quantity',
    field: columnConstants.QUANTITY,
    width: 150,
  },
  {
    title: 'Participation ( INV )',
    field: columnConstants.PARTICIPATION_INV,
    render: (rowData) => titleRenderer(rowData.participationStatus),
  },
  {
    title: 'Admission ( LA OB )',
    field: columnConstants.ADMISSION_LA_OB,
    width: uuidSize,
    render: (rowData) => titleRenderer(rowData.admissionStatus),
  },
  { title: 'Obligor', field: columnConstants.OBLIGOR },
  { title: 'Arranger', field: columnConstants.ARRANGER },
  { title: 'Issuer Name', field: columnConstants.ISSUER_NAME },
  { title: 'Issuer ID', field: columnConstants.ISSUER_ID, width: uuidSize },
  { title: 'Issuer W IBAN', field: columnConstants.ISSUER_W_IBAN, width: ibanSize },
  {
    title: 'Issuer Cash Acct',
    field: columnConstants.ISSUER_CASH_ACCT,
    width: 150,
  },
  {
    title: 'Issuer Cash Acct Balance',
    field: columnConstants.ISSUER_CASH_ACCT_BALANCE,
    render: (rowData) => currencyRenderer(rowData.issuer.wethaqAccount.accountBalance),
    width: 150,
  },
  { title: 'Issuer Cash Acct CCY', field: columnConstants.ISSUER_CASH_ACCT_CCY, width: 150 },
  {
    title: 'Issuer Cash Acct Status',
    field: columnConstants.ISSUER_CASH_ACCT_STATUS,
    render: (rowData) => titleRenderer(rowData.issuer.wethaqAccount.status),
    width: 150,
  },
  {
    title: 'Issuer Sec Acct',
    field: columnConstants.ISSUER_SEC_ACCT,
    width: 150,
  },
  {
    title: 'Issuer Sec Acct Balance',
    field: columnConstants.ISSUER_SEC_ACCT_BALANCE,
    render: (rowData) => currencyRenderer(rowData.issuerSecuritiesAccountBalance),
    editable: 'always',
    width: 150,
  },
];

export const preSetColumns = [
  {
    key: 'entireBlotter',
    name: 'Entire Blotter',
    columns: [...issuanceColumns, ...tradeColumns, ...accountColumns].map((column) => column.field),
  },
  {
    key: 'defaultBlotter',
    name: 'Default Blotter',
    columns: [
      columnConstants.SETTLEMENT_STATUS,
      columnConstants.TRADE_STATUS,
      columnConstants.SECURITY_STATUS,
      columnConstants.SETTLEMENT_TYPE,
      columnConstants.READY_TO_SETTLE,

      columnConstants.TRADE_DATE,
      columnConstants.VALUE_DATE,
      columnConstants.SETTLEMENT_DATE,

      columnConstants.DENOMINATION,
      columnConstants.PROFIT_RATE,
      columnConstants.FREQUENCY,
      columnConstants.WSN,
      columnConstants.ISIN,
      columnConstants.TICKER,
      columnConstants.COUNTRY_OF_RISK,
      columnConstants.ISSUANCE_NAME,
      columnConstants.SECURITY_LONG_NAME,
      columnConstants.SECURITY_SHORT_NAME,
      columnConstants.ISSUANCE_AMOUNT,
      columnConstants.CURRENCY,
      columnConstants.MATURITY_DATE,
      columnConstants.ISSUE_DATE,

      columnConstants.TRADE_ID,
      columnConstants.TRADE_TYPE,
      columnConstants.DIRECTION,
      columnConstants.PRICE,
      columnConstants.PAYMENT_CURRENCY,
      columnConstants.ACTUAL_PAY_DATE,
      columnConstants.NET_TRANSFER_AMT,

      columnConstants.ISSUER_NAME,
      columnConstants.ISSUER_CASH_ACCT_BALANCE,
      columnConstants.ISSUER_W_IBAN,
      columnConstants.ISSUER_ID,
      columnConstants.ISSUER_CASH_ACCT_CCY,
      columnConstants.ISSUER_CASH_ACCT_STATUS,

      columnConstants.INVESTOR_NAME,
      columnConstants.INVESTOR_CASH_ACCT_BALANCE,
      columnConstants.INVESTORY_W_IBAN,
      columnConstants.INVESTOR_ID,
      columnConstants.INVESTOR_CASH_ACCT_CURRENCY,
      columnConstants.INVESTOR_CASH_ACCT_STATUS,

      columnConstants.ISSUER_SEC_ACCT,
      columnConstants.ISSUER_SEC_ACCT_BALANCE,
      columnConstants.ISSUER_CASH_ACCT,
      columnConstants.INVESTOR_SEC_ACCT,
      columnConstants.INVESTOR_SEC_ACCT_BALANCE,
      columnConstants.INVESTOR_CASH_ACCT,
      columnConstants.FROM_SEC_ACCT,
      columnConstants.TO_SEC_ACCT,
      columnConstants.QUANTITY,
    ],
  },
  {
    key: 'settlementConfirmation',
    name: 'Settlement Confirmation',
    columns: [
      columnConstants.TRADE_DATE,
      columnConstants.SETTLEMENT_DATE,
      columnConstants.SECURITY_SHORT_NAME,
      columnConstants.ISSUANCE_NAME,
      columnConstants.WSN,
      columnConstants.NUM_OF_CERT,
      columnConstants.INVESTOR_CASH_ACCT_CURRENCY,
      columnConstants.PRICE,
      columnConstants.ISSUANCE_AMOUNT,
      columnConstants.PROFIT_RATE,
      columnConstants.NET_TRANSFER_AMT,
      columnConstants.SETTLEMENT_TYPE,
      columnConstants.INVESTOR_NAME,
      columnConstants.ARRANGER,
    ],
  },
  {
    key: 'paymentConfirmation',
    name: 'Payment Confirmation',
    columns: [
      columnConstants.INVESTOR_NAME,
      columnConstants.INVESTORY_W_IBAN,
      columnConstants.SECURITY_SHORT_NAME,
      columnConstants.WSN,
      columnConstants.ISSUANCE_NAME,
      columnConstants.SETTLEMENT_TYPE,
      columnConstants.EVENT_TYPE,
      columnConstants.RECORD_DATE,
      columnConstants.PAYMENT_CURRENCY,
      columnConstants.PROFIT_RATE,
      columnConstants.NUMBER_OF_DAYS,
      columnConstants.COUPON_PERIOD,
      columnConstants.TRADE_TYPE,
      columnConstants.INVESTOR_CASH_ACCT_CURRENCY,
      columnConstants.INVESTORY_W_IBAN,
      columnConstants.ACTUAL_PAY_DATE,
      columnConstants.ISSUANCE_AMOUNT,
      columnConstants.TAX_AMOUNT,
      columnConstants.OTHER_CHARGES,
      columnConstants.EXTRA_RATE,
    ],
  },
  {
    key: 'securitiesHoldingStatement',
    name: 'Cash + Securities Holding Statement',
    columns: [
      columnConstants.ISSUE_DATE,
      columnConstants.ISSUE_DATE.INVESTOR_NAME,
      columnConstants.INVESTORY_W_IBAN,
      columnConstants.WSN,
      columnConstants.ICSD,
      columnConstants.MATURITY_DATE,
      columnConstants.ISSUANCE_NAME,
      columnConstants.AVAILABLE_SECURITIES,
      columnConstants.BLOCKED_SECURITIES,
    ],
  },
];

const sortArrayAccordingToPreset = (shownColumns, preSetKeys) => {
  let sortedArray = [];
  preSetKeys.map((key) => {
    const foundColumns = find(shownColumns, (column) => key === column.field);
    remove(shownColumns, (column) => key === column.field);
    if (foundColumns) {
      sortedArray = concat(sortedArray, foundColumns);
    }
    return false;
  });
  return sortedArray;
};

export const defaultColumnsSelected = (key) => {
  const option = find(preSetColumns, (preset) => key === preset.key);
  const defaultColumns = [...issuanceColumns, ...tradeColumns, ...accountColumns];
  const partitionedArray = partition(defaultColumns, (column) => option.columns.includes(column.field));
  const newShown = partitionedArray[0];
  const newHidden = partitionedArray[1];

  const sortedShownArray = sortArrayAccordingToPreset(newShown, option.columns);

  return { shown: sortedShownArray, hidden: newHidden };
};

export const filteredColumns = {
  EMRGO_SERVICES: [],
  ISSUER: [
    columnConstants.INVESTOR_CASH_ACCT_BALANCE,
    columnConstants.INVESTORY_W_IBAN,
    columnConstants.INVESTOR_ID,
    columnConstants.INVESTOR_CASH_ACCT_CURRENCY,
    columnConstants.INVESTOR_CASH_ACCT_STATUS,
    columnConstants.INVESTOR_SEC_ACCT,
    columnConstants.INVESTOR_SEC_ACCT_BALANCE,
    columnConstants.INVESTOR_CASH_ACCT,
    columnConstants.TO_SEC_ACCT,
    columnConstants.FROM_SEC_ACCT,
  ],
  INVESTOR: [
    columnConstants.ISSUER_CASH_ACCT_BALANCE,
    columnConstants.ISSUER_W_IBAN,
    columnConstants.ISSUER_ID,
    columnConstants.ISSUER_CASH_ACCT_CCY,
    columnConstants.ISSUER_CASH_ACCT_STATUS,
    columnConstants.ISSUER_SEC_ACCT,
    columnConstants.ISSUER_SEC_ACCT_BALANCE,
    columnConstants.ISSUER_CASH_ACCT,
    columnConstants.FROM_SEC_ACCT,
    columnConstants.TO_SEC_ACCT,
  ],
  OBLIGOR: ['settlementStatus'],
  ARRANGER: [],
  CO_ARRANGER: [],
};
