import { IPendingExecutionIssuance } from "../TradeManagement.types";

const pendingExecution: IPendingExecutionIssuance[] = [
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
    status: "pending",
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
    status: "in-review",
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
    status: "rejected",
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
    status: "rejected",
  },
];

export default pendingExecution;
