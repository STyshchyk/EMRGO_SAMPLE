import { IPaymentInstruction } from "../PostTrade.types";

const paymentInstruction: IPaymentInstruction = {
  id: 1,
  security: "Security",
  settlementAmount: "50M",
  settlementDate: "04/05/2021",
  entity: "BROKER 1",
  currency: "USD",
  fullName: "Bilal Mohammed",
  label: "Client Omnibus Account",
  bankName: "ENBD",
  iban: "AE000000123456789",
  swift: "BANKRFES",
  address: "Sheikh Zayed Road",
  country: "UAE",
  postCode: "73847",
  tradeIdentifier: "EMGO3546273",
};

export default paymentInstruction;
