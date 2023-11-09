import * as Yup from "yup";
const maxLimit = 999999999999999;
const minLimit = 1;
const addFXTransactionFormSchema = Yup.object().shape({
  entity: Yup.object().shape({
      label:Yup.string(),
      value:Yup.string()
  }).nullable().required("Entity is required"),
  fromAmount: Yup.number().min(minLimit,'Must be non-zero').max(maxLimit, `Must be at most 15 digits`).nullable().required("From Amount is required"),
  fromCurrency: Yup.object().shape({
      label:Yup.string(),
      value:Yup.string()
  }).nullable().required("From Currency is required"),
  fromAccount: Yup.object().shape({
      label:Yup.string(),
      value:Yup.string()
  }).nullable().required("Debit Account is required"),

  bankRate: Yup.number().min(minLimit,'Must be non-zero').max(maxLimit, `Must be at most 15 digits`).required("Bank rate is required"),
  markupRate: Yup.number().min(0).max(maxLimit, `Must be at most 15 digits`).required("Markup rate is required"),
  clientRate: Yup.number().min(minLimit,'Must be non-zero').max(maxLimit, `Must be at most 15 digits`).required("Client rate is required"),
  
  bankAmount: Yup.number().min(minLimit,'Must be non-zero').max(maxLimit, `Must be at most 15 digits`).nullable().required("Bank Amount is required"),
  markupAmount: Yup.number().min(minLimit,'Must be non-zero').max(maxLimit, `Must be at most 15 digits`).nullable().required("Markup Amount is required"),
  clientAmount: Yup.number().min(minLimit,'Must be non-zero').nullable().required("Client Amount is required"),

  toCurrency: Yup.object().shape({
      label:Yup.string(),
      value:Yup.string()
  }).nullable().required("To Currency is required"),
  toAccount: Yup.object().shape({
      label:Yup.string(),
      value:Yup.string()
  }).nullable().required("Credit Account is required"),

  narrative: Yup.string().nullable(),
});

export default addFXTransactionFormSchema;
