import * as Yup from "yup";

const addSettlementInstructionFormSchema = Yup.object().shape({
  counterpartySelectOption: Yup.object().required("Counterparty is required"),
  counterpartySSISelectOption: Yup.object().required("SSI is required"),
  externalSecuritySelectOption: Yup.object().required("Security is required"),
  price: Yup.string().when("settlementTypeSelectOption", {
    is: (value) => ["DFOP", "RFOP"].includes(value?.label),
    then: () =>
      Yup.string().test("maxValue", "Must be at most 10 digits", (value) => {
        if (typeof value === 'string' && !isNaN(Number(value))) {
          return value.length <= 10;
        } 
        return true;
      }),
    otherwise: () =>
      Yup.string()
        .required("Price is required")
        .test("maxValue", "Must be at most 10 digits", (value) => {
          if (typeof value === 'string' && !isNaN(Number(value))) {
            return value.length <= 10;
          }
          return true;
        }),
  }),
  quantity: Yup.string()
    .required("Quantity is required")
    .test("maxValue", "Maximum value is 1000000", (value) => {
      if (!isNaN(Number(value))) {
        return Number(value) <= 10000000;
      }
      return true;
    }),
  settlementAmount: Yup.string().when("settlementTypeSelectOption", {
    is: (value) => ["DFOP", "RFOP"].includes(value?.label),
    then: () => Yup.string(),
    otherwise: () => Yup.string().required(),
  }),
  settlementDate: Yup.date().nullable().required("Settlement date is required"),
  settlementTypeSelectOption: Yup.object().nullable().required("Settlement type is required"),
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
    otherwise: () =>
      Yup.string()
        .required("Accrued Interest is required")
        .test("maxValue", "Must be at most 12 digits", (value) => {
          if (!isNaN(Number(value))) {
            return value.length <= 12;
          }
          return true;
        }),
  }),
});

export default addSettlementInstructionFormSchema;
