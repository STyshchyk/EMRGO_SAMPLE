import * as Yup from "yup";

const addFXTransactionFormSchema = Yup.object().shape({
  entity: Yup.string().nullable().required("Entity is required"),
  fromAmount: Yup.number().nullable().required("From Amount is required"),
  fromCurrency: Yup.string().nullable().required("From Currency is required"),
  fromAccount: Yup.string().nullable().required("Debit Account is required"),

  bankRate: Yup.number().min(0).required("Bank rate is required"),
  markupRate: Yup.number().min(0).required("Markup rate is required"),
  clientRate: Yup.number().min(0).required("Client rate is required"),

  bankAmount: Yup.number().min(0).nullable().required("Bank Amount is required"),
  markupAmount: Yup.number().min(0).nullable().required("Markup Amount is required"),
  clientAmount: Yup.number().min(0).nullable().required("Client Amount is required"),

  toCurrency: Yup.string().nullable().required("To Currency is required"),
  toAccount: Yup.string().nullable().required("Credit Account is required"),

  narrative: Yup.string().nullable(),
});

export default addFXTransactionFormSchema;
