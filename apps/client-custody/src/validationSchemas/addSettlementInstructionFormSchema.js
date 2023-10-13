import * as Yup from "yup";

const addSettlementInstructionFormSchema = Yup.object().shape({
  counterpartySelectOption: Yup.object().required("Counterparty is required"),
  counterpartySSISelectOption: Yup.object().required("SSI is required"),
  externalSecuritySelectOption: Yup.object().required("Security is required"),
  price: Yup.string().when("settlementTypeSelectOption", {
    is: (value) => ["DFOP", "RFOP"].includes(value?.label),
    then: () => Yup.string(),
    otherwise: () => Yup.string().required(),
  }),
  quantity: Yup.string().required(),
  settlementAmount: Yup.string().when("settlementTypeSelectOption", {
    is: (value) => ["DFOP", "RFOP"].includes(value?.label),
    then: () => Yup.string(),
    otherwise: () => Yup.string().required(),
  }),
  settlementDate: Yup.date().nullable().required("Settlement date is required"),
  settlementTypeSelectOption: Yup.object().nullable().required("Settlement type is required"),
  portfolioId: Yup.object().nullable().required("Safekeeping Account is required"),
  tradeDate: Yup.date().nullable().required("Trade date is required"),
  // new fields
  internalTradeRef: Yup.string().nullable(),
  principalAmount: Yup.string().when("settlementTypeSelectOption", {
    is: (value) => ["DFOP", "RFOP"].includes(value?.label),
    then: () => Yup.string(),
    otherwise: () => Yup.string().required(),
  }),
  accruedInterest: Yup.string().when("settlementTypeSelectOption", {
    is: (value) => ["DFOP", "RFOP"].includes(value?.label),
    then: () => Yup.string(),
    otherwise: () => Yup.string().required(),
  }),
});

export default addSettlementInstructionFormSchema;
