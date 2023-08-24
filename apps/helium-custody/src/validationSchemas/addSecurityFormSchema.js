import * as Yup from "yup";

const addSecurityFormSchema = Yup.object().shape({
  name: Yup.string().nullable().required("Security Name is required"),
  shortName: Yup.string().nullable().required("Short Name is required"),
  longName: Yup.string().nullable().required("Long Name is required"),
  issuanceName: Yup.string().nullable().required("Issuance Name is required"),
  // wsn: Yup.string().nullable().required('WSN is required'),
  isin: Yup.string().nullable().required("ISIN is required"),
  ticker: Yup.string().nullable().required("Ticker is required"),
  profitRate: Yup.number().nullable().required("Rate is required"),
  country: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Country is required"),
  currency: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Currency is required"),
  issuanceAmount: Yup.string().nullable().required("Issuance Amount is required"),
  denomination: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Denomination is required"),
  issueDate: Yup.date().nullable().required("Issue date is required"),
  maturityDate: Yup.date().nullable().required("Maturity Date is required"),
  status: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Status is required"),
  frequency: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Frequency is required"),
});

export default addSecurityFormSchema;
