import { IPendingSettlementIssuance } from "../PostTrade.types";

const pendingSettlement: IPendingSettlementIssuance[] = [
  {
    id: 1,
    issuer: "Company",
    type: "sukuk",
    currency: "USD",
    amount: "50M",
    return: "8%",
    tenor: "5 years",
    isin: "123456789",
    sellSide: "Sell 1, Sell 2",
    status: "payment-pending",
    custodian: "Emrgo",
  },
  {
    id: 2,
    issuer: "Company",
    type: "bonds",
    currency: "USD",
    amount: "50M",
    return: "8%",
    tenor: "5 years",
    isin: "123456789",
    sellSide: "Sell 1, Sell 2",
    status: "payment-received",
    custodian: "Emrgo",
  },
  {
    id: 3,
    issuer: "Company",
    type: "structured-products",
    currency: "USD",
    amount: "50M",
    return: "8%",
    tenor: "5 years",
    isin: "123456789",
    sellSide: "Sell 1, Sell 2",
    status: "failure",
    custodian: "Emrgo",
  },
  {
    id: 4,
    issuer: "Company",
    type: "certificates",
    currency: "USD",
    amount: "50M",
    return: "8%",
    tenor: "5 years",
    isin: "123456789",
    sellSide: "Sell 1, Sell 2",
    status: "failure",
    custodian: "Emrgo",
  },
];

export default pendingSettlement;