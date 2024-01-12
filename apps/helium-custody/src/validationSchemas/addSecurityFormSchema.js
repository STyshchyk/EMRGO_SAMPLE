import * as Yup from "yup";

const addSecurityFormSchema = Yup.object().shape({
  name: Yup.string().nullable().required("Security Name is required"),
  shortName: Yup.string().nullable().required("Short Name is required"),
  longName: Yup.string().nullable().required("Long Name is required"),
  issuanceName: Yup.string().nullable().required("Issuance Name is required"),
  // wsn: Yup.string().nullable().required('WSN is required'),
  isin: Yup.string().nullable().required("ISIN is required"),
  ticker: Yup.string().nullable(),
  profitRate: Yup.number().min(0).max(100).nullable().required("Rate is required"),
  country: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Country is required"),
  currency: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Currency is required"),
  denomination: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Denomination is required"),
  issuanceAmount: Yup.string()
  .nullable()
  .required('Issuance Amount is required')
  .test(
    'is-multiple-check',
    'Issuance Amount must be a multiple of Denomination',
    function (value) {
      const { denomination } = this.parent; // Access the parent object
      const amount = parseFloat(value);
      const denominationValue = parseFloat(denomination.label);
      // Check if issuanceAmount is a multiple of denomination
      if (amount % denominationValue === 0) {
        return true;
      }

      return false;
    }
  ),
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
