import { ICustodyIssuance } from "../PostTrade.types";

const custody: ICustodyIssuance[] = [
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
    custodian: "Emrgo",
  },
];

export default custody;
