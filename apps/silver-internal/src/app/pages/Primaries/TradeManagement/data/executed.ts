import { IExecutedIssuance } from "../TradeManagement.types";

const executed: IExecutedIssuance[] = [
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
  },
];

export default executed;
